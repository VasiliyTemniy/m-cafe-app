FROM node:18.16-bullseye-slim as base-back

WORKDIR /usr/src/app


FROM base-back as copy-package-files-stage-back

COPY --chown=node:node packages/shared-dev-deps/package.json packages/shared-dev-deps/package.json
COPY --chown=node:node packages/shared-backend-deps/package.json packages/shared-backend-deps/package.json
COPY --chown=node:node packages/shared-constants/package.json packages/shared-constants/package.json
COPY --chown=node:node packages/db/package.json packages/db/package.json
COPY --chown=node:node packages/utils/package.json packages/utils/package.json

COPY --chown=node:node services/backend/package.json services/backend/package.json

COPY --chown=node:node services/web/package.json services/web/package.json

COPY --chown=node:node .eslintrc .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .


FROM copy-package-files-stage-back as install-stage-back

ENV NODE_ENV development

RUN yarn workspaces focus @m-cafe-app/shared-dev-deps
RUN yarn workspaces focus @m-cafe-app/shared-backend-deps
RUN yarn workspaces focus @m-cafe-app/shared-constants
RUN yarn workspaces focus @m-cafe-app/db
RUN yarn workspaces focus @m-cafe-app/utils

RUN yarn workspaces focus m-cafe-app

RUN yarn workspaces focus m-cafe-backend


FROM install-stage-back as copy-stage-back

COPY --chown=node:node packages/shared-dev-deps packages/shared-dev-deps
COPY --chown=node:node packages/shared-backend-deps packages/shared-backend-deps
COPY --chown=node:node packages/shared-constants packages/shared-constants
COPY --chown=node:node packages/db packages/db
COPY --chown=node:node packages/utils packages/utils

COPY --chown=node:node services/backend services/backend


FROM copy-stage-back as run-stage-back

RUN yarn run prepare:backend

ENV DEBUG=express:*
USER node

CMD ["yarn", "run", "dev:backend"]