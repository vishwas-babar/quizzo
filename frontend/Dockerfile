# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the application
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary build artifacts from the builder stage
COPY --from=builder /app/.next .next
# COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port Next.js listens on (default: 3000)
EXPOSE 3000

# Start the Next.js app (make sure your package.json "start" script runs "next start")
CMD ["npm", "start"]
