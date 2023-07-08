FROM node:18 as builder
WORKDIR /app
RUN npm install -g pnpm@8
COPY . .
RUN pnpm --filter server... install --frozen-lockfile
WORKDIR /app/server
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm@8
COPY --from=builder /app/pnpm*.yaml ./

COPY --from=builder /app/server/dist ./server/dist/
COPY --from=builder /app/server/package.json ./server/package.json

COPY --from=builder /app/common/dist ./common/dist
COPY --from=builder /app/common/package.json ./common/package.json

RUN pnpm install --filter-prod=server... --production --frozen-lockfile
WORKDIR /app/server
ENTRYPOINT [ "node", "dist/index.js" ]
