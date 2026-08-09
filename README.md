# SAT Math Drill MVP

A mastery-based SAT Math practice program with separate Drill and Live Challenge experiences.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Demo accounts retain browser-local progress while the hosted curriculum schema is managed through Sites D1.

Demo accounts:

- Student: `student@example.com` / `demo123`
- New student with no progress: `newstudent@example.com` / `demo123`
- Admin: `admin@example.com` / `demo123`

## Curriculum database

The canonical hierarchy is Domain → Skill → Drill Unit → Framework Target → Question. Generate, apply, and verify the local D1 migration with:

```bash
npm run db:generate
npm run db:migrate:local
npm run db:verify:local
```

The additive migration is stored in `drizzle/` and is included in Sites deployment packages. `supabase/schema.sql` remains synchronized as a compatibility schema for a future Supabase-backed adapter.

## Optional Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and add the project URL and keys.
4. Create private Storage buckets for question images and challenge videos.
5. Replace the local adapter in `components/AppProvider.tsx` with the client in `lib/supabase/client.ts`.

## Product structure

- `app/` — Next.js routes for login, student, drill, progress, and teacher areas
- `components/` — reusable shells and complete product experiences
- `lib/curriculum.ts` — 4 domains, 19 student-facing skills, 121 ordered drill units, framework targets, questions, and question models
- `lib/appState.ts` — versioned progress and safe legacy-data migration
- `db/schema.ts` — canonical D1 schema
- `drizzle/` — generated and applied D1 migration
- `supabase/schema.sql` — compatible Postgres schema, indexes, and starter RLS

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run sites:build
```
