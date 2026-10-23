import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listWorkspaceMembers } from '@/lib/workspace/members.server';
import { resolveRequestWorkspaceId } from '@/lib/workspace/request-workspace.server';

export async function GET(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const workspaceId = await resolveRequestWorkspaceId(request);
  if (!workspaceId) {
    return NextResponse.json({ error: 'missing_workspace' }, { status: 400 });
  }

  try {
    const members = await listWorkspaceMembers(supabase, workspaceId, user.id);
    return NextResponse.json({ ok: true, workspace_id: workspaceId, members });
  } catch (err) {
    const message = err?.message ?? 'members_failed';
    const status = message.includes('workspace.view') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
