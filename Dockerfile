FROM node:12.15.0-alpine

RUN mkdir -p /usr/src/app
COPY . /usr/src/app

WORKDIR ./usr/src/app
RUN npm install
ENTRYPOINT []

CMD node server.js
