# Memory — CMS Sekolah

## Decisions
- Monorepo: Turborepo + pnpm (backend, frontend, shared)
- Multi-tenant via `branchId` column (single DB)
- SPMB selection config: JSONB column, not hardcoded rules
- Auth: JWT access + refresh tokens, email verification required
- ACL: CASL abilities stored in DB, checked per-request via Guard
- UI: shadcn/ui + Tailwind, design from DESIGN.md (Blue University Two)
- Form validation: Zod schemas shared between frontend and backend

## Key Files
- `docs/PRD.md` — full product requirements
- `docs/DESIGN.md` — UI design system
- `docs/API.md` — API endpoint reference
- `docs/ROADMAP.md` — milestones and priorities

## Gotchas
- SPMB `selectionConfig` is JSONB — always parse, never assume shape
- `branchId` filter required on all multi-tenant queries
- Student import: validate per-row, return row-level errors
- Auto-selection: weighted scoring, must handle ties deterministically
- PDF generation: use handlebars templates, not raw HTML
