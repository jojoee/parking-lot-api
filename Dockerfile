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
# no builder yet
# RUN npm install
# ENV NODE_ENV production
# RUN npm run build

# ---- Tester ----
FROM builder AS tester
# no tester yet
# RUN npm ci

# ---- Runner ----
FROM base AS runner

# copy production code
RUN mkdir -p /usr/src/app
# TODO: COPY should be implicit
COPY . /usr/src/app

# copy production dependencies
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules

# copy production built
# COPY --from=builder /usr/src/app/dist ./dist

# start
ENTRYPOINT []
CMD ["npm", "run", "start"]
