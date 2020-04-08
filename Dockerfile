FROM node:12-alpine as base
RUN mkdir /voluntarily
WORKDIR /voluntarily

FROM base as production
ENV NODE_ENV=production
ENV PORT 3122
EXPOSE 3122
COPY . /voluntarily
WORKDIR /voluntarily
CMD ["npm", "start" ]

FROM base as development
ENV NODE_ENV=development
ENV PORT 3122
EXPOSE 3122
COPY package.json package-lock.json* ./
RUN npm install
COPY . ./
CMD ["npm", "run", "dev"]