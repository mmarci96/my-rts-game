# Build the client app
FROM node:18-alpine AS client

WORKDIR /src

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine

COPY --from=client /src/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

