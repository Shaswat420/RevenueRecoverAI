#!/bin/sh
# wait-for-db.sh
# Wait for a TCP host/port to become available, then exec the passed command

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
RETRY_INTERVAL=${RETRY_INTERVAL:-2}
MAX_RETRIES=${MAX_RETRIES:-60}

COUNTER=0
echo "Waiting for database ${DB_HOST}:${DB_PORT}"
while ! nc -z ${DB_HOST} ${DB_PORT}; do
  COUNTER=$((COUNTER+1))
  if [ ${COUNTER} -ge ${MAX_RETRIES} ]; then
    echo "Max retries reached - ${DB_HOST}:${DB_PORT} still not reachable"
    exit 1
  fi
  sleep ${RETRY_INTERVAL}
done

echo "Database is available - continuing"
exec "$@"
