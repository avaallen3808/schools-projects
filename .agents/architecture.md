# System Architecture

## High-Level

- Frontend: Next.js 15 (SSG/ISR for public, CSR for dashboards)
- Backend: NestJS 10 REST API
- Database: PostgreSQL 16 + Redis 7
- Auth: JWT + CASL (row-level security)

## Module Dependencies

- Auth & ACL wraps all modules
- Master Data feeds into SPMB, Users, Presence
- SPMB depends on Master Data and Users
- Presence depends on Users and Master Data

## Deployment

- Frontend: Vercel (Edge Network)
- Backend: VPS/Railway (Docker)
- Database: Managed PostgreSQL + Redis
- Storage: S3-compatible for files
