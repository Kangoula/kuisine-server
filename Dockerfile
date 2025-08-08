FROM node:22.17.0-alpine3.22  AS base

WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY  --chown=node:node . .
USER node

FROM base AS development

CMD ["npm", "run", "start:dev"]