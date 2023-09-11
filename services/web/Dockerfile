FROM node:18.16-alpine3.18 AS base-web

WORKDIR /usr/src/app


FROM base-web as copy-package-files-stage-web

COPY --chown=node:node packages/shared-dev-deps/package.json packages/shared-dev-deps/package.json
# Shared backend deps are needed to build db package and infer types from there to utils package
COPY --chown=node:node packages/shared-backend-deps/package.json packages/shared-backend-deps/package.json
COPY --chown=node:node packages/shared-constants/package.json packages/shared-constants/package.json
COPY --chown=node:node packages/db/package.json packages/db/package.json
COPY --chown=node:node packages/utils/package.json packages/utils/package.json
COPY --chown=node:node packages/shared-frontend-deps/package.json packages/shared-frontend-deps/package.json
COPY --chown=node:node packages/frontend-logic/package.json packages/frontend-logic/package.json

COPY --chown=node:node services/backend/package.json services/backend/package.json

COPY --chown=node:node services/web/package.json services/web/package.json

COPY --chown=node:node .eslintrc .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .


FROM copy-package-files-stage-web as install-stage-web

ENV NODE_ENV development

RUN yarn workspaces focus @m-cafe-app/shared-dev-deps
RUN yarn workspaces focus @m-cafe-app/shared-backend-deps
RUN yarn workspaces focus @m-cafe-app/shared-constants
RUN yarn workspaces focus @m-cafe-app/db
RUN yarn workspaces focus @m-cafe-app/utils
RUN yarn workspaces focus @m-cafe-app/shared-frontend-deps
RUN yarn workspaces focus @m-cafe-app/frontend-logic

RUN yarn workspaces focus m-cafe-app

RUN yarn workspaces focus m-cafe-web


FROM install-stage-web as copy-stage-web

COPY --chown=node:node packages/shared-dev-deps packages/shared-dev-deps
COPY --chown=node:node packages/shared-backend-deps packages/shared-backend-deps
COPY --chown=node:node packages/shared-constants packages/shared-constants
COPY --chown=node:node packages/db packages/db
COPY --chown=node:node packages/utils packages/utils
COPY --chown=node:node packages/frontend-logic packages/frontend-logic

COPY --chown=node:node services/web services/web


FROM copy-stage-web as prepare-stage-web

RUN yarn run prepare:frontend

ENV NODE_ENV production

# RUN CI=true yarn run test
ARG BACKEND_URL

ENV BACKEND_URL ${BACKEND_URL?backend_url_not_set}
ENV DOCKERIZED=true


FROM prepare-stage-web AS build-stage-web-customer

RUN yarn run build:frontend:customer

FROM prepare-stage-web AS build-stage-web-admin

RUN yarn run build:frontend:admin

FROM prepare-stage-web AS build-stage-web-manager

RUN yarn run build:frontend:manager


# Below are different targets for docker-compose.yml

FROM nginx:1.25.1-alpine-slim AS run-prod-web-customer

COPY --from=build-stage-web-customer /usr/src/app/services/web/.webpack.customer /usr/share/nginx/html

FROM nginx:1.25.1-alpine-slim AS run-prod-web-admin

COPY --from=build-stage-web-admin /usr/src/app/services/web/.webpack.admin /usr/share/nginx/html

FROM nginx:1.25.1-alpine-slim AS run-prod-web-manager

COPY --from=build-stage-web-manager /usr/src/app/services/web/.webpack.manager /usr/share/nginx/html