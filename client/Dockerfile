FROM node:18 as builder
WORKDIR /app
RUN npm install -g pnpm@7
COPY . .
RUN pnpm --filter client install --frozen-lockfile
WORKDIR /app/client
RUN chown -R node:node node_modules
RUN npm run build

FROM docker.io/nginx:1.25-alpine
COPY --from=builder /app/client/build /usr/share/nginx/html
