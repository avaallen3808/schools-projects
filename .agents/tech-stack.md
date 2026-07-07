# Tech Stack — CMS Sekolah

| Layer | Tech | Version | Purpose |
|-------|------|---------|---------|
| Language | TypeScript | 5.x | Strict mode everywhere |
| Monorepo | Turborepo | 2.x | Build orchestration |
| Package Mgr | pnpm | 9.x | Fast, disk-efficient |
| Backend | NestJS | 10.x | API framework |
| ORM | Prisma | 6.x | DB schema + queries |
| DB | PostgreSQL | 16.x | Primary database |
| Cache | Redis | 7.x | Sessions, caching |
| Auth | Passport + JWT | — | Authentication |
| ACL | CASL | 6.x | Authorization |
| Validation | Zod | 3.x | Request validation |
| Frontend | Next.js | 15.x | React framework (App Router) |
| UI Library | shadcn/ui | — | Component primitives |
| CSS | Tailwind CSS | 4.x | Utility-first styling |
| Forms | React Hook Form | 7.x | Form management |
| Data Fetch | TanStack Query | 5.x | Server state |
| State | Zustand | 5.x | Client state |
| PDF | handlebars | — | Template engine |
| File | Multer | — | Upload handling |
| Image | Sharp | — | Image processing |
| Test | Jest + Vitest | — | Unit/integration tests |
| E2E | Playwright | — | Browser testing |
| Lint | ESLint + Prettier | — | Code quality |
| CI/CD | GitHub Actions | — | Automated pipeline |
| Deploy FE | Vercel | — | Edge network |
| Deploy BE | Railway/VPS | — | Docker container |
