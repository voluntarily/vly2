FROM node:8 as base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PORT 3122
EXPOSE 3122

FROM base as development
ENV NODE_ENV development
COPY . ./
RUN npm install
CMD ["npm", "run", "dev"]

FROM base as production
ENV NODE_ENV=production
COPY . ./
RUN npm install --production
RUN npm run build
CMD ["npm", "start" ]
