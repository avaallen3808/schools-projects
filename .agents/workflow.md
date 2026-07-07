# Workflow — CMS Sekolah

## Development Flow

```
main → checkout branch → code → commit → PR → review → merge → deploy
```

## Commands

```bash
# Development
pnpm dev                  # Run all packages in dev mode
pnpm --filter backend dev # Run backend only
pnpm --filter frontend dev # Run frontend only

# Database
pnpm --filter backend prisma:generate  # Generate Prisma client
pnpm --filter backend prisma:push      # Push schema to DB
pnpm --filter backend prisma:migrate   # Run migrations
pnpm --filter backend prisma:seed      # Seed database

# Quality
pnpm lint                 # Lint all packages
pnpm test                 # Run all tests
pnpm build                # Build all packages
```

## Branch Strategy
- `main` — production-ready
- `develop` — integration branch (optional)
- `feat/*` — new features
- `fix/*` — bug fixes
- `chore/*` — maintenance

## Commit Convention
```
feat(spmb): add auto-selection engine
fix(auth): prevent token reuse after logout
docs(api): update SPMB endpoints
chore(deps): upgrade Prisma to 6.1
```

## PR Template
```markdown
## What
Brief description

## Why
Context / ticket link

## How
Approach taken

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing done

## Screenshots (if UI)
```
