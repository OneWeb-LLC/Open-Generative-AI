import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildWorkspaceCatalog } from '@/lib/workspace/workspace-catalog.server';
import { readRequestedWorkspaceId } from '@/lib/workspace/session.server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const activeWorkspaceId = await readRequestedWorkspaceId();
  const catalog = await buildWorkspaceCatalog(supabase, user.id, activeWorkspaceId);

  return NextResponse.json({
    ok: true,
    active_workspace_id: activeWorkspaceId,
    ...catalog,
  });
}
