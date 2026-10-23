import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireWorkspaceMember } from '@/lib/workspace/authz.server';
import { establishProductSession } from '@/lib/workspace/session.server';

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const workspaceId =
    typeof body.workspace_id === 'string' ? body.workspace_id.trim() : '';

  if (!workspaceId) {
    return NextResponse.json({ error: 'missing_workspace_id' }, { status: 400 });
  }

  try {
    await requireWorkspaceMember(supabase, workspaceId, user.id);
  } catch {
    return NextResponse.json({ error: 'workspace_forbidden' }, { status: 403 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const ctx = await establishProductSession(supabase, user, {
    accessToken: session?.access_token ?? null,
    requestedWorkspaceId: workspaceId,
    forceWorkspaceId: workspaceId,
    activationKind: 'workspace_switch',
    persistCookie: true,
  });

  if (!ctx.workspaceId || ctx.workspaceId !== workspaceId) {
    return NextResponse.json({ error: 'workspace_switch_failed' }, { status: 409 });
  }

  return NextResponse.json({ ok: true, workspace_id: ctx.workspaceId });
}
