# Multi-stage production Docker build
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    tzdata

# Set timezone to Nepal
ENV TZ=Asia/Kathmandu
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Production dependencies stage
FROM base AS dependencies
RUN npm ci --only=production && npm cache clean --force

# Development dependencies stage (for building)
FROM base AS dev-dependencies
RUN npm ci

# Build stage
FROM dev-dependencies AS build
COPY . .
RUN npm run db:generate

# Production stage
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Copy built artifacts
COPY --from=build --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command (can be overridden)
CMD ["node", "src/server.js"]

# Labels for metadata
LABEL maintainer="School Communication Team"
LABEL version="3.0.0"
LABEL description="Production-grade WhatsApp School Communication System"