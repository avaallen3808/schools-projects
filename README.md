# CMS Sekolah 🏫

School Content & Management System — platform manajemen sekolah terpadu.

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | NestJS 10 + Prisma 6 + PostgreSQL 16 |
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind 4 |
| Monorepo | Turborepo + pnpm 9 |
| Auth | JWT + CASL (RBAC) |
| Cache | Redis 7 |

## Quick Start

```bash
pnpm install
docker compose up -d postgres redis
pnpm --filter @cms-sekolah/backend prisma:generate
pnpm --filter @cms-sekolah/backend prisma:push
pnpm --filter @cms-sekolah/backend prisma:seed
pnpm --filter @cms-sekolah/shared build
pnpm dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000/api
- **Login**: `admin@sekolah.com` / `admin123`

## Modules

| Module | Backend | Frontend | Tests |
|--------|---------|----------|-------|
| 🔐 Auth | 7 endpoints | login, register, verify email | 8 ✅ |
| 📝 CMS | 21 endpoints | blog, pages, admin | 5 ✅ |
| 🏫 Master Data | 15 endpoints | — | 6 ✅ |
| 👥 Users | 5 endpoints | /admin/users | 5 ✅ |
| 📋 SPMB | 19 endpoints | /admin/spmb | 6 ✅ |
| ✅ Presence | 7 endpoints | /admin/presence | 5 ✅ |
| 🔒 ACL | 1 endpoint | — | 4 ✅ |
| 📤 Media | 3 endpoints | — | — |

**78 endpoints · 42 unit tests · 7 admin pages**

## Docs

| File | Content |
|------|---------|
| [USAGE.md](docs/USAGE.md) | **Full usage guide — setup, API, deployment** |
| [PRD.md](docs/PRD.md) | Product requirements |
| [API.md](docs/API.md) | API reference |
| [DESIGN.md](docs/DESIGN.md) | UI design system (#fdc72f accent) |
| [ROADMAP.md](docs/ROADMAP.md) | Milestones & sprints |

## Structure

```
packages/
  backend/     # NestJS API — 8 modules
  frontend/    # Next.js App Router — 15 pages
  shared/      # Types, Zod DTOs, utils
docs/          # Documentation
```

---

## Docker

```bash
docker compose up --build -d
```

Full stack: PostgreSQL + Redis + API (:4000) + Frontend (:3000).
