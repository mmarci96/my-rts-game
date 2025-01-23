FROM node:23.4.0-alpine AS server 

WORKDIR ./app

COPY package*.json ./

COPY src ./src

RUN npm install

CMD ["npm", "run", "start"]
