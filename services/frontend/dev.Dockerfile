FROM node:18.16-bullseye-slim as base-front

WORKDIR /usr/src/app


FROM base-front as copy-package-files-stage-front

COPY --chown=node:node packages/shared-dev-deps/package.json packages/shared-dev-deps/package.json
# Shared backend deps are needed to build db-models package and infer types from there to utils package
COPY --chown=node:node packages/shared-backend-deps/package.json packages/shared-backend-deps/package.json
COPY --chown=node:node packages/shared-deps/package.json packages/shared-deps/package.json
COPY --chown=node:node packages/db-models/package.json packages/db-models/package.json
COPY --chown=node:node packages/utils/package.json packages/utils/package.json

COPY --chown=node:node packages/shared-frontend-deps/package.json packages/shared-frontend-deps/package.json

COPY --chown=node:node services/backend/package.json services/backend/package.json

COPY --chown=node:node services/frontend/package.json services/frontend/package.json

COPY --chown=node:node .eslintrc .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .


FROM copy-package-files-stage-front as install-stage-front

ENV NODE_ENV development

RUN yarn workspaces focus @m-cafe-app/shared-dev-deps
RUN yarn workspaces focus @m-cafe-app/shared-backend-deps
RUN yarn workspaces focus @m-cafe-app/shared-deps
RUN yarn workspaces focus @m-cafe-app/db-models
RUN yarn workspaces focus @m-cafe-app/utils

RUN yarn workspaces focus @m-cafe-app/shared-frontend-deps

RUN yarn workspaces focus m-cafe-app

RUN yarn workspaces focus m-cafe-frontend


FROM install-stage-front as copy-stage-front

COPY --chown=node:node packages/shared-dev-deps packages/shared-dev-deps
COPY --chown=node:node packages/shared-backend-deps packages/shared-backend-deps
COPY --chown=node:node packages/shared-deps packages/shared-deps
COPY --chown=node:node packages/db-models packages/db-models
COPY --chown=node:node packages/utils packages/utils

COPY --chown=node:node services/frontend services/frontend



# Below are different targets for docker-compose.dev.yml

FROM copy-stage-front as run-stage-front-user

RUN rm -rf services/frontend/admin
RUN rm -rf services/frontend/manager

RUN yarn run prepare:frontend

CMD ["yarn", "run", "dev:frontend:user"]

FROM copy-stage-front as run-stage-front-admin

RUN yarn run prepare:frontend

CMD ["yarn", "run", "dev:frontend:admin"]

FROM copy-stage-front as run-stage-front-manager

RUN rm -rf services/frontend/admin
RUN rm -rf services/frontend/user

RUN yarn run prepare:frontend

CMD ["yarn", "run", "dev:frontend:manager"]