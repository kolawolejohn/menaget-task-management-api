#!/bin/sh

echo "NODE_ENV is set to '$NODE_ENV'"

if [ "$NODE_ENV" = "docker" ]; then
  echo "Waiting for Postgres to be ready..."
  while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
    sleep 1
  done

  echo "Running local Docker migration..."
  npm run migrate:docker

elif [ "$NODE_ENV" = "production" ]; then
  echo "Running production migration..."
  npx typeorm migration:run

else
  echo "⚠️  Unknown NODE_ENV: '$NODE_ENV'. Skipping DB wait and migrations."
  echo "If this is unintentional, set NODE_ENV to 'docker' or 'production'."
fi

echo "Starting the app..."
exec node dist/main
