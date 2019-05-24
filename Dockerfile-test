FROM node:12 as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PORT 3122
EXPOSE 3122

ENV NODE_ENV test \
    MONGOMS_DOWNLOAD_MIRROR="http://downloads.mongodb.org" \
    MONGOMS_VERSION="4.0.5" \
    CI=true
COPY . ./
RUN npm ci
CMD ["npm", "test"]
