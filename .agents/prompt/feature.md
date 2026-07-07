# Feature Prompt Template — CMS Sekolah

Use this template when implementing a new feature.

---

## Context
You are implementing a feature for CMS Sekolah, a school management system.

**Tech Stack:**
- Backend: NestJS 10 + Prisma 6 + PostgreSQL 16
- Frontend: Next.js 15 + React 19 + Tailwind + shadcn/ui
- Monorepo: Turborepo + pnpm

**Read first:**
- `docs/PRD.md` — full requirements
- `docs/API.md` — existing endpoints
- `docs/DESIGN.md` — UI design system

## Requirements
[Describe the feature requirements here]

## Implementation Plan
1. Add Prisma schema changes (if needed)
2. Create/update NestJS module (controller, service, DTO)
3. Write Zod validation schema in `packages/shared/src/dto/`
4. Add CASL ability rules
5. Create Next.js pages/components
6. Connect with TanStack Query hooks
7. Write tests

## Acceptance Criteria
- [ ] [AC 1]
- [ ] [AC 2]
