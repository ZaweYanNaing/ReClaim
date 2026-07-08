#!/bin/sh
set -e

cd /var/www

if [ ! -d node_modules/vite ]; then
    npm ci
fi

# Wayfinder route types must be generated from the PHP app container:
#   docker compose exec app php artisan wayfinder:generate
export WAYFINDER_COMMAND="${WAYFINDER_COMMAND:-true}"

exec npm run dev -- --host 0.0.0.0 --port "${VITE_PORT:-5173}"
