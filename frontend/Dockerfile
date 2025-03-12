FROM node:lts-alpine

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

RUN apk --no-cache add curl

WORKDIR /app

COPY package.json package.json
RUN npm install

COPY . .

CMD npm start