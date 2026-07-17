#!/usr/bin/env bash
set -e

echo "Booting container..."

# Render assigns a dynamic $PORT; bake it into the nginx config.
export PORT="${PORT:-8080}"
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

# Generate an app key on first boot if one isn't set via env vars.
if [ -z "$APP_KEY" ]; then
    echo "No APP_KEY set - generating one (set APP_KEY in Render's env vars to persist it across deploys)."
    php artisan key:generate --force
fi

# Cache config/routes/views for production performance.
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure storage symlink exists (for public file uploads, if used).
php artisan storage:link || true

# Run database migrations. Remove --force guard/comment out if you prefer
# to run migrations manually instead of on every deploy.
php artisan migrate --force

echo "Boot checks complete. Starting services..."

exec "$@"
