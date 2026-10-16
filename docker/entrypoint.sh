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

# Run database migrations, retrying while the database becomes reachable.
# Transient SSL/connection drops are common right after a deploy or when
# a Render Postgres instance is waking up. A real misconfiguration
# (bad host, expired database) still fails the deploy after all attempts.
MAX_ATTEMPTS=15
SLEEP_SECONDS=5
attempt=1
until php artisan migrate --force; do
    if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
        echo "Database still unreachable after ${MAX_ATTEMPTS} attempts. Check DB_HOST, DB_SSLMODE and that the Postgres instance is active."
        exit 1
    fi
    echo "Migration attempt ${attempt}/${MAX_ATTEMPTS} failed, retrying in ${SLEEP_SECONDS}s..."
    attempt=$((attempt + 1))
    sleep "$SLEEP_SECONDS"
done

# Keep the admin account in sync with Render env vars; refresh the KES rate.
php artisan admin:ensure || true
php artisan rates:sync || true

echo "Boot checks complete. Starting services..."
exec "$@"