FROM node:12.15.0-alpine

RUN mkdir -p /parking-lot-api
COPY . /parking-lot-api

WORKDIR ./parking-lot-api
RUN npm install
# todo migration DB
CMD node server.js
