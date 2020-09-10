# multi-stage builds
# https://docs.docker.com/develop/develop-images/multistage-build/

# base
FROM node:12.15.0-alpine AS base
WORKDIR /usr/src/app

# dependency
FROM base AS dependency
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install --prod
RUN cp -R node_modules prod_node_modules

# builder
FROM base AS builder
COPY ./index.js .
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
ENV NODE_ENV production
RUN npm run build

# release
FROM base AS release
COPY --from=dependency /usr/src/app/prod_node_modules ./node_modules
COPY --from=builder /usr/src/app/bundle.js ./bundle.js
COPY ./index.html ./index.html
COPY ./package.json ./package.json
ENV NODE_ENV production
ENTRYPOINT []
CMD ["npm", "run", "start"]
