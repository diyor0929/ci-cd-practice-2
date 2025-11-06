# ====================================
# 1️⃣ STAGE: Build Dependencies
# ====================================
FROM php:8.4.1-fpm-alpine AS build

# Install system dependencies
RUN apk add --no-cache \
    git \
    unzip \
    postgresql-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    autoconf \
    build-base

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    intl \
    mbstring \
    zip \
    exif



# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files first
COPY composer.json composer.lock ./

# Install PHP dependencies (no dev packages)
RUN composer install --no-dev --no-interaction --optimize-autoloader --prefer-dist --no-scripts

# Endi butun loyihani ko‘chir
COPY . .

# Endi artisan fayl mavjud — shuning uchun scriptlarni ishga tushiramiz
RUN composer run-script post-autoload-dump

# 2️⃣ STAGE: Production Runtime
# ====================================
FROM php:8.4.1-fpm-alpine

# Install runtime dependencies
RUN apk add --no-cache \
    libpq \
    icu-libs \
    libzip \
    nginx \
    supervisor

WORKDIR /var/www

# Copy the built app from previous stage
COPY --from=build /var/www /var/www

# Copy nginx & supervisor configs if they exist, otherwise create defaults
RUN if [ -f docker/nginx.conf ]; then \
    cp docker/nginx.conf /etc/nginx/nginx.conf; \
    else \
    echo "worker_processes auto;" > /etc/nginx/nginx.conf && \
    echo "events { worker_connections 1024; }" >> /etc/nginx/nginx.conf && \
    echo "http {" >> /etc/nginx/nginx.conf && \
    echo "    include /etc/nginx/mime.types;" >> /etc/nginx/nginx.conf && \
    echo "    default_type application/octet-stream;" >> /etc/nginx/nginx.conf && \
    echo "    server {" >> /etc/nginx/nginx.conf && \
    echo "        listen 80;" >> /etc/nginx/nginx.conf && \
    echo "        root /var/www/public;" >> /etc/nginx/nginx.conf && \
    echo "        index index.php;" >> /etc/nginx/nginx.conf && \
    echo "        location / { try_files \$uri \$uri/ /index.php?\$query_string; }" >> /etc/nginx/nginx.conf && \
    echo "        location ~ \.php$ {" >> /etc/nginx/nginx.conf && \
    echo "            fastcgi_pass 127.0.0.1:9000;" >> /etc/nginx/nginx.conf && \
    echo "            fastcgi_index index.php;" >> /etc/nginx/nginx.conf && \
    echo "            fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;" >> /etc/nginx/nginx.conf && \
    echo "            include fastcgi_params;" >> /etc/nginx/nginx.conf && \
    echo "        }" >> /etc/nginx/nginx.conf && \
    echo "    }" >> /etc/nginx/nginx.conf && \
    echo "}" >> /etc/nginx/nginx.conf; \
    fi

RUN if [ -f docker/supervisord.conf ]; then \
    cp docker/supervisord.conf /etc/supervisord.conf; \
    else \
    echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "[program:php-fpm]" >> /etc/supervisord.conf && \
    echo "command=php-fpm" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf; \
    fi

# Set correct permissions for Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
