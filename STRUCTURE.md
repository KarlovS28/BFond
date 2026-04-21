# Структура проекта «Мечты добрых сердец»

Этот документ описывает каждую важную папку и файл, чтобы вам было проще
ориентироваться и быстро находить нужное место для правки.

## Корень

| Путь                       | Что это |
| -------------------------- | ------- |
| `README.md`                | Инструкция по проекту, переменные окружения, деплой. |
| `STRUCTURE.md`             | Этот файл — карта проекта. |
| `.env.example`             | Образец файла с переменными окружения (скопировать в `.env`). |
| `package.json`             | Корневой файл монорепо: команды для типовой проверки и сборки. |
| `pnpm-workspace.yaml`      | Список рабочих пакетов внутри монорепо. |
| `tsconfig.base.json`       | Общие настройки TypeScript для всех пакетов. |
| `tsconfig.json`            | Корневой TS-«solution» (для библиотек). |

## Папка `artifacts/`

Содержит запускаемые приложения проекта.

### `artifacts/site/` — фронтенд лендинга и админка

| Путь                                       | Назначение |
| ------------------------------------------ | ---------- |
| `index.html`                               | HTML-точка входа: title, meta, шрифты Google, контейнер React. |
| `vite.config.ts`                           | Конфиг Vite (порт, base path, плагины). |
| `package.json`                             | Зависимости фронта. |
| `tsconfig.json`                            | TypeScript-настройки фронта. |
| `public/robots.txt`                        | Файл для поисковых роботов. |
| `public/sitemap.xml`                       | Карта сайта. |
| `src/main.tsx`                             | Bootstrap React-приложения. |
| `src/App.tsx`                              | Роутер (wouter), провайдеры (TanStack Query, тосты). |
| `src/index.css`                            | Tailwind v4, переменные темы (HSL цвета палитры), Google Fonts. |
| `src/lib/format.ts`                        | Хелперы форматирования (рубли, дата, проценты). |
| `src/lib/utils.ts`                         | Общие утилиты (`cn` для классов и т.п.). |
| `src/pages/LandingPage.tsx`                | Длинный лендинг (склеивает все секции). |
| `src/pages/AdminLoginPage.tsx`             | Страница входа в админку. |
| `src/pages/AdminPage.tsx`                  | Защищённая админ-панель с вкладками. |
| `src/pages/not-found.tsx`                  | Страница 404. |
| `src/components/landing/Header.tsx`        | Шапка с навигацией. |
| `src/components/landing/Hero.tsx`          | Первый экран. |
| `src/components/landing/AboutSection.tsx`  | Блок «О фонде». |
| `src/components/landing/ChildrenSection.tsx` | Список карточек подопечных. |
| `src/components/landing/ChildCard.tsx`     | Одна карточка ребёнка с прогрессом. |
| `src/components/landing/ChildDialog.tsx`   | Попап с подробной информацией и выбором суммы пожертвования. |
| `src/components/landing/DonationPanel.tsx` | Кнопки сумм + переход к оплате. |
| `src/components/landing/UrgentMarquee.tsx` | Бегущая строка «СРОЧНЫЙ СБОР». |
| `src/components/landing/StoriesCarousel.tsx` | Карусель историй спасённых. |
| `src/components/landing/HowToHelp.tsx`     | Три карточки «Как помочь». |
| `src/components/landing/VolunteerDialog.tsx` | Форма волонтёра. |
| `src/components/landing/MaterialHelpDialog.tsx` | Форма «Привезти вещи». |
| `src/components/landing/HelpRequestForm.tsx` | Заявка на размещение ребёнка. |
| `src/components/landing/ReportsSection.tsx` | Список PDF-отчётов и архив. |
| `src/components/landing/ContactsSection.tsx` | Контакты, соцсети и форма «Связаться». |
| `src/components/landing/Footer.tsx`        | Подвал сайта. |
| `src/components/landing/PrivacyDialog.tsx` | Модалка «Политика конфиденциальности». |
| `src/components/admin/AdminLayout.tsx`     | Каркас админки (шапка, выход). |
| `src/components/admin/AdminChildrenTab.tsx` | CRUD по карточкам детей. |
| `src/components/admin/AdminStoriesTab.tsx` | CRUD по историям спасённых. |
| `src/components/admin/AdminReportsTab.tsx` | Загрузка/удаление PDF-отчётов. |
| `src/components/admin/AdminSubmissionsTab.tsx` | Просмотр форм (волонтёры, помощь, заявки, контакты). |
| `src/components/admin/AdminStatsTab.tsx`   | Недельная статистика пожертвований. |
| `src/components/admin/AdminSettingsTab.tsx` | Настройки фонда, реквизиты, QR, логотип, соцсети, документы. |
| `src/components/ui/`                       | Готовые компоненты shadcn/ui. |

