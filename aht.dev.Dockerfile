FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json from the root of the Nx workspace
COPY package.json .
COPY .yarnrc .
COPY yarn.lock .
COPY .yarn ./.yarn

# Install app dependencies
RUN yarn --frozen-lockfile && yarn cache clean

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY next-i18next.config.js .
COPY next-sitemap.config.js .
COPY tsconfig.json .
COPY next-seo.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

CMD yarn dev
