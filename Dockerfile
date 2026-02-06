# Use Node.js 22 LTS as base image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy and set permissions for entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port 3005 (your configured port)
EXPOSE 3005

# Use entrypoint script to handle database initialization
ENTRYPOINT ["/app/docker-entrypoint.sh"]
