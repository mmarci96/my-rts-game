FROM node:18-alpine AS server 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src

ENV MONGO_URI=${MONGO_URI}

ENV PORT=${PORT}

CMD ["npm", "run", "start"]
