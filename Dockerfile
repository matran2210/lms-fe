# Multi-stage build for Next.js application
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables
ARG NEXT_PUBLIC_SENTRY_NAME
ARG NEXT_PUBLIC_SENTRY_PROJECT
ARG NEXT_PUBLIC_BASE_API_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_VAPIDKEY
ARG NEXT_PUBLIC_VIDEO_URL
ARG NEXT_PUBLIC_TINY_EDITDER_API_KEY
ARG NEXT_PUBLIC_WEB_LMS_URL
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_SOCKET
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_LMS_API_URL
ARG NEXT_PUBLIC_LMS_FE_URL

# Build the application
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3212

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"] 