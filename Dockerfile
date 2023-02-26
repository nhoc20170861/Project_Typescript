FROM node:18-alpine

WORKDIR /nodejs/backend

COPY package*.json ./

#ADD yarn.lock /tmp/yarn.lock

RUN rm -rf build

RUN npm install

#RUN npm install -g @babel/core @babel/cli

ADD ./ /src

RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/


RUN npm run build

CMD ["node", "dist/server.js"]