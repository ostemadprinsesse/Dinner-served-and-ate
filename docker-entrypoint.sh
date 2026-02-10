#!/bin/sh

set -e

# Initialize database if it doesn't exist yet
if [ ! -s /app/data/app.db ] && [ -f /app/app.db ]; then
  echo "Initializing database from app.db..."
  cp /app/app.db /app/data/app.db
  echo "Database initialized!"
else
  echo "Database already exists, skipping initialization"
fi

exec npm run dev
