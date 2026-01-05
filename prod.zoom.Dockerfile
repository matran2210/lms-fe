# =========================
# 1. Base image
# =========================
FROM node:20-slim AS base
WORKDIR /app

# =========================
# 2. Turbo prune
# =========================
FROM base AS pruner
ARG APP_NAME
ENV APP_NAME=$APP_NAME

COPY . .

RUN npm install -g turbo
RUN turbo prune --scope=${APP_NAME} --docker

# =========================
# 3. Dependencies install
# =========================
FROM base AS deps
ARG APP_NAME
ENV APP_NAME=$APP_NAME

# Copy pruned dependency metadata
COPY --from=pruner /app/out/json/package.json ./
COPY --from=pruner /app/out/json/pnpm-lock.yaml ./

# Copy pruned source code
COPY --from=pruner /app/out/full/ ./  

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# =========================
# 4. Build app
# =========================
FROM deps AS builder
ARG APP_NAME
ENV APP_NAME=$APP_NAME
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g turbo
RUN turbo run build --filter=${APP_NAME}

# =========================
# 5. Runtime
# =========================
FROM node:20-slim AS runner
ARG APP_NAME
ENV APP_NAME=$APP_NAME
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

EXPOSE 3000

CMD ["node", "apps/lms-zoom/server.js"]
