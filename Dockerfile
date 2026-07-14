FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY . .

# Run as a non-root user
RUN addgroup -S app && adduser -S app -G app \
  && chown -R app:app /app
USER app

EXPOSE 3000

CMD ["node", "src/server.js"]
