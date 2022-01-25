# stage as builder
FROM node:14-alpine as builder

ARG TAG=dev-0.0.1
ENV TAG ${TAG}

ADD ./ /exam-frontend

WORKDIR /exam-frontend

RUN yarn

RUN TAG=${TAG} yarn run build

FROM nginx:alpine

#!/bin/sh

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /exam-frontend/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]