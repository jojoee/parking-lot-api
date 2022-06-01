# ---- Base ----
FROM node:12.15.0-alpine AS base

# set default working directory
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies

# install dependencies
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install --prod

# copy production node_modules aside
RUN cp -R node_modules prod_node_modules

# ---- Builder ----
FROM base AS builder

# copy project files
COPY ./index.js .
COPY ./package.json .
COPY ./package-lock.json .

# install
RUN npm install

# build
ENV NODE_ENV production
RUN npm run build

# ---- Runner ----
FROM base AS runner

# copy production dependencies
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules

# copy production built
COPY --from=builder /usr/src/app/bundle.js ./bundle.js
COPY ./index.html ./index.html
COPY ./package.json ./package.json

# start
ENV NODE_ENV production
ENTRYPOINT []
CMD ["npm", "run", "start"]
