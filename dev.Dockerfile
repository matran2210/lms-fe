FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install -g node-gyp

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
COPY next-seo.config.js .
COPY next-sitemap.config.js .
COPY tsconfig.json .
COPY .env .
# COPY postcss.config.js .
# COPY tailwind.config.js .

EXPOSE 3000

CMD npm run dev



