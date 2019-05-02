FROM node:alpimine as base
RUN apk add --no-cache libc6-compat
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PORT 3122
EXPOSE 3122

FROM base as development
ENV NODE_ENV development
COPY package.json ./
RUN npm install
COPY . /usr/src/app
CMD ["npm", "run", "dev"]

FROM base as production
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --production
RUN npm run build
CMD ["npm", "start" ]
