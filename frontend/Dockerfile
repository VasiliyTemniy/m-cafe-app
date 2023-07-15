FROM node:18.16-alpine3.18 AS base-front

FROM base-front AS copy-stage-front

RUN mkdir -p /usr/src/shared

COPY --chown=node:node shared/ /usr/src/shared

WORKDIR /usr/src/app

COPY --chown=node:node frontend/package.json .
COPY --chown=node:node frontend/yarn.lock .

RUN rm -rf node_modules && yarn install --production=false --frozen-lockfile

COPY --chown=node:node frontend/ .


FROM copy-stage-front AS build-stage-front

WORKDIR /usr/src/app

ENV NODE_ENV production

# RUN CI=true yarn run test
RUN yarn run build


FROM nginx:1.25.1-alpine-slim
COPY --from=build-stage-front /usr/src/app/.webpack /usr/share/nginx/html