FROM node:23.4.0-alpine AS server 

WORKDIR ./src

COPY package.json ./src

RUN npm install

COPY . ./src

CMD ["npm", "run", "start"]
