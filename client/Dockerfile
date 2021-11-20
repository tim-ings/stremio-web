FROM node:16.13.0-alpine3.12 as builder
ARG SOURCEMAPS=false
ENV GENERATE_SOURCEMAPS=$SOURCEMAPS
ENV INLINE_RUNTIME_CHUNK=false
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY tsconfig.json /app
COPY public /app/public
COPY ./src /app/src
RUN yarn build

FROM node:16.13.0-alpine3.12 as prod
WORKDIR /app
COPY server.js /app
RUN yarn add express@4.17.1
COPY --from=builder /app/build/ ./public
EXPOSE 8900
CMD ["node", "server.js"]
