# syntax=docker/dockerfile:1
FROM node:24-slim AS builder

RUN corepack enable

WORKDIR /app

# Dependencies first so this layer only rebuilds when they actually change,
# not on every source edit. @nithin-studio-app/* are private GitHub
# Packages — installing them needs a token, passed via a BuildKit secret
# mount (never a --build-arg, which would bake it into the image's layer
# history) and only readable for the duration of this one RUN.
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=secret,id=npm_auth_token \
    NODE_AUTH_TOKEN="$(cat /run/secrets/npm_auth_token)" pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Static output only from here — the builder stage (source, node_modules,
# the token that touched it) never reaches the final image.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
