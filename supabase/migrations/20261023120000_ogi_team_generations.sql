-- Open Generative AI — workspace team visibility + durable generation records.
-- RLS: inline ao_org_members checks (no SECURITY DEFINER helpers).

-- Allow workspace peers to read each other's ogi_profiles (OneID + display name for team UI).
DROP POLICY IF EXISTS ogi_profiles_workspace_peers ON public.ogi_profiles;
CREATE POLICY ogi_profiles_workspace_peers ON public.ogi_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ao_org_members AS mine
      INNER JOIN public.ao_org_members AS theirs
        ON mine.org_id = theirs.org_id
      WHERE mine.org_id IS NOT NULL
        AND mine.user_id = (SELECT auth.uid()::text)
        AND theirs.user_id = (ogi_profiles.id::text)
        AND mine.left_at IS NULL
        AND theirs.left_at IS NULL
    )
  );

CREATE TABLE IF NOT EXISTS public.ogi_workspace_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  studio_type TEXT NOT NULL,
  external_id TEXT,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt TEXT,
  model TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ogi_workspace_generations_workspace_created_idx
  ON public.ogi_workspace_generations (workspace_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ogi_workspace_generations_user_idx
  ON public.ogi_workspace_generations (user_id, created_at DESC);

ALTER TABLE public.ogi_workspace_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogi_workspace_generations FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.ogi_workspace_generations FROM PUBLIC;
REVOKE ALL ON TABLE public.ogi_workspace_generations FROM anon;
REVOKE ALL ON TABLE public.ogi_workspace_generations FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ogi_workspace_generations TO authenticated;
GRANT ALL ON TABLE public.ogi_workspace_generations TO service_role;

DROP POLICY IF EXISTS ogi_workspace_generations_member_select ON public.ogi_workspace_generations;
CREATE POLICY ogi_workspace_generations_member_select ON public.ogi_workspace_generations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_generations.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  );

DROP POLICY IF EXISTS ogi_workspace_generations_member_insert ON public.ogi_workspace_generations;
CREATE POLICY ogi_workspace_generations_member_insert ON public.ogi_workspace_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_generations.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  );

DROP POLICY IF EXISTS ogi_workspace_generations_owner_mutate ON public.ogi_workspace_generations;
CREATE POLICY ogi_workspace_generations_owner_mutate ON public.ogi_workspace_generations
  FOR UPDATE
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_generations.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_generations.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  );

DROP POLICY IF EXISTS ogi_workspace_generations_owner_delete ON public.ogi_workspace_generations;
CREATE POLICY ogi_workspace_generations_owner_delete ON public.ogi_workspace_generations
  FOR DELETE
  TO authenticated
  USING (
    (
      user_id = (SELECT auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.ao_org_members AS m
        WHERE m.org_id = ogi_workspace_generations.workspace_id
          AND m.user_id = (SELECT auth.uid()::text)
          AND m.left_at IS NULL
          AND m.role IN ('owner', 'admin')
      )
    )
    AND EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_generations.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  );
