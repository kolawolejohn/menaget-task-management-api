# Stage 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm config set strict-ssl false
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production image
FROM node:20 AS production

WORKDIR /usr/src/app

# Install netcat (nc) for healthcheck or entrypoint.sh usage
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy build output and needed files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/entrypoint.sh ./entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s \
    CMD wget --quiet --spider http://localhost:3000/ || exit 1

RUN chmod +x ./entrypoint.sh

USER node

ENTRYPOINT ["./entrypoint.sh"]
