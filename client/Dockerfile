FROM node:18-alpine AS client

WORKDIR /src

COPY package.json .
RUN npm i

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=client /src/dist /usr/share/nginx/html

COPY ../nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


