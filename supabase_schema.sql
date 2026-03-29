-- ============================================================
-- WorkoutNow — Complete Database Schema
-- 
-- Use this to set up a FRESH Supabase project from scratch.
-- Run this entire file in the Supabase SQL Editor.
--
-- Order of execution:
--   1. Extensions
--   2. Enums
--   3. Tables (in dependency order)
--   4. Indexes
--   5. Triggers
--   6. Row Level Security
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. EXTENSIONS
-- ────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()


-- ────────────────────────────────────────────────────────────
-- 2. ENUMS
-- ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "Difficulty" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "FitnessGoal" AS ENUM (
    'LOSE_WEIGHT',
    'BUILD_MUSCLE',
    'STAY_FIT',
    'GET_FIT',
    'INCREASE_STRENGTH',
    'IMPROVE_ENDURANCE'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ────────────────────────────────────────────────────────────
-- 3. TABLES
-- ────────────────────────────────────────────────────────────

-- ── 3.1 users ──────────────────────────────────────────────
-- id = Supabase Auth UID (string, not UUID)
CREATE TABLE IF NOT EXISTS users (
  id              TEXT          PRIMARY KEY,          -- Supabase Auth user ID
  email           TEXT          NOT NULL UNIQUE,
  display_name    TEXT,
  avatar_url      TEXT,
  weight_kg       FLOAT,
  height_cm       FLOAT,
  fitness_goal    "FitnessGoal",

  -- Gamification
  current_streak  INT           NOT NULL DEFAULT 0,
  longest_streak  INT           NOT NULL DEFAULT 0,
  last_workout_at TIMESTAMPTZ,

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── 3.2 workout_sessions ───────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_sessions (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercises_count  INT           NOT NULL DEFAULT 0,
  exercise_names   TEXT[]        NOT NULL DEFAULT '{}',  -- kept for backward compat
  duration_minutes INT           NOT NULL DEFAULT 0,
  notes            TEXT,
  completed_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── 3.3 session_exercises ──────────────────────────────────
-- Each row = one exercise inside a completed workout session.
-- Replaces the flat exercise_names[] with structured data.
CREATE TABLE IF NOT EXISTS session_exercises (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id    TEXT        NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id   TEXT        NOT NULL,    -- ExerciseDB string ID
  exercise_name TEXT        NOT NULL,
  sets          INT,
  reps          TEXT,                    -- e.g. "10-12" or "AMRAP"
  rest_seconds  INT,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.4 favorite_exercises ─────────────────────────────────
-- Stores ExerciseDB exercises the user has bookmarked.
-- exerciseId is the ExerciseDB string ID (not a local FK).
CREATE TABLE IF NOT EXISTS favorite_exercises (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id   TEXT        NOT NULL,    -- ExerciseDB string ID
  exercise_name TEXT        NOT NULL,
  image_url     TEXT,
  body_part     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (user_id, exercise_id)
);

-- ── 3.5 equipment ──────────────────────────────────────────
-- Reference / seed data — not user-owned
CREATE TABLE IF NOT EXISTS equipment (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL UNIQUE,
  icon_url   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.6 muscles ────────────────────────────────────────────
-- Reference / seed data — not user-owned
CREATE TABLE IF NOT EXISTS muscles (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL UNIQUE,
  "group"    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.7 exercises ──────────────────────────────────────────
-- Reference / seed data — not user-owned
CREATE TABLE IF NOT EXISTS exercises (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT          NOT NULL,
  instructions TEXT,
  video_url    TEXT,
  image_url    TEXT,
  difficulty   "Difficulty"  NOT NULL DEFAULT 'BEGINNER',
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── 3.8 exercise_equipment (join) ──────────────────────────
CREATE TABLE IF NOT EXISTS exercise_equipment (
  exercise_id  UUID NOT NULL REFERENCES exercises(id)  ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id)  ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, equipment_id)
);

-- ── 3.9 exercise_primary_muscles (join) ────────────────────
CREATE TABLE IF NOT EXISTS exercise_primary_muscles (
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_id   UUID NOT NULL REFERENCES muscles(id)   ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_id)
);

-- ── 3.10 exercise_secondary_muscles (join) ─────────────────
CREATE TABLE IF NOT EXISTS exercise_secondary_muscles (
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_id   UUID NOT NULL REFERENCES muscles(id)   ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, muscle_id)
);


-- ────────────────────────────────────────────────────────────
-- 4. INDEXES
-- ────────────────────────────────────────────────────────────

-- workout_sessions: primary query is by user + date
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date
  ON workout_sessions(user_id, completed_at DESC);

-- session_exercises: always fetched by session
CREATE INDEX IF NOT EXISTS idx_session_exercises_session
  ON session_exercises(session_id);

-- favorite_exercises: user list sorted by date
CREATE INDEX IF NOT EXISTS idx_favorite_exercises_user
  ON favorite_exercises(user_id);

CREATE INDEX IF NOT EXISTS idx_favorite_exercises_user_date
  ON favorite_exercises(user_id, created_at DESC);

-- exercises: commonly searched by name
CREATE INDEX IF NOT EXISTS idx_exercises_name
  ON exercises(name);


-- ────────────────────────────────────────────────────────────
-- 5. TRIGGERS — auto-update updated_at columns
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- favorite_exercises
DROP TRIGGER IF EXISTS favorite_exercises_updated_at ON favorite_exercises;
CREATE TRIGGER favorite_exercises_updated_at
  BEFORE UPDATE ON favorite_exercises
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- equipment
DROP TRIGGER IF EXISTS equipment_updated_at ON equipment;
CREATE TRIGGER equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- muscles
DROP TRIGGER IF EXISTS muscles_updated_at ON muscles;
CREATE TRIGGER muscles_updated_at
  BEFORE UPDATE ON muscles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- exercises
DROP TRIGGER IF EXISTS exercises_updated_at ON exercises;
CREATE TRIGGER exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 6. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

-- Enable RLS on user-data tables
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises   ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_exercises  ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reference tables (read-only for authenticated users)
ALTER TABLE equipment                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscles                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_equipment          ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_primary_muscles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_secondary_muscles  ENABLE ROW LEVEL SECURITY;

-- ── users ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "users: select own row" ON users;
DROP POLICY IF EXISTS "users: update own row" ON users;

CREATE POLICY "users: select own row"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "users: update own row"
  ON users FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- ── workout_sessions ───────────────────────────────────────
DROP POLICY IF EXISTS "sessions: select own" ON workout_sessions;
DROP POLICY IF EXISTS "sessions: insert own" ON workout_sessions;
DROP POLICY IF EXISTS "sessions: delete own" ON workout_sessions;

CREATE POLICY "sessions: select own"
  ON workout_sessions FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "sessions: insert own"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "sessions: delete own"
  ON workout_sessions FOR DELETE
  USING (auth.uid()::text = user_id);

-- ── session_exercises ──────────────────────────────────────
DROP POLICY IF EXISTS "session_exercises: select via session" ON session_exercises;
DROP POLICY IF EXISTS "session_exercises: insert via session" ON session_exercises;
DROP POLICY IF EXISTS "session_exercises: delete via session" ON session_exercises;

CREATE POLICY "session_exercises: select via session"
  ON session_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id = auth.uid()::text
    )
  );

CREATE POLICY "session_exercises: insert via session"
  ON session_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id = auth.uid()::text
    )
  );

