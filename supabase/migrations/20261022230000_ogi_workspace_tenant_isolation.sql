-- Open Generative AI satellite (app_id=open-generative-ai) — workspace-scoped preferences.
-- RLS: caller must be an active member of the workspace (inline ao_org_members check; no SECURITY DEFINER helpers).

CREATE TABLE IF NOT EXISTS public.ogi_workspace_preferences (
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  default_api_provider TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

ALTER TABLE public.ogi_workspace_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogi_workspace_preferences FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.ogi_workspace_preferences FROM PUBLIC;
REVOKE ALL ON TABLE public.ogi_workspace_preferences FROM anon;
REVOKE ALL ON TABLE public.ogi_workspace_preferences FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ogi_workspace_preferences TO authenticated;
GRANT ALL ON TABLE public.ogi_workspace_preferences TO service_role;

DROP POLICY IF EXISTS ogi_workspace_preferences_member ON public.ogi_workspace_preferences;
CREATE POLICY ogi_workspace_preferences_member ON public.ogi_workspace_preferences
  FOR ALL
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_preferences.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.ao_org_members AS m
      WHERE m.org_id = ogi_workspace_preferences.workspace_id
        AND m.user_id = (SELECT auth.uid()::text)
        AND m.left_at IS NULL
    )
  );
