FROM node:12.15.0-alpine

ENV NODE_PACKAGES_HOME=/usr/src/app
WORKDIR $NODE_PACKAGES_HOME

# install dependencies
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --prod

# copy file
RUN mkdir -p $NODE_PACKAGES_HOME
# todo COPY should be implicit
COPY . $NODE_PACKAGES_HOME

ENTRYPOINT []

CMD ["npm", "run", "start"]
