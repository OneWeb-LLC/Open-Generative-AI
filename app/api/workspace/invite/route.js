import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireWorkspaceAdmin, WorkspaceAuthorizationError } from '@/lib/workspace/authz.server';
import { inviteWorkspaceMember } from '@/lib/workspace/team-api.server';
import { resolveRequestWorkspaceId } from '@/lib/workspace/request-workspace.server';

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const workspaceId = await resolveRequestWorkspaceId(request, body);
  if (!workspaceId) {
    return NextResponse.json({ error: 'missing_workspace' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const role = typeof body.role === 'string' ? body.role.trim() : 'member';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  try {
    await requireWorkspaceAdmin(supabase, workspaceId, user.id);
  } catch (err) {
    if (err instanceof WorkspaceAuthorizationError) {
      return NextResponse.json({ error: 'workspace_admin_required' }, { status: 403 });
    }
    return NextResponse.json({ error: err?.message ?? 'forbidden' }, { status: 403 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const result = await inviteWorkspaceMember(supabase, session?.access_token ?? null, workspaceId, {
    email,
    role,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.error === 'invite_unavailable' ? 501 : 400 });
  }

  return NextResponse.json({ ok: true, ...result });
}