### `artifacts/api-server/` — API на Express

| Путь                                       | Назначение |
| ------------------------------------------ | ---------- |
| `src/index.ts`                             | Точка входа сервера (читает `PORT`). |
| `src/app.ts`                               | Сборка Express, middleware, инициализация админа и сидов. |
| `build.mjs`                                | Конфиг esbuild для прод-сборки в один файл. |
| `package.json`                             | Зависимости API. |
| `src/lib/logger.ts`                        | Pino-логгер. |
| `src/lib/auth.ts`                          | Сессии админа (cookie + bcrypt). |
| `src/lib/settings.ts`                      | Чтение и обновление настроек фонда. |
| `src/lib/seed.ts`                          | Заполнение демо-данных при первом запуске. |
| `src/routes/index.ts`                      | Сборка роутера API. |
| `src/routes/health.ts`                     | `GET /api/healthz` — health check. |
| `src/routes/public.ts`                     | Публичные эндпоинты (дети, истории, отчёты, формы). |
| `src/routes/admin.ts`                      | Эндпоинты админ-панели (CRUD + защита по сессии). |

## Папка `lib/` — общие пакеты монорепо

| Путь                                | Назначение |
| ----------------------------------- | ---------- |
| `lib/api-spec/openapi.yaml`         | Контракт API (источник правды для генерации хуков и схем). |
| `lib/api-spec/orval.config.ts`      | Конфиг генератора Orval. |
| `lib/api-client-react/src/`         | Сгенерированные React Query хуки + кастомный fetch. |
| `lib/api-zod/src/`                  | Сгенерированные Zod-схемы для валидации. |
| `lib/db/src/index.ts`               | Подключение к PostgreSQL через Drizzle. |
| `lib/db/src/schema/index.ts`        | Описание всех таблиц БД (children, stories, reports, …). |
| `lib/db/drizzle.config.ts`          | Конфиг drizzle-kit (миграции/push). |

## Папка `deploy/` — материалы для самостоятельного деплоя

| Путь                  | Назначение |
| --------------------- | ---------- |
| `deploy/install.sh`   | Установка Node, Postgres, Nginx, certbot, pm2 на Ubuntu. |
| `deploy/release.sh`   | Сборка и обновление приложения на сервере. |
| `deploy/nginx.conf`   | Готовый конфиг nginx (reverse-proxy + статика). |

## Где править что

- Дизайн / тексты лендинга → `artifacts/site/src/components/landing/*` и
  `src/index.css`.
- Тексты по умолчанию (миссия, реквизиты, телефон) → таблица `settings`
  в БД (правится через админку), значения по умолчанию —
  `artifacts/api-server/src/lib/settings.ts`.
- Поля карточки ребёнка → `lib/db/src/schema/index.ts` (таблица `children`)
  + соответствующие схемы в `lib/api-spec/openapi.yaml`. После правки
  обязательно перегенерировать клиент:
  `pnpm --filter @workspace/api-spec run codegen`.
- Адрес sitemap / правила роботов → `artifacts/site/public/robots.txt`,
  `artifacts/site/public/sitemap.xml`.
- Конфиг nginx → `deploy/nginx.conf`.
