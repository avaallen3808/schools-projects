# Roadmap — CMS Sekolah v2.1.0

## Milestones

### Milestone 1: Foundation (Week 1-3)
- [ ] Turborepo setup (packages/backend, frontend, shared)
- [ ] PostgreSQL + Prisma schema (all domains)
- [ ] Auth system (register, login, JWT, email verification)
- [ ] CASL ACL setup
- [ ] Basic UI shell (Next.js + Tailwind + shadcn/ui)
- [ ] CI/CD pipeline (GitHub Actions)

### Milestone 2: Master Data & Users (Week 4-6)
- [ ] Branch management (multi-tenant)
- [ ] Academic year & rombel
- [ ] Student CRUD + Excel import
- [ ] Teacher CRUD + Excel import
- [ ] Alumni directory + self-registration

### Milestone 3: SPMB Core (Week 7-10)
- [ ] Period & offering management
- [ ] Dynamic requirements & document upload
- [ ] Registration flow (multi-step form + DRAFT/SUBMITTED)
- [ ] Input nilai rapor & ujian
- [ ] Auto-selection engine (weighted scoring + ranking)
- [ ] PDF certificate generation

### Milestone 4: CMS & Presence (Week 11-13)
- [ ] Blog/Article CRUD + categories
- [ ] Static pages, sliders, menus
- [ ] Comments with moderation
- [ ] Album/gallery
- [ ] Daily attendance (rombel)
- [ ] Subject attendance (per mapel)
- [ ] Attendance reports

### Milestone 5: Polish & Launch (Week 14-16)
- [ ] Public-facing pages (SEO, SSG)
- [ ] Newsletter & contact form
- [ ] Performance optimization (LCP < 3s)
- [ ] E2E testing
- [ ] Security audit
- [ ] Deployment to Vercel + Railway/VPS

## Out of Scope (v2.1.0)
- Keuangan / SPP / Akuntansi
- LMS / E-Learning
- Mobile native (PWA only)
- Dapodik / EMIS integration (export only)

## Future Ideas (Post v2.1.0)
- Push notification (web + email)
- SPP & keuangan module
- LMS lite
- Parent portal
- WhatsApp integration (SPMB status updates)
- Dapodik sync (read/write)
