import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createTeamWorkspace } from '@/lib/workspace/team-api.server';
import { establishProductSession } from '@/lib/workspace/session.server';

/** Create a shared team workspace (OneID members only via OWeb). */
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const slug =
    typeof body.slug === 'string' && body.slug.trim()
      ? body.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
      : null;

  if (!name) {
    return NextResponse.json({ error: 'missing_name' }, { status: 400 });
  }

  const result = await createTeamWorkspace(supabase, user.id, { name, slug: slug || undefined });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.error === 'create_team_unavailable' ? 501 : 400 });
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  await establishProductSession(supabase, user, {
    accessToken: session?.access_token ?? null,
    requestedWorkspaceId: result.workspaceId,
    forceWorkspaceId: result.workspaceId,
    activationKind: 'team_workspace_create',
    persistCookie: true,
  });

  return NextResponse.json({ ok: true, workspace_id: result.workspaceId, via: result.via });
}
