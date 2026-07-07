# Agent Instructions — CMS Sekolah

## Stack
- Backend: NestJS 10 (REST API, Prisma 6 ORM)
- Frontend: Next.js 15 (App Router + React 19, CSR/SSG/ISR)
- Database: PostgreSQL 16 + Redis 7
- Monorepo: Turborepo + pnpm 9
- Auth: JWT + CASL (row-level & action-level security)

## Coding Rules
- TypeScript strict mode, no `any`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- PR title format: `[Module] Description` (e.g. `[SPMB] Add auto-selection engine`)
- Branch naming: `feat/module-name`, `fix/issue-description`
- Max 50 LOC per function
- Named constants for magic values
- Early returns, no nested if-else
- Wrap errors with context: `throw new Error('Failed to fetch students: ' + e.message)`
- Always handle errors, never swallow
- Test-first for behavior changes (TDD)

## Workflow
1. `git checkout -b feat/xxx`
2. Write test → see RED
3. Implement → see GREEN
4. Refactor → tests stay GREEN
5. `pnpm lint` + `pnpm test` — must pass
6. `git commit` with conventional message
7. Open PR, request review

## Directory Structure
```
packages/
  backend/
    src/
      modules/          # Domain modules (auth, cms, spmb, etc.)
      common/           # Guards, decorators, interceptors
      prisma/           # Schema, migrations, seeds
  frontend/
    src/
      app/              # App Router pages
      components/       # Reusable UI components
      hooks/            # Custom React hooks
      lib/              # API client, utils
  shared/
    src/
      types/            # Shared TypeScript types
      dto/              # Validation schemas (Zod)
      utils/            # Pure utility functions
```

## Important
- Read `docs/PRD.md` for full requirements
- Read `docs/DESIGN.md` for UI design system
- Read `docs/API.md` for API reference
- Read `docs/ROADMAP.md` for current priorities
- Multi-tenant: always filter by `branchId`
- SPMB config stored as JSONB — never hardcode selection logic