CREATE POLICY "session_exercises: delete via session"
  ON session_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id = auth.uid()::text
    )
  );

-- ── favorite_exercises ─────────────────────────────────────
DROP POLICY IF EXISTS "favorites: select own" ON favorite_exercises;
DROP POLICY IF EXISTS "favorites: insert own" ON favorite_exercises;
DROP POLICY IF EXISTS "favorites: delete own" ON favorite_exercises;

CREATE POLICY "favorites: select own"
  ON favorite_exercises FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "favorites: insert own"
  ON favorite_exercises FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "favorites: delete own"
  ON favorite_exercises FOR DELETE
  USING (auth.uid()::text = user_id);

-- ── reference tables (authenticated read-only) ─────────────
DROP POLICY IF EXISTS "equipment: auth read"                ON equipment;
DROP POLICY IF EXISTS "muscles: auth read"                  ON muscles;
DROP POLICY IF EXISTS "exercises: auth read"                ON exercises;
DROP POLICY IF EXISTS "exercise_equipment: auth read"       ON exercise_equipment;
DROP POLICY IF EXISTS "exercise_primary: auth read"         ON exercise_primary_muscles;
DROP POLICY IF EXISTS "exercise_secondary: auth read"       ON exercise_secondary_muscles;

CREATE POLICY "equipment: auth read"
  ON equipment FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "muscles: auth read"
  ON muscles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercises: auth read"
  ON exercises FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_equipment: auth read"
  ON exercise_equipment FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_primary: auth read"
  ON exercise_primary_muscles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercise_secondary: auth read"
  ON exercise_secondary_muscles FOR SELECT USING (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 7. VERIFICATION
-- ────────────────────────────────────────────────────────────

-- List all tables with row count and RLS status
SELECT
  pt.tablename,
  pt.rowsecurity AS rls_enabled,
  (SELECT COUNT(*) FROM information_schema.columns c
   WHERE c.table_name = pt.tablename
     AND c.table_schema = 'public') AS column_count
FROM pg_tables pt
WHERE pt.schemaname = 'public'
  AND pt.tablename IN (
    'users', 'workout_sessions', 'session_exercises',
    'favorite_exercises', 'equipment', 'muscles', 'exercises',
    'exercise_equipment', 'exercise_primary_muscles', 'exercise_secondary_muscles'
  )
ORDER BY pt.tablename;
