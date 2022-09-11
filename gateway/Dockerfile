FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

ENTRYPOINT [ "node", "index.js" ]