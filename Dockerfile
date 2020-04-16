FROM node:12 as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

FROM base as production_build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci --production

ARG ENV_ENVIRONMENT='development'
ENV ENV_ENVIRONMENT=$ENV_ENVIRONMENT
ARG ENV_SECRET='mwmBqNcTWiKxDHygMiKhwyffaKQCVoRQ'
ENV ENV_SECRET=$ENV_SECRET
COPY . ./
RUN npm run prod-build

FROM node:12-alpine as production
ARG REVISION='local'
ENV REVISION=$REVISION
ENV PORT 3122
EXPOSE 3122

COPY --from=production_build /usr/src/app /voluntarily
WORKDIR /voluntarily
CMD ["npm", "start" ]

FROM base as development

ENV NODE_ENV=development
ENV MONGOMS_DOWNLOAD_MIRROR="http://downloads.mongodb.org"
ENV MONGOMS_VERSION="v4.0-latest"
ENV ENV_ENVIRONMENT='development'
ENV ENV_SECRET='mwmBqNcTWiKxDHygMiKhwyffaKQCVoRQ'
ENV PORT 3122
EXPOSE 3122

COPY package.json package-lock.json* ./
RUN npm install
COPY . ./
CMD ["npm", "run", "dev"]
