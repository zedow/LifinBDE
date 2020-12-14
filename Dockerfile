### STAGE 1: Build ###
FROM node:14.8.0-alpine AS build

WORKDIR /usr/src/app
ENV PATH=${PATH}:./node_modules/.bin
ENV NODE_PATH=/usr/src/app/node_modules
ADD package.json ./
ADD package-lock.json ./
RUN npm ci
RUN ngcc
ADD . .
RUN ng build --prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/web /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
