import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { activateOpenHiggsfieldWorkspace } from '@/lib/ogi/activation';
import { requireWorkspaceMember, WorkspaceAuthorizationError } from '@/lib/workspace/authz.server';
import { buildWorkspaceCatalog } from '@/lib/workspace/workspace-catalog.server';
import { establishProductSession } from '@/lib/workspace/session.server';
import { isWorkspaceActivated } from '@/lib/workspace/workspace-activations.server';

/** Activate Open Generative AI for a workspace this OneID already belongs to (OWeb D15). */
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
  } catch (err) {
    if (err instanceof WorkspaceAuthorizationError) {
      return NextResponse.json({ error: 'workspace_forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'workspace_forbidden' }, { status: 403 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const already = await isWorkspaceActivated(supabase, user.id, workspaceId);
  const activationKind = already ? 'workspace_switch' : 'team_page_activate';

  if (!already) {
    await activateOpenHiggsfieldWorkspace(
      supabase,
      user.id,
      workspaceId,
      session?.access_token ?? null,
      'team_page_activate',
    );
  }

  const ctx = await establishProductSession(supabase, user, {
    accessToken: session?.access_token ?? null,
    requestedWorkspaceId: workspaceId,
    forceWorkspaceId: workspaceId,
    activationKind,
    persistCookie: true,
  });

  if (!ctx.workspaceId || ctx.workspaceId !== workspaceId) {
    return NextResponse.json({ error: 'workspace_activate_failed' }, { status: 409 });
  }

  const catalog = await buildWorkspaceCatalog(supabase, user.id, ctx.workspaceId);
  const workspace = catalog.workspaces.find((ws) => ws.id === workspaceId) ?? null;

  return NextResponse.json({
    ok: true,
    workspace_id: ctx.workspaceId,
    workspace,
    activated_workspace_ids: catalog.activated_workspace_ids,
  });
}
