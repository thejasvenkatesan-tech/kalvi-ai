-- ─────────────────────────────────────────────
-- கல்வி.AI — Database Schema
-- Supabase / PostgreSQL
-- ─────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── SCHOOLS ───────────────────────────────
create table schools (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  district    text not null,
  state       text not null default 'Tamil Nadu',
  code        text unique not null,  -- 6-digit code teachers share with students
  csr_partner text,                  -- Name of funding CSR partner if any
  created_at  timestamptz default now()
);

-- ─── TEACHERS ──────────────────────────────
create table teachers (
  id          uuid primary key default uuid_generate_v4(),
  school_id   uuid references schools(id) on delete cascade,
  name        text not null,
  phone       text unique not null,
  class_name  text,                  -- e.g. "7A", "8B"
  created_at  timestamptz default now()
);

-- ─── STUDENTS ──────────────────────────────
create table students (
  id          uuid primary key default uuid_generate_v4(),
  school_id   uuid references schools(id) on delete cascade,
  name        text not null,
  class       text not null,         -- e.g. "7", "8"
  phone       text,                  -- optional, may use teacher's device
  roll_number text,                  -- school roll number, no personal data
  xp          integer default 0,
  streak      integer default 0,
  last_active date,
  created_at  timestamptz default now()
);

-- ─── MODULES ───────────────────────────────
create table modules (
  id          uuid primary key default uuid_generate_v4(),
  number      integer unique not null,  -- 1, 2, 3...
  title_ta    text not null,            -- Tamil title
  title_en    text not null,            -- English title
  description text,
  weeks       integer default 4,
  is_active   boolean default false,    -- only active modules shown
  created_at  timestamptz default now()
);

-- ─── MISSIONS ──────────────────────────────
create table missions (
  id          uuid primary key default uuid_generate_v4(),
  module_id   uuid references modules(id) on delete cascade,
  number      integer not null,         -- 1, 2, 3, 4 within module
  title_ta    text not null,
  title_en    text not null,
  description text,
  icon        text,                     -- emoji
  xp_reward   integer default 20,
  week        integer not null,         -- which week this unlocks
  vidhu_prompt text,                    -- pre-loaded prompt for this mission
  created_at  timestamptz default now()
);

-- ─── MISSION COMPLETIONS ───────────────────
create table mission_completions (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  mission_id  uuid references missions(id) on delete cascade,
  completed_at timestamptz default now(),
  offline     boolean default false,    -- was this completed offline?
  unique(student_id, mission_id)        -- one completion per student per mission
);

-- ─── BADGES ────────────────────────────────
create table badges (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,     -- e.g. "first_chat", "bronze", "streak_3"
  name_ta     text not null,
  name_en     text not null,
  icon        text not null,            -- emoji
  description text,
  level       text default 'bronze'     -- bronze / silver / gold
);

-- ─── STUDENT BADGES ────────────────────────
create table student_badges (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  badge_id    uuid references badges(id) on delete cascade,
  earned_at   timestamptz default now(),
  unique(student_id, badge_id)
);

-- ─── VIDHU CHAT SESSIONS ───────────────────
create table chat_sessions (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  mission_id  uuid references missions(id),  -- null if free chat
  messages    jsonb default '[]',            -- [{role, content, ts}]
  started_at  timestamptz default now(),
  ended_at    timestamptz
);

-- ─── CLASSROOM SESSIONS ────────────────────
create table classroom_sessions (
  id          uuid primary key default uuid_generate_v4(),
  teacher_id  uuid references teachers(id) on delete cascade,
  module_id   uuid references modules(id),
  week        integer,
  conducted_at date default current_date,
  attendance  integer default 0,        -- number of students present
  notes       text,
  created_at  timestamptz default now()
);

-- ─── LEADERBOARD (materialised weekly) ─────
create table leaderboard_weekly (
  id          uuid primary key default uuid_generate_v4(),
  school_id   uuid references schools(id) on delete cascade,
  week_start  date not null,
  points      integer default 0,
  badges_count integer default 0,
  rank        integer,
  district    text,
  unique(school_id, week_start)
);

-- ─── SEED: Module 1 ────────────────────────
insert into modules (number, title_ta, title_en, description, weeks, is_active)
values (1, 'AI என்றால் என்ன?', 'What is AI?', 
  'Understand what AI is, where it exists in daily life, and how to think critically about it.',
  4, true);

-- ─── SEED: Badges ──────────────────────────
insert into badges (slug, name_ta, name_en, icon, description, level) values
  ('first_chat',  'முதல் உரையாடல்', 'First Chat',    '💬', 'Had first conversation with Vidhu', 'bronze'),
  ('mission_1',   'AI அறிவாளி',     'AI Knower',     '🌟', 'Completed Mission 1',               'bronze'),
  ('streak_3',    '3 நாள் streak',   '3-Day Streak',  '🔥', 'Active 3 days in a row',            'bronze'),
  ('bronze_cert', 'AI அறிவாளி',     'Bronze Cert',   '🥉', 'Completed all Module 1 missions',   'bronze'),
  ('mission_2',   'AI தேடுனர்',     'AI Explorer',   '🔍', 'Completed Mission 2',               'bronze'),
  ('fact_checker','உண்மை காவலர்',   'Fact Checker',  '🧐', 'Completed Mission 3',               'silver'),
  ('ai_teacher',  'AI ஆசிரியர்',    'AI Teacher',    '👨‍👩‍👧','Completed Mission 4',               'silver');


-- ─────────────────────────────────────────────
-- SCHEMA UPDATE v2 — Student Auth + Topic Tracking
-- ─────────────────────────────────────────────

-- Drop old gamification tables (keep for reference, commented out)
-- DROP TABLE leaderboard_weekly;
-- DROP TABLE student_badges;
-- DROP TABLE badges;
-- DROP TABLE mission_completions;

-- ─── STUDENT AUTH (replaces phone OTP) ────────
alter table students add column if not exists roll_number text;
alter table students add column if not exists pin_hash text;
alter table students add column if not exists dob date;
alter table students add column if not exists pin_changed boolean default false;
alter table students add column if not exists questions_asked integer default 0;

-- Unique constraint per school
create unique index if not exists students_school_roll 
  on students(school_id, roll_number);

-- ─── SAVED REPLIES ─────────────────────────────
create table if not exists saved_replies (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  question    text not null,
  answer      text not null,
  subject     text,           -- AI-detected subject tag
  saved_at    timestamptz default now()
);

-- ─── TOPIC TRACKING ────────────────────────────
create table if not exists topic_searches (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  school_id   uuid references schools(id) on delete cascade,
  class       text,
  subject     text not null,  -- Tamil, Science, Maths, Social, AI, English, Other
  topic       text,           -- specific topic e.g. "Photosynthesis"
  question    text,
  searched_at timestamptz default now()
);

-- ─── STUDENT SESSIONS (auth) ───────────────────
create table if not exists student_sessions (
  id          uuid primary key default uuid_generate_v4(),
  student_id  uuid references students(id) on delete cascade,
  token       text unique not null,
  created_at  timestamptz default now(),
  expires_at  timestamptz default now() + interval '30 days'
);

-- ─── SEED: Update students table structure ─────
-- Teachers will register students via dashboard
-- PIN stored as bcrypt hash
