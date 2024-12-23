FROM node:alpine

WORKDIR /express_server

COPY package.json /express_server

RUN npm install

COPY . /express_server

CMD ["npm", "run", "start"]
