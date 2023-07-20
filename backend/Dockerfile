FROM node:18.16-alpine3.18 AS base-back

FROM base-back AS copy-stage-back

RUN mkdir -p /usr/src/shared

COPY --chown=node:node shared/ /usr/src/shared

WORKDIR /usr/src/app

COPY --chown=node:node backend/package.json .
COPY --chown=node:node backend/yarn.lock .

RUN rm -rf node_modules && yarn install --production=false --frozen-lockfile

COPY --chown=node:node backend/ .


FROM copy-stage-back AS build-stage-back

WORKDIR /usr/src/app

ENV NODE_ENV production

# RUN CI=true yarn run test

RUN rm -rf backend/tests

RUN yarn run build


FROM base-back

RUN apk add --update dumb-init

RUN mkdir -p /usr/src/app/build

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node backend/package.json .
COPY --chown=node:node backend/yarn.lock .

RUN rm -rf node_modules && yarn install --production=true --frozen-lockfile

COPY --chown=node:node --from=build-stage-back /usr/src/app/build /usr/src/app/build

ENV DEBUG=express:*
USER node

# CMD ["dumb-init", "node", "./build/index.js"]
CMD ["node", "./build/index.js"]