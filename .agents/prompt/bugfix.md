# Bugfix Prompt Template — CMS Sekolah

Use this template when fixing a bug.

---

## Context
You are fixing a bug in CMS Sekolah, a school management system.

**Tech Stack:**
- Backend: NestJS 10 + Prisma 6 + PostgreSQL 16
- Frontend: Next.js 15 + React 19 + Tailwind + shadcn/ui

**Read first:**
- `docs/PRD.md` — expected behavior
- `docs/API.md` — endpoint contracts

## Bug Report
**Title:** [Brief description]
**Module:** [auth / cms / spmb / presence / users / master]
**Severity:** [critical / high / medium / low]

**Steps to Reproduce:**
1. ...
2. ...

**Expected:** ...
**Actual:** ...

## Investigation Checklist
- [ ] Reproduce the bug locally
- [ ] Find root cause in backend service or frontend component
- [ ] Check related tests (do they exist? do they cover this case?)
- [ ] Check if same pattern exists elsewhere

## Fix Plan
1. Write regression test (RED)
2. Implement minimal fix (GREEN)
3. Refactor if needed
4. Run `pnpm test` and `pnpm lint`
