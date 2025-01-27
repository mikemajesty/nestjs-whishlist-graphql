FROM node:20.9.0-alpine

WORKDIR /app

COPY . ./

RUN npm install -g @nestjs/cli
RUN npm i --force
RUN npm run build

CMD [ "node", "dist/src/main.js" ]