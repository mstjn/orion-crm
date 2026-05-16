FROM node:22-alpine as builder

WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 


FROM nginx:alpine

COPY --from=builder /client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4200 

