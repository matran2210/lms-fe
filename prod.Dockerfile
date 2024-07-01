
FROM node:18.19-slim AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN yarn install

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY next-i18next.config.js .
COPY next-sitemap.config.js .
COPY tsconfig.json .
COPY next-seo.config.js .
COPY .env .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY sentry.client.config.ts .
COPY sentry.edge.config.ts .
COPY sentry.server.config.ts .
RUN yarn build
CMD ["yarn", "start"]
