FROM node:18.16-bullseye-slim

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/shared

ENV NODE_ENV development

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

RUN rm -rf node_modules && yarn install --frozen-lockfile

COPY --chown=node:node . .

CMD ["yarn", "run", "dev"]