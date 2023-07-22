FROM node:18.16-alpine3.18 AS base-back

WORKDIR /usr/src/app

FROM base-back AS copy-stage-back

COPY --chown=node:node packages/utils packages/utils
COPY --chown=node:node services/backend services/backend

COPY --chown=node:node services/frontend/package.json services/frontend/package.json

COPY --chown=node:node .eslintrc .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

FROM copy-stage-back as install-stage-back

RUN yarn workspaces focus m-cafe-backend

RUN yarn workspaces focus @m-cafe-app/utils

RUN yarn run prepare:backend


FROM install-stage-back AS build-stage-back

WORKDIR /usr/src/app

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

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node --from=build-stage-back usr/src/app/packages/utils/build packages/utils/build
COPY --chown=node:node --from=build-stage-back usr/src/app/packages/utils/package.json packages/utils/package.json

COPY --chown=node:node --from=build-stage-back usr/src/app/services/backend/build services/backend/build
COPY --chown=node:node --from=build-stage-back usr/src/app/services/backend/package.json services/backend/package.json

COPY --chown=node:node services/frontend/package.json services/frontend/package.json

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

FROM copy-prod-stage-back as install-prod-stage-back

RUN yarn workspaces focus m-cafe-backend --production

# Delete unused
RUN rm -rf .yarn/cache
RUN rm -rf services/frontend

ENV DEBUG=express:*
USER node

FROM install-prod-stage-back as run-prod-back

# CMD ["dumb-init", "node", "./services/backend/build/index.js"]
CMD ["node", "./services/backend/build/index.js"]