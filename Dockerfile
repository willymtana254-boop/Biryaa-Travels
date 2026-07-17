# syntax=docker/dockerfile:1

############################
# Stage 1: Build frontend assets (Vite)
############################
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

############################
# Stage 2: Install PHP dependencies (Composer)
############################
FROM composer:2 AS vendor

WORKDIR /app

COPY database/ database/
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist

############################
# Stage 3: Runtime image
############################
FROM php:8.3-fpm-alpine AS app

# System dependencies + PHP extensions Laravel typically needs.
# Add/remove extensions here to match your app (e.g. pdo_pgsql, redis, gd).
RUN apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        libxml2-dev \
        oniguruma-dev \
        postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        opcache \
    && apk del --no-cache libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev libxml2-dev oniguruma-dev postgresql-dev

# Recommended production PHP/OPcache settings
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.max_accelerated_files=10000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.jit=tracing'; \
        echo 'opcache.jit_buffer_size=64M'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini \
    && { \
        echo 'memory_limit=256M'; \
        echo 'upload_max_filesize=64M'; \
        echo 'post_max_size=64M'; \
    } > /usr/local/etc/php/conf.d/laravel-recommended.ini

WORKDIR /var/www/html

# App code
COPY . .

# Vendor from composer stage, built assets from node stage
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

# Config files
COPY docker/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Laravel needs these directories writable by the web server
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Render sets $PORT at runtime; nginx template is rendered against it in entrypoint.sh
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]