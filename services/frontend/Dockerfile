FROM node:18.16-alpine3.18 AS base-front

WORKDIR /usr/src/app

FROM base-front AS copy-stage-front

COPY --chown=node:node packages/utils packages/utils
COPY --chown=node:node services/frontend services/frontend

COPY --chown=node:node services/backend/package.json services/backend/package.json

COPY --chown=node:node .eslintrc .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

FROM copy-stage-front AS install-stage-front

RUN yarn workspaces focus m-cafe-frontend

RUN yarn workspaces focus @m-cafe-app/utils

RUN yarn run prepare:frontend


FROM install-stage-front AS build-stage-front

ENV NODE_ENV production

# RUN CI=true yarn run test
RUN yarn run build:frontend


FROM nginx:1.25.1-alpine-slim AS run-prod-front

COPY --from=build-stage-front /usr/src/app/services/frontend/.webpack /usr/share/nginx/html