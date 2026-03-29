-- ============================================================
-- WorkoutNow — Database Patches (v3 — correct column names)
--
-- Prisma uses camelCase column names in the DB (no @map on
-- fields), so we must use "userId", "createdAt", etc.
--
-- ⚠️  TWO STEPS — read before running:
--
--   STEP 1: Run ONLY the ALTER TYPE line alone (Supabase
--           wraps everything in a transaction and ALTER TYPE
--           ADD VALUE cannot run inside a transaction).
--
--   STEP 2: Run everything from STEP 2 to the end.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- STEP 1 — Run this line ALONE first, then click Run.
-- ════════════════════════════════════════════════════════════

ALTER TYPE "FitnessGoal" ADD VALUE IF NOT EXISTS 'GET_FIT';


-- ════════════════════════════════════════════════════════════
-- STEP 2 — After Step 1 succeeds, run everything below.
-- ════════════════════════════════════════════════════════════


-- ────────────────────────────────────────────────────────────
-- 2. ADD "updatedAt" TO favorite_exercises
--    (Prisma field name is updatedAt → column is "updatedAt")
-- ────────────────────────────────────────────────────────────

ALTER TABLE favorite_exercises
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Auto-update "updatedAt" on every row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS favorite_exercises_updated_at ON favorite_exercises;
CREATE TRIGGER favorite_exercises_updated_at
  BEFORE UPDATE ON favorite_exercises
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ────────────────────────────────────────────────────────────
-- 3. CREATE session_exercises TABLE
--    Uses camelCase to match Prisma convention.
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS session_exercises (
  id              TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionId"     TEXT        NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  "exerciseId"    TEXT        NOT NULL,   -- ExerciseDB string ID
  "exerciseName"  TEXT        NOT NULL,
  sets            INT,
  reps            TEXT,
  "restSeconds"   INT,
  "imageUrl"      TEXT,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id
  ON session_exercises("sessionId");


-- ────────────────────────────────────────────────────────────
-- 4. ADD COMPOSITE INDEX ON favorite_exercises
--    Uses actual Prisma column names: "userId", "createdAt"
-- ────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_favorite_exercises_user_created
  ON favorite_exercises("userId", "createdAt" DESC);


-- ────────────────────────────────────────────────────────────
-- 5. RLS POLICIES
--    Column references use actual DB names (camelCase).
-- ────────────────────────────────────────────────────────────

-- ── users ──────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions: select own" ON workout_sessions;
DROP POLICY IF EXISTS "sessions: insert own" ON workout_sessions;
DROP POLICY IF EXISTS "sessions: delete own" ON workout_sessions;

CREATE POLICY "sessions: select own"
  ON workout_sessions FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "sessions: insert own"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "sessions: delete own"
  ON workout_sessions FOR DELETE
  USING (auth.uid()::text = "userId");

-- ── session_exercises ──────────────────────────────────────
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_exercises: select via session" ON session_exercises;
DROP POLICY IF EXISTS "session_exercises: insert via session" ON session_exercises;
DROP POLICY IF EXISTS "session_exercises: delete via session" ON session_exercises;

CREATE POLICY "session_exercises: select via session"
  ON session_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises."sessionId"
        AND ws."userId" = auth.uid()::text
    )
  );

CREATE POLICY "session_exercises: insert via session"
  ON session_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises."sessionId"
        AND ws."userId" = auth.uid()::text
    )
  );

CREATE POLICY "session_exercises: delete via session"
  ON session_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises."sessionId"
        AND ws."userId" = auth.uid()::text
    )
  );

-- ── favorite_exercises ─────────────────────────────────────
ALTER TABLE favorite_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites: select own" ON favorite_exercises;
DROP POLICY IF EXISTS "favorites: insert own" ON favorite_exercises;
DROP POLICY IF EXISTS "favorites: delete own" ON favorite_exercises;

CREATE POLICY "favorites: select own"
  ON favorite_exercises FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "favorites: insert own"
  ON favorite_exercises FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "favorites: delete own"
  ON favorite_exercises FOR DELETE
  USING (auth.uid()::text = "userId");

-- ── reference tables (authenticated read-only) ─────────────
ALTER TABLE muscles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment  ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "muscles: auth read"   ON muscles;
DROP POLICY IF EXISTS "equipment: auth read" ON equipment;
DROP POLICY IF EXISTS "exercises: auth read" ON exercises;

CREATE POLICY "muscles: auth read"
  ON muscles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "equipment: auth read"
  ON equipment FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "exercises: auth read"
  ON exercises FOR SELECT USING (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 6. VERIFICATION
-- ────────────────────────────────────────────────────────────

-- Confirm GET_FIT is in the enum
SELECT enumlabel
FROM pg_enum
JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
WHERE pg_type.typname = 'FitnessGoal'
ORDER BY enumsortorder;

-- Confirm session_exercises was created with correct columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'session_exercises'
ORDER BY ordinal_position;

-- Confirm RLS is enabled on all tables
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'workout_sessions', 'session_exercises',
    'favorite_exercises', 'muscles', 'equipment', 'exercises'
  )
ORDER BY tablename;
