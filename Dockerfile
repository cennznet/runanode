FROM node:10.14.1 as builder
WORKDIR /workdir

COPY . ./

RUN npm i npm@6.4.1 -g
RUN npm install
RUN npm run package

#### Production image
FROM nginx:1.13-alpine

EXPOSE 8080
