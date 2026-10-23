import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generationRowToHistoryEntry, normalizeGenerationInsert } from '@/lib/ogi/generation-records';
import {
  insertWorkspaceGeneration,
  listWorkspaceGenerations,
} from '@/lib/workspace/generations.server';
import { requireWorkspaceMember } from '@/lib/workspace/authz.server';
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

  const { searchParams } = new URL(request.url);
  const studioType = searchParams.get('studio_type');
  const limit = Number(searchParams.get('limit') || '50');

  try {
    const items = await listWorkspaceGenerations(supabase, workspaceId, user.id, {
      studioType: studioType || null,
      limit,
    });
    return NextResponse.json({
      ok: true,
      workspace_id: workspaceId,
      generations: items,
      history: items.map((item) => item.historyEntry),
    });
  } catch (err) {
    const message = err?.message ?? 'generations_list_failed';
    const status = message.includes('workspace.view') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

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

  const normalized = normalizeGenerationInsert(body, { workspaceId, userId: user.id });
  if (normalized.error) {
    return NextResponse.json({ error: normalized.error }, { status: 400 });
  }

  try {
    await requireWorkspaceMember(supabase, workspaceId, user.id);
    const row = await insertWorkspaceGeneration(supabase, normalized.row);
    const historyEntry = generationRowToHistoryEntry(row, {
      userId: user.id,
      oneId: null,
      displayName: null,
    });
    return NextResponse.json({ ok: true, generation: row, historyEntry });
  } catch (err) {
    const message = err?.message ?? 'generations_insert_failed';
    const status = message.includes('workspace') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
