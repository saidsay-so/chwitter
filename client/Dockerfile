FROM node:18 as builder
WORKDIR /app
RUN npm install -g pnpm@8
COPY . .
RUN pnpm --filter client... --filter common... install --frozen-lockfile
WORKDIR /app/common
RUN npm run build
WORKDIR /app/client
RUN chown -R node:node node_modules
RUN npm run build

FROM docker.io/nginxinc/nginx-unprivileged:1.25-alpine
COPY --from=builder /app/client/build /usr/share/nginx/html
