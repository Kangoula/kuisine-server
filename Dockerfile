FROM node:22.17.0-alpine3.22 AS base

WORKDIR /usr/src/app

RUN apk add postgresql17-client=17.6-r0

COPY --chown=node:node package*.json ./

#############
# LOCAL DEV
#############

FROM base AS development

RUN npm ci

COPY  --chown=node:node . .

USER node

#############
# BUILD PROD
#############

FROM base AS build

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

#############
# RUN PROD
#############

FROM base AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

ENTRYPOINT [ "node", "dist/main.js" ]