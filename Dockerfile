FROM node:10.14.1 as builder
WORKDIR /workdir

COPY . ./

RUN yarn install
RUN yarn release

RUN cp -rf ./release ./build
