FROM node:20-alpine AS base
WORKDIR /app

# Install deps at workspace root level
COPY package.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN npm install --workspace=apps/api --workspace=packages/shared

# Copy source
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build shared package
RUN npm run build --workspace=packages/shared

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build API
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
