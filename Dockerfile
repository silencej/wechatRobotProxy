FROM node:alpine

LABEL maintainer="owen263@gmail.com"
ARG commitSha
RUN echo "$commitSha" > /commitSha.txt

WORKDIR /app/
# Do this for caching node_modules between builds
COPY ./yarn.lock ./package.json ./

# The following is to get with kaniko bug on dockerignore. https://github.com/GoogleContainerTools/kaniko/issues/595
RUN yarn

COPY . .
ENTRYPOINT yarn start

EXPOSE 80
