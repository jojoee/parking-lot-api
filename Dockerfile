FROM node:12.15.0-alpine

ENV NODE_PACKAGES_HOME=/usr/src/app
WORKDIR $NODE_PACKAGES_HOME

# take advantage of Docker layer caching
# https://stackoverflow.com/questions/35774714/how-to-cache-the-run-npm-install-instruction-when-docker-build-a-dockerfile
# install dependencies
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --prod

# build the app
RUN mkdir -p $NODE_PACKAGES_HOME
# todo COPY should be implicit
COPY . $NODE_PACKAGES_HOME

ENTRYPOINT []

CMD ["npm", "run", "start"]
