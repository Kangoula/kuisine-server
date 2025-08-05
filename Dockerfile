FROM node:22.17.0-alpine3.22  AS development

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY  --chown=node:node . .
USER node