FROM node:22-alpine as builder

WORKDIR /server

COPY package*.json ./
RUN npm install
COPY . .

RUN npx prisma generate
RUN npm run build


FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=builder /server/dist /app/dist
COPY --from=builder /server/package.json /app/package.json
COPY --from=builder /server/prisma /app/prisma
COPY --from=builder /server/node_modules /app/node_modules

RUN npm prune --omit=dev

EXPOSE 8080
CMD ["npm", "start"]
