import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteWorkspaceGeneration } from '@/lib/workspace/generations.server';
import { resolveRequestWorkspaceId } from '@/lib/workspace/request-workspace.server';

export async function DELETE(request, { params }) {
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

  const generationId = typeof params?.id === 'string' ? params.id : '';
  if (!generationId) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  }

  try {
    await deleteWorkspaceGeneration(supabase, workspaceId, generationId, user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err?.message ?? 'delete_failed' }, { status: 500 });
  }
}
