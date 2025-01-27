FROM node:20.9.0-alpine

WORKDIR /app

COPY . ./

RUN npm install -g @nestjs/cli
RUN npm i --force
RUN npm run build

RUN ls ./node_modules -al

CMD [ "node", "dist/src/main.js" ]