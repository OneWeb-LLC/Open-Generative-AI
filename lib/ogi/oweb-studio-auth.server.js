import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireWorkspaceMember } from '@/lib/workspace/authz.server';
import { readRequestedWorkspaceId } from '@/lib/workspace/session.server';

/**
 * @returns {Promise<
 *   | { ok: true; userId: string; workspaceId: string; accessToken: string }
 *   | { ok: false; response: Response }
 * >}
 */
export async function requireOwebStudioSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    };
  }

  const workspaceId = await readRequestedWorkspaceId();
  if (!workspaceId) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'workspace_required' }, { status: 400 }),
    };
  }

  try {
    await requireWorkspaceMember(supabase, workspaceId, user.id);
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: 'workspace_forbidden' }, { status: 403 }),
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'session_required' }, { status: 401 }),
    };
  }

  return {
    ok: true,
    userId: user.id,
    workspaceId,
    accessToken,
  };
}
