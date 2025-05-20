#!/bin/sh

echo "Waiting for Postgres to be ready..."
while ! nc -z db 5432; do
  sleep 1
done

echo "Postgres is up - running migrations..."
npm run migrate:docker

echo "Starting the app..."
exec node dist/main