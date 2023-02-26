FROM node:18-alpine

WORKDIR /nodejs/backend

COPY package*.json ./

#ADD yarn.lock /tmp/yarn.lock

RUN npm install

#RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build

CMD ["node", "build/server.js"]

#docker build -t node-docker .
#docker run -p 8443:8433 node-docker