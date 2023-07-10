FROM node:14-alpine

WORKDIR /app

# Copy lock files if file exists
COPY package.json yarn.lock* package-lock.json* ./

RUN npm install

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY next-i18next.config.js .
COPY next-seo.config.js .
COPY next-sitemap.config.js .
COPY tsconfig.json .
COPY .env .
# COPY postcss.config.js .
# COPY tailwind.config.js .

EXPOSE 3000

CMD npm run dev



