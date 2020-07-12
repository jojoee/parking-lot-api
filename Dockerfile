FROM node:12.15.0-alpine

ENV NODE_PACKAGES_HOME=/usr/src/app

RUN mkdir -p $NODE_PACKAGES_HOME
# todo COPY should be implicit
COPY . $NODE_PACKAGES_HOME
WORKDIR $NODE_PACKAGES_HOME

RUN npm install

ENTRYPOINT []

CMD node server.js
