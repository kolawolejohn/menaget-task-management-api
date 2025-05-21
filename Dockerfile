# Stage 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm config set strict-ssl false
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20 AS production

WORKDIR /usr/src/app

# Install netcat for DB wait
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy build and dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/entrypoint.sh ./entrypoint.sh

# Respect environment
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
  CMD wget --quiet --spider http://localhost:3000/ || exit 1

RUN chmod +x ./entrypoint.sh

USER node
ENTRYPOINT ["./entrypoint.sh"]
