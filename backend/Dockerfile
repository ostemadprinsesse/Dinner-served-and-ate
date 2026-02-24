FROM node:22-alpine

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy ONLY backend's package files
COPY package*.json ./

RUN npm install
# this should be faster :)
#RUN npm ci --omit=dev

# Remove build dependencies to keep image small (optional)
RUN apk del python3 make g++

# Copy backend code
COPY . .

# Copy database into data directory
RUN mkdir -p /app/data && cp app.db /app/data/app.db 2>/dev/null || true

EXPOSE 5000

# Initialize database on first run
RUN node init-db.js || true

CMD ["node", "index.js"]