FROM node:18.16-bullseye-slim as base-front

WORKDIR /usr/src/app

FROM base-front as copy-stage-front

ENV NODE_ENV development

COPY --chown=node:node packages/utils packages/utils
COPY --chown=node:node services/frontend services/frontend

COPY --chown=node:node services/backend/package.json services/backend/package.json

COPY --chown=node:node .eslintrc .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn .yarn
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

FROM copy-stage-front as install-stage-front

RUN yarn workspaces focus m-cafe-frontend

RUN yarn workspaces focus @m-cafe-app/utils

RUN yarn run prepare:frontend

CMD ["yarn", "run", "dev:frontend"]