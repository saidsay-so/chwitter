# Server Dockerfile, client is ignored

FROM node:16 as builder
WORKDIR /app
COPY **/package.json ./
COPY pnpm*.yaml ./
RUN npm install -g pnpm@next-7
RUN pnpm install
COPY . .
WORKDIR /app/server
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY **/package.json ./
COPY pnpm*.yaml ./
RUN npm install -g pnpm@next-7
RUN pnpm install --production
COPY --from=builder /app/server/ ./server/
COPY --from=builder /app/common/ ./common/
WORKDIR /app/server
ENTRYPOINT [ "node", "dist/index.js" ]
