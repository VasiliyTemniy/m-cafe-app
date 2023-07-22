FROM node:18.16-bullseye-slim as base-back

WORKDIR /usr/src/app

FROM base-back as copy-stage-back

ENV NODE_ENV development 

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

ENV DEBUG=express:*
USER node

CMD ["yarn", "run", "dev:backend"]