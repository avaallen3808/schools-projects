# CMS Sekolah — Usage Guide

## Prerequisites

- Node.js 20+
- pnpm 9 (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker Desktop
- Git

---

## 1. Setup Development Environment

```bash
# Clone
git clone <repo-url>
cd schools-projects

# Install dependencies
pnpm install

# Start PostgreSQL + Redis
docker compose up -d postgres redis

# Setup env vars (defaults work for local dev)
# Already provided: packages/backend/.env, packages/frontend/.env

# Generate Prisma client + push schema
pnpm --filter @cms-sekolah/backend prisma:generate
pnpm --filter @cms-sekolah/backend prisma:push

# Seed default data
pnpm --filter @cms-sekolah/backend prisma:seed

# Build shared package
pnpm --filter @cms-sekolah/shared build

# Start dev servers (API :4000 + Frontend :3000)
pnpm dev
```

---

## 2. Seed Accounts

After seeding (`prisma:seed`), these accounts are available:

| Email | Password | Role |
|-------|----------|------|
| `admin@sekolah.com` | `admin123` | SUPERADMIN |

Create more users via POST `/api/users` (requires superadmin token) or register via `/register`.

---

## 3. Available Scripts

### Root (Turborepo)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run API + Frontend concurrently |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check all packages |

### Backend (`packages/backend`)

| Command | Description |
|---------|-------------|
| `pnpm --filter backend dev` | Start NestJS dev (watch mode) |
| `pnpm --filter backend build` | Compile NestJS |
| `pnpm --filter backend test` | Run all unit tests |
| `pnpm --filter backend prisma:generate` | Regenerate Prisma client |
| `pnpm --filter backend prisma:push` | Push schema to DB |
| `pnpm --filter backend prisma:migrate` | Create migration |
| `pnpm --filter backend prisma:seed` | Seed data |
| `pnpm --filter backend prisma:studio` | Open Prisma Studio (GUI) |

### Frontend (`packages/frontend`)

| Command | Description |
|---------|-------------|
| `pnpm --filter frontend dev` | Start Next.js (port 3000) |
| `pnpm --filter frontend build` | Production build |
| `pnpm --filter frontend typecheck` | TypeScript check |

### Shared (`packages/shared`)

| Command | Description |
|---------|-------------|
| `pnpm --filter shared build` | Compile shared types + DTOs |

---

## 4. Docker (Full Stack)

Start all services (PostgreSQL + Redis + API + Frontend):

```bash
# Build & run
docker compose up --build -d

# Check logs
docker compose logs -f

# Run migrations on the API container
docker compose exec api npx prisma db push

# Seed
docker compose exec api npx ts-node prisma/seed.ts

# Stop
docker compose down

# Stop + delete volumes (reset DB)
docker compose down -v
```

### Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## 5. API Endpoints

All endpoints prefixed with `/api`. Auth endpoints are public; most others require JWT Bearer token.

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → access + refresh tokens |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/profile` | Get current user (JWT) |

### CMS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cms/posts` | — | List published posts |
| GET | `/api/cms/posts/:slug` | — | Get post by slug |
| POST | `/api/cms/posts` | JWT | Create post |
| PUT | `/api/cms/posts/:id` | JWT | Update post |
| DELETE | `/api/cms/posts/:id` | JWT | Delete post |
| GET | `/api/cms/categories` | — | List categories |
| POST | `/api/cms/categories` | JWT | Create category |
| DELETE | `/api/cms/categories/:id` | JWT | Delete category |
| GET | `/api/cms/pages/:slug` | — | Get page by slug |
| POST | `/api/cms/pages` | JWT | Create page |
| GET | `/api/cms/sliders` | — | List active sliders |
| POST | `/api/cms/sliders` | JWT | Create slider |
| DELETE | `/api/cms/sliders/:id` | JWT | Delete slider |
| POST | `/api/cms/comments` | — | Submit comment |
| PUT | `/api/cms/comments/:id/approve` | JWT | Approve comment |
| POST | `/api/cms/contact` | — | Submit contact message |
| GET | `/api/cms/admin/contact-messages` | JWT | List messages |
| GET | `/api/cms/admin/posts` | JWT | List all posts (incl. drafts) |

### Master Data (all JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/master/branches` | List / Create |
| GET/PUT/DELETE | `/api/master/branches/:id` | Get / Update / Delete |
| GET/POST | `/api/master/academic-years` | List / Create |
| PUT | `/api/master/academic-years/:id` | Update |
| POST/DELETE | `/api/master/academic-years/:id/branches/:branchId` | Assign / Remove branch |
| GET/POST | `/api/master/entry-grades` | List / Create |
| DELETE | `/api/master/entry-grades/:id` | Delete |
| GET/POST | `/api/master/tracks` | List / Create |
| DELETE | `/api/master/tracks/:id` | Delete |

### Users (all JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List (filterable by role, branch) |
| GET | `/api/users/:id` | Get detail |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update |
| DELETE | `/api/users/:id` | Delete |

### SPMB (all JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/spmb/periods` | List / Create admission period |
| PUT | `/api/spmb/periods/:id` | Update period |
| GET/POST | `/api/spmb/offerings` | List / Create offering |
| PUT | `/api/spmb/offerings/:id` | Update offering |
| GET/POST/DELETE | `/api/spmb/requirements` | Manage requirements |
| GET | `/api/spmb/registrations` | List registrations |
| GET/POST | `/api/spmb/registrations/:id` | Get / Create registration |
| PUT | `/api/spmb/registrations/:id/status` | Update status |
| POST | `/api/spmb/documents` | Upload document |
| PUT | `/api/spmb/documents/:id/verify` | Verify document |
| POST | `/api/spmb/grades/subject` | Add subject grade |
| POST | `/api/spmb/grades/exam` | Add exam score |
| POST | `/api/spmb/registrations/:id/calculate` | Calculate total score |
| POST | `/api/spmb/selection/run` | Run auto-selection |

### Presence (all JWT)

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/presence/rombels` | List / Create rombel |
| DELETE | `/api/presence/rombels/:id` | Delete rombel |
| GET | `/api/presence/records` | List presence records |
| POST | `/api/presence/records` | Create / update record |
| POST | `/api/presence/records/bulk` | Bulk create records |
| GET | `/api/presence/stats/:rombelId` | Attendance statistics |

### Media (all JWT)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/media/upload` | Upload file (multipart) |
| DELETE | `/api/media/:filename` | Delete file |
| GET | `/api/media/list` | List files |

### ACL

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/acl/my-abilities` | Get current user permissions |

---

## 6. Authentication Flow

```mermaid
sequenceDiagram
    Client->>API: POST /api/auth/login {email, password}
    API-->>Client: { accessToken, refreshToken, user }

    Client->>API: GET /api/auth/profile (Authorization: Bearer accessToken)
    API-->>Client: { id, email, name, role, ... }

    Note over Client,API: accessToken expires in 7 days
    Client->>API: POST /api/auth/refresh { refreshToken }
    API-->>Client: { accessToken, refreshToken } (rotated)
```

- Store tokens securely (Zustand persist in frontend)
- Access token: 7 days expiry
- Refresh token: 30 days expiry, single-use (rotated on refresh)
- Refresh token stored in DB, enabling server-side revocation

---

## 7. Project Structure

```
schools-projects/
├── docker-compose.yml         # PostgreSQL + Redis + API + Frontend
├── docs/                      # Documentation
│   ├── PRD.md                 # Product requirements
│   ├── API.md                 # Full API reference
│   ├── DESIGN.md              # UI design system
│   ├── ROADMAP.md             # Milestones & sprints
│   └── USAGE.md               # This file
├── packages/
│   ├── backend/               # NestJS API
│   │   ├── prisma/            # Schema + migrations + seed
│   │   └── src/
│   │       ├── common/        # Guards, decorators, filters, pipes
│   │       └── modules/       # auth, cms, master, users, spmb, presence, acl, media
│   ├── frontend/              # Next.js 15 App Router
│   │   └── src/
│   │       ├── app/           # Pages (admin/*, blog, spmb, login, register)
│   │       ├── components/    # UI components + layout
│   │       └── lib/           # API client, Zustand stores, hooks
│   └── shared/                # Shared types, Zod DTOs, utilities
└── .agents/                   # Agent instructions
```

---

## 8. Frontend Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | Public | Homepage |
| `/blog` | Public (SSR) | Blog listing with pagination |
| `/blog/:slug` | Public (SSR) | Blog detail |
| `/pages/:slug` | Public (SSR) | Static CMS pages |
| `/spmb` | Public (SSR) | SPMB landing (dynamic from API) |
| `/login` | Client | Login form |
| `/register` | Client | Registration form |
| `/verify-email` | Client | Email verification |
| `/admin` | Client (auth) | Dashboard |
| `/admin/users` | Client (auth) | User management |
| `/admin/posts` | Client (auth) | Blog posts |
| `/admin/categories` | Client (auth) | Categories |
| `/admin/pages` | Client (auth) | Static pages |
| `/admin/sliders` | Client (auth) | Homepage sliders |
| `/admin/spmb` | Client (auth) | SPMB overview |
| `/admin/presence` | Client (auth) | Attendance |

---

## 9. Testing

```bash
# Run all backend unit tests
pnpm --filter @cms-sekolah/backend test

# Run with coverage
pnpm --filter @cms-sekolah/backend test -- --coverage

# Typecheck frontend
pnpm --filter @cms-sekolah/frontend typecheck

# Typecheck backend
pnpm --filter @cms-sekolah/backend typecheck

# Build shared (required after changing DTOs)
pnpm --filter @cms-sekolah/shared build
```

Current coverage: **42 unit tests across 7 modules** (auth, cms, master, users, spmb, presence, acl).

---

## 10. Environment Variables

### Backend (`packages/backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/cms_sekolah` | PostgreSQL connection |
| `JWT_SECRET` | (required) | Secret for signing tokens |
| `JWT_EXPIRATION` | `7d` | Access token expiry |
| `JWT_REFRESH_EXPIRATION` | `30d` | Refresh token expiry |
| `PORT` | `4000` | API port |
| `API_PREFIX` | `api` | Global route prefix |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `THROTTLE_LIMIT` | `60` | Requests per minute |
| `UPLOAD_DIR` | `./uploads` | File upload directory |

### Frontend (`packages/frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | API base URL |

---

## 11. Common Tasks

### Reset Database

```bash
docker compose down -v
docker compose up -d postgres redis
pnpm --filter @cms-sekolah/backend prisma:push
pnpm --filter @cms-sekolah/backend prisma:seed
```

### Add New Module

1. Create folder `packages/backend/src/modules/[name]/`
2. Add `[name].module.ts`, `[name].service.ts`, `[name].controller.ts`
3. Register module in `app.module.ts`
4. Add Zod DTOs in `packages/shared/src/dto/`
5. Write unit tests
6. Create admin page at `packages/frontend/src/app/admin/[name]/page.tsx`
