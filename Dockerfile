# syntax=docker/dockerfile:1

############################
# Stage 1: Build frontend assets (Vite)
############################
FROM node:20-bookworm-slim AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

############################
# Stage 2: Install PHP dependencies (Composer)
# Runs on PHP 8.4 (same as the app image and your computer). The plain "composer:2"
# image now ships PHP 8.6, which the locked packages do not support yet.
############################
FROM php:8.4-cli-alpine AS vendor

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY database/ database/
COPY composer.json composer.lock ./
# The extensions listed below are installed in the final image (stage 3), so it is safe
# to skip checking for them in this stage.
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --no-progress \
    --optimize-autoloader \
    --prefer-dist \
    --ignore-platform-req=ext-gd \
    --ignore-platform-req=ext-zip \
    --ignore-platform-req=ext-exif \
    --ignore-platform-req=ext-bcmath \
    --ignore-platform-req=ext-pcntl \
    --ignore-platform-req=ext-pdo_pgsql \
    --ignore-platform-req=ext-pdo_mysql

############################
# Stage 3: Runtime image
############################
FROM php:8.4-fpm-alpine AS app

# System dependencies + PHP extensions Laravel typically needs.
# Runtime libs (libpng, libpq, libzip, etc.) are installed explicitly so they
# survive the cleanup step below — the -dev packages alone would pull them in
# only as transient build dependencies and they'd get purged along with them.
RUN apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
        gettext \
        libpng \
        libjpeg-turbo \
        freetype \
        libzip \
        libxml2 \
        oniguruma \
        postgresql-libs \
    && apk add --no-cache --virtual .build-deps \
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
    && apk del .build-deps

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