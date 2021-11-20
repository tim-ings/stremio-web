# webtorrent requires debian, segfaults when run under alpine with default packaegs
FROM node:16.13.0-stretch as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY tsconfig.json /app
COPY ./src /app/src
RUN yarn build

FROM node:16.13.0-stretch as installer
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

FROM node:16.13.0-stretch as prod
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules/
COPY --from=builder /app/dist/ ./dist/
EXPOSE 3000
CMD ["node", "/app/dist/app.js"]
