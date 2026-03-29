-- ============================================================
-- WorkoutNow — Row Level Security (RLS) Policies
-- Add this AFTER supabase_patches.sql
-- 
-- CRITICAL: Without these, any logged-in user can read or
-- delete any other user's data via the API.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. ENABLE RLS ON ALL USER-DATA TABLES
-- ────────────────────────────────────────────────────────────

ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_exercises  ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises   ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────────────────────────
-- 2. USERS TABLE
--    Users can only read and update their own row.
--    Insert is done by the backend (service role), not the client.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "users: select own row"  ON users;
DROP POLICY IF EXISTS "users: update own row"  ON users;

CREATE POLICY "users: select own row"
  ON users FOR SELECT
  USING (auth.uid()::text = id);

CREATE POLICY "users: update own row"
  ON users FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);


-- ────────────────────────────────────────────────────────────
-- 3. WORKOUT_SESSIONS TABLE
--    Users can only see and delete their own sessions.
--    Insert is done through the complete-workout API route.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "sessions: select own"  ON workout_sessions;
DROP POLICY IF EXISTS "sessions: insert own"  ON workout_sessions;
DROP POLICY IF EXISTS "sessions: delete own"  ON workout_sessions;

CREATE POLICY "sessions: select own"
  ON workout_sessions FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "sessions: insert own"
  ON workout_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "sessions: delete own"
  ON workout_sessions FOR DELETE
  USING (auth.uid()::text = user_id);


-- ────────────────────────────────────────────────────────────
-- 4. FAVORITE_EXERCISES TABLE
--    Users can only manage their own favorites.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "favorites: select own"  ON favorite_exercises;
DROP POLICY IF EXISTS "favorites: insert own"  ON favorite_exercises;
DROP POLICY IF EXISTS "favorites: delete own"  ON favorite_exercises;

CREATE POLICY "favorites: select own"
  ON favorite_exercises FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "favorites: insert own"
  ON favorite_exercises FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "favorites: delete own"
  ON favorite_exercises FOR DELETE
  USING (auth.uid()::text = user_id);


-- ────────────────────────────────────────────────────────────
-- 5. SESSION_EXERCISES TABLE
--    Access is via the parent session — if you own the session
--    you can read/write/delete its exercises.
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "session_exercises: select via session"  ON session_exercises;
DROP POLICY IF EXISTS "session_exercises: insert via session"  ON session_exercises;
DROP POLICY IF EXISTS "session_exercises: delete via session"  ON session_exercises;

CREATE POLICY "session_exercises: select via session"
  ON session_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "session_exercises: insert via session"
  ON session_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "session_exercises: delete via session"
  ON session_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions ws
      WHERE ws.id = session_exercises.session_id
        AND ws.user_id::text = auth.uid()::text
    )
  );


-- ────────────────────────────────────────────────────────────
-- 6. REFERENCE TABLES (read-only for all authenticated users)
--    muscles, equipment, exercises — these are seeded data,
--    anyone logged in can read them, nobody can write via client.
-- ────────────────────────────────────────────────────────────

ALTER TABLE muscles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment  ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "muscles: public read"   ON muscles;
DROP POLICY IF EXISTS "equipment: public read" ON equipment;
DROP POLICY IF EXISTS "exercises: public read" ON exercises;

CREATE POLICY "muscles: public read"
  ON muscles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "equipment: public read"
  ON equipment FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "exercises: public read"
  ON exercises FOR SELECT
  USING (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- 7. VERIFICATION — confirm RLS is enabled on all tables
-- ────────────────────────────────────────────────────────────

SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users',
    'workout_sessions',
    'favorite_exercises',
    'session_exercises',
    'muscles',
    'equipment',
    'exercises'
  )
ORDER BY tablename;
