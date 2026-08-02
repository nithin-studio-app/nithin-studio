# syntax=docker/dockerfile:1
FROM node:24-slim AS builder

RUN corepack enable

WORKDIR /app

# Dependencies first so this layer only rebuilds when they actually change,
# not on every source edit. @nithin-studio-app/* are private GitHub
# Packages — installing them needs a token, passed via a BuildKit secret
# mount (never a --build-arg, which would bake it into the image's layer
# history) and only readable for the duration of this one RUN. The repo's
# own .npmrc only maps the registry scope, no auth — CI gets away with that
# because actions/setup-node synthesizes its own temp npmrc with the token,
# which doesn't exist here, so the auth line is appended and removed again
# within this single RUN. Docker layers only capture a step's *end* state,
# so the token never appears in the image even though it briefly touches
# disk mid-instruction.
COPY package.json pnpm-lock.yaml .npmrc ./
RUN --mount=type=secret,id=npm_auth_token \
    echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/npm_auth_token)" >> .npmrc && \
    pnpm install --frozen-lockfile && \
    sed -i '/_authToken/d' .npmrc

COPY . .
RUN pnpm build

# Static output only from here — the builder stage (source, node_modules,
# the token that touched it) never reaches the final image.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
