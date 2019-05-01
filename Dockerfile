FROM node:12 as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3122

FROM base as development
ENV NODE_ENV development
COPY package.json package-lock.json ./
RUN npm install
COPY .babelrc next.config.js nodemon.json  ./
COPY assets ./assets
COPY components ./components
COPY config ./config
COPY hocs ./hocs
COPY lang ./lang
COPY lib ./lib
COPY pages ./pages
COPY server ./server
COPY static ./static
CMD ["npm", "run", "dev"]

FROM development as build
ENV NODE_ENV=production
RUN npm run build

FROM base as production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm install --production
COPY --from=build /usr/src/app/dist ./dist
CMD ["npm", "run", "start:prod"]
