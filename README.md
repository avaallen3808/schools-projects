# CMS Sekolah 🏫

School Content & Management System — platform manajemen sekolah terpadu.

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | NestJS 10 + Prisma 6 + PostgreSQL 16 |
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind 4 |
| Monorepo | Turborepo + pnpm 9 |
| Auth | JWT + CASL (ACL) |
| Cache | Redis 7 |

## Modules

- **Website & CMS** — Blog, pages, sliders, gallery, comments
- **Master Data** — Branches, academic years, rombel, references
- **SPMB** — Penerimaan siswa, multi-gelombang, seleksi otomatis
- **Users** — Students, GTK, alumni, Excel import
- **Presence** — Harian, mapel, GTK
- **ACL** — Role & permission management

## Quick Start

```bash
# Prerequisites: Node.js 20+, pnpm 9, Docker Desktop

# 1. Clone & install
git clone <repo-url>
cd schools-projects
pnpm install

# 2. Start DB services
docker compose up -d

# 3. Setup environment
cp .env.example .env

# 4. Push schema & seed
pnpm --filter backend prisma:push
pnpm --filter backend prisma:seed

# 5. Run dev
pnpm dev
```

## Docs

| File | Content |
|------|---------|
| [PRD.md](docs/PRD.md) | Product requirements |
| [API.md](docs/API.md) | API reference |
| [DESIGN.md](docs/DESIGN.md) | UI design system |
| [ROADMAP.md](docs/ROADMAP.md) | Milestones & sprints |
| [SKILL.md](docs/SKILL.md) | Development skills & patterns |
| [.agents/instructions.md](.agents/instructions.md) | Agent setup guide |

## Project Structure

```
packages/
  backend/          # NestJS API (src/modules/{auth,cms,spmb,...})
  frontend/         # Next.js app (app router + components)
  shared/           # Shared types, Zod DTOs, utilities
docs/               # Documentation
.agents/            # Agent instructions & prompts
```
