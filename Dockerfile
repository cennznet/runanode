FROM node:10.14.1 as builder
WORKDIR /workdir

COPY . ./

RUN npm install
RUN npm release

RUN cp -rf ./release ./build
