FROM node:16.15.1

WORKDIR /opt/service

COPY package.json /opt/service

RUN npm install

COPY . /opt/service
CMD node src/server.js