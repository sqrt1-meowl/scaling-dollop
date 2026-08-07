# SAT Math Drill MVP

A mastery-based SAT Math practice program with separate Drill and Live Challenge experiences.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The app uses seeded local data when Supabase variables are absent.

Demo accounts:

- Student: `student@example.com` / `demo123`
- Admin: `admin@example.com` / `demo123`

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and add the project URL and keys.
4. Create private Storage buckets for question images and challenge videos.
5. Replace the local adapter in `components/AppProvider.tsx` with the client in `lib/supabase/client.ts`. The UI already uses schema-aligned objects.

## Product structure

- `app/` — Next.js routes for login, student, drill, progress, and teacher areas
- `components/` — reusable shells and complete product experiences
- `lib/curriculum.ts` — 4 categories, 20 topics, and seeded questions
- `lib/appState.ts` — mock data structures aligned to the database
- `supabase/schema.sql` — relational Postgres schema, indexes, and starter RLS

## Validation

```bash
npm run typecheck
npm run build
```
