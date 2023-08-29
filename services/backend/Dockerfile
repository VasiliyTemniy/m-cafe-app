FROM node:18.16-alpine3.18 AS base-back

WORKDIR /usr/src/app


FROM base-back as copy-package-files-stage-back

COPY --chown=node:node packages/shared-dev-deps/package.json packages/shared-dev-deps/package.json
COPY --chown=node:node packages/shared-backend-deps/package.json packages/shared-backend-deps/package.json
COPY --chown=node:node packages/shared-constants/package.json packages/shared-constants/package.json
COPY --chown=node:node packages/db/package.json packages/db/package.json
COPY --chown=node:node packages/utils/package.json packages/utils/package.json

COPY --chown=node:node services/backend/package.json services/backend/package.json

COPY --chown=node:node services/frontend/package.json services/frontend/package.json

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


FROM copy-stage-back as prepare-stage-back

RUN yarn run prepare:backend


FROM prepare-stage-back AS build-stage-back

# ENV NODE_ENV production

# RUN CI=true yarn run test

# After tests ald lints, delete unused files
RUN rm -rf services/backend/tests
RUN rm -rf services/backend/mocharc.json
RUN rm -rf services/backend/nodemon.json
RUN rm -rf services/backend/eslintrc

RUN yarn run build:backend


FROM base-back as copy-prod-stage-back

RUN apk add --update dumb-init

ENV NODE_ENV production

# COPY shared prod dependencies
COPY --chown=node:node packages/shared-backend-deps/package.json packages/shared-backend-deps/package.json
COPY --chown=node:node packages/shared-constants/package.json packages/shared-constants/package.json

# COPY built (transpiled) packages
COPY --chown=node:node --from=build-stage-back usr/src/app/packages/shared-constants/build packages/shared-constants/build
COPY --chown=node:node --from=build-stage-back usr/src/app/packages/shared-constants/package.json packages/shared-constants/package.json

COPY --chown=node:node --from=build-stage-back usr/src/app/packages/db/build packages/db/build
COPY --chown=node:node --from=build-stage-back usr/src/app/packages/db/package.json packages/db/package.json

COPY --chown=node:node --from=build-stage-back usr/src/app/packages/utils/build packages/utils/build
COPY --chown=node:node --from=build-stage-back usr/src/app/packages/utils/package.json packages/utils/package.json

COPY --chown=node:node --from=build-stage-back usr/src/app/services/backend/build services/backend/build
COPY --chown=node:node --from=build-stage-back usr/src/app/services/backend/locales locales
COPY --chown=node:node --from=build-stage-back usr/src/app/services/backend/public public
COPY --chown=node:node --from=build-stage-back usr/src/app/services/backend/package.json services/backend/package.json

# COPY frontend package.json
COPY --chown=node:node services/frontend/package.json services/frontend/package.json

# COPY main project meta
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

FROM copy-prod-stage-back as install-prod-stage-back

# INSTALL shared deps, backend shared deps, then backend itself
RUN yarn workspaces focus @m-cafe-app/shared-backend-deps --production
RUN yarn workspaces focus @m-cafe-app/shared-constants --production

RUN yarn workspaces focus m-cafe-backend --production

# Delete unused
RUN rm -rf .yarn/cache
RUN rm -rf services/frontend

RUN mkdir -p /usr/src/app/public
RUN chown -Rh node:node /usr/src/app/public

ENV DEBUG=express:*
USER node

FROM install-prod-stage-back as run-prod-back

# CMD ["dumb-init", "node", "./services/backend/build/index.js"]
CMD ["node", "./services/backend/build/index.js"]