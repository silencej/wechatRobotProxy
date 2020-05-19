# Use specific version to be cache-friendly
FROM node:alpine AS cache

WORKDIR /app/
# Do this for caching node_modules between builds
COPY ./yarn.lock ./package.json ./
# COPY ./server/package.json ./server

# The following is to get with kaniko bug on dockerignore. https://github.com/GoogleContainerTools/kaniko/issues/595
RUN yarn

COPY . .
RUN yarn run build

#----------

FROM nginx:alpine
LABEL maintainer="owen263@gmail.com"
WORKDIR /usr/share/nginx/html/
COPY --from=cache /app/build/ /usr/share/nginx/html/
ARG commitSha
RUN echo "$commitSha" > /usr/share/nginx/html/commitSha.txt
EXPOSE 80
