#!/usr/bin/env bash
# =====================================================================
# Скрипт деплоя обновления проекта.
# Запускать из корня репозитория после git pull.
# =====================================================================

set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Файл .env не найден в корне. Скопируйте .env.example -> .env" >&2
  exit 1
fi

set -a; source .env; set +a

echo "==> Установка зависимостей"
pnpm install --frozen-lockfile

echo "==> Сборка"
pnpm run build

echo "==> Применение схемы БД (drizzle push)"
pnpm --filter @workspace/db run push

echo "==> Деплой статики фронта в /var/www/mds-site"
sudo mkdir -p /var/www/mds-site
sudo rsync -a --delete artifacts/site/dist/public/ /var/www/mds-site/

echo "==> Перезапуск API через pm2"
if pm2 describe mds-api >/dev/null 2>&1; then
  pm2 restart mds-api --update-env
else
  pm2 start "node --enable-source-maps artifacts/api-server/dist/index.mjs" \
    --name mds-api --update-env
  pm2 save
  pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null || true
fi

echo "Готово. Сайт обновлён."
