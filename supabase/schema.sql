-- SAT Math Drill relational schema for Supabase Postgres
create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'admin');
create type public.topic_status as enum ('locked', 'available', 'in_progress', 'review', 'complete');
create type public.question_difficulty as enum ('easy', 'medium', 'hard', 'gate');
create type public.question_type as enum ('multiple_choice', 'student_response');
create type public.error_kind as enum ('Concept', 'Procedure', 'Careless', 'Time');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  teacher_id uuid references public.users(id) on delete set null,
  baseline_score integer check (baseline_score between 200 and 800),
  last_active_at timestamptz default now()
);

create table public.categories (
  id text primary key,
  name text not null,
  sat_weight integer not null check (sat_weight between 0 and 100),
  accent text not null,
  sort_order integer not null
);

create table public.topics (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  code text not null unique,
  title text not null,
  subtitle text,
  concept_notes jsonb not null default '[]'::jsonb,
  worked_example jsonb not null default '{}'::jsonb,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  category_id text not null references public.categories(id) on delete cascade,
  topic_id text not null references public.topics(id) on delete cascade,
  difficulty public.question_difficulty not null,
  type public.question_type not null,
  prompt text not null,
  image_url text,
  choices jsonb,
  correct_answer text not null,
  explanation text not null,
  source_label text,
  source_question_id text,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.student_question_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer text,
  is_correct boolean not null,
  attempt_number integer not null default 1,
  elapsed_seconds integer,
  created_at timestamptz not null default now()
);

create table public.topic_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  topic_id text not null references public.topics(id) on delete cascade,
  easy_completed integer not null default 0,
  medium_completed integer not null default 0,
  gate_score integer check (gate_score between 0 and 4),
  status public.topic_status not null default 'locked',
  challenge_completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (student_id, topic_id)
);

create table public.challenge_lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null unique references public.topics(id) on delete cascade,
  title text not null,
  question_text text not null,
  question_image_url text,
  source_question_id text,
  video_url text,
  video_storage_path text,
  takeaway text,
  notes text,
  updated_at timestamptz not null default now()
);

create table public.warmup_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  is_correct boolean not null,
  elapsed_seconds integer not null,
  needs_review boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.score_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  test_date date not null,
  math_score integer not null check (math_score between 200 and 800),
  source_label text not null default 'Official Bluebook Practice Score',
  recorded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.error_tags (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null unique references public.student_question_attempts(id) on delete cascade,
  tag public.error_kind,
  assigned_by uuid references public.users(id) on delete set null,
  assigned_at timestamptz
);

create index questions_topic_difficulty_idx on public.questions(topic_id, difficulty, sort_order);
create index attempts_student_created_idx on public.student_question_attempts(student_id, created_at desc);
create index progress_student_status_idx on public.topic_progress(student_id, status);
create index scores_student_date_idx on public.score_records(student_id, test_date);

alter table public.users enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_question_attempts enable row level security;
alter table public.topic_progress enable row level security;
alter table public.warmup_attempts enable row level security;
alter table public.score_records enable row level security;
alter table public.error_tags enable row level security;

create policy "Users read their own account" on public.users for select using (auth.uid() = id);
create policy "Students read their profile" on public.student_profiles for select using (user_id = auth.uid());
create policy "Students read their progress" on public.topic_progress for select using (student_id in (select id from public.student_profiles where user_id = auth.uid()));
create policy "Students write their progress" on public.topic_progress for all using (student_id in (select id from public.student_profiles where user_id = auth.uid())) with check (student_id in (select id from public.student_profiles where user_id = auth.uid()));

-- Add teacher/admin policies through a security-definer role helper before production.
-- Store question images and MP4 files in private Supabase Storage buckets and persist paths above.
