FROM node:alpine as builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json .

RUN npm install

FROM node:alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=builder /app/node_modules ./node_modules

USER node

COPY --chown=node:node app.js .
COPY --chown=node:node sqlite3.db .
COPY --chown=node:node public ./public/

EXPOSE 8080

CMD [ "node", "app.js" ]