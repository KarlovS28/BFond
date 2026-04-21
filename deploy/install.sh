#!/usr/bin/env bash
# =====================================================================
# Скрипт первоначальной установки на Ubuntu 22.04
# Запускать с правами sudo:  sudo bash deploy/install.sh
#
# Скрипт ставит: Node.js 20, PostgreSQL 14, Nginx, certbot, pm2.
# Затем спрашивает у вас домен и применяет nginx-конфиг.
# =====================================================================

set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Запустите скрипт через sudo: sudo bash deploy/install.sh" >&2
  exit 1
fi

read -rp "Введите домен сайта (например, example.com): " DOMAIN
read -rp "Введите email администратора для Let's Encrypt: " LE_EMAIL

apt-get update -y
apt-get install -y curl git build-essential nginx postgresql ca-certificates

# --- Node.js 20 (NodeSource) ---
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# --- pnpm + pm2 ---
npm install -g pnpm pm2

# --- PostgreSQL: создаём БД и пользователя ---
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='mds'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE ROLE mds LOGIN PASSWORD 'mds_password';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='mds'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE mds OWNER mds;"

# --- Подсказка про переменные окружения ---
cat <<EOF

Сейчас положите файл .env рядом с проектом. Пример:

DATABASE_URL=postgres://mds:mds_password@127.0.0.1:5432/mds
SESSION_SECRET=$(head -c 32 /dev/urandom | base64)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$(head -c 16 /dev/urandom | base64 | tr -d '/+' | head -c 16)
PORT=8080
BASE_PATH=/
NODE_ENV=production
EOF

# --- Nginx ---
install -m 0644 deploy/nginx.conf /etc/nginx/sites-available/mds-site.conf
sed -i "s/example.com www.example.com/$DOMAIN www.$DOMAIN/" /etc/nginx/sites-available/mds-site.conf
ln -sf /etc/nginx/sites-available/mds-site.conf /etc/nginx/sites-enabled/mds-site.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# --- HTTPS через certbot ---
apt-get install -y certbot python3-certbot-nginx
certbot --nginx --non-interactive --agree-tos -m "$LE_EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" || true

echo "Установка окружения завершена."
echo "Дальше выполните: bash deploy/release.sh"
