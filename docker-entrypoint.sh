#!/bin/sh
# Docker entrypoint script to initialize database if needed

# Check if database exists and is not empty, if not copy the seed database
if [ ! -s /app/data/app.db ] && [ -f /app/app.db ]; then
  echo "Initializing database from app.db..."
  cp /app/app.db /app/data/app.db
  echo "Database initialized!"
else
  echo "Database already exists, skipping initialization"
fi

# Start the application
exec npm run dev
