# syntax=docker/dockerfile:1.7

# Base dependencies for production
FROM node:22-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

# Development image (with dev deps and nodemon)
FROM node:22-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production runtime image
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
# Install just production deps
COPY --from=deps /app/node_modules ./node_modules
# Copy only necessary app files
COPY package*.json ./
COPY src ./src
COPY public ./public

# Drop privileges
USER node

EXPOSE 3000

RUN apk add --no-cache curl

# Basic healthcheck against the health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -sf http://localhost:3000/health || exit 1

CMD ["npm", "start"]

