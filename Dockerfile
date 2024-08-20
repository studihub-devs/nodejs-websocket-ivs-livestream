
FROM node:18-alpine as builder
WORKDIR /app
ADD package.json package-lock.json /app/
COPY . /app
RUN npm install && npm run build

CMD node --max-old-space-size=4096 dist/index.js