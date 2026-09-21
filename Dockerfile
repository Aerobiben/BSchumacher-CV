# Use the official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build \
  && chown -R node:node /usr/src/app

ENV NODE_ENV=production
EXPOSE 3000
USER node

CMD [ "npm", "start" ]
