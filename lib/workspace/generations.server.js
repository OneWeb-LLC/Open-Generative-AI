import { generationRowToHistoryEntry } from '@/lib/ogi/generation-records';
import { formatOneId } from '@/lib/oneid';
import { requireWorkspaceMember } from '@/lib/workspace/authz.server';

export async function listWorkspaceGenerations(
  supabase,
  workspaceId,
  callerUserId,
  { studioType = null, limit = 50 } = {},
) {
  await requireWorkspaceMember(supabase, workspaceId, callerUserId);

  const capped = Math.min(Math.max(limit, 1), 100);

  let query = supabase
    .from('ogi_workspace_generations')
    .select(
      'id, workspace_id, user_id, studio_type, external_id, media_url, thumbnail_url, prompt, model, metadata, created_at',
    )
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(capped);

  if (studioType) {
    query = query.eq('studio_type', studioType);
  }

  const { data: rows, error } = await query;
  if (error) throw new Error(error.message);

  const userIds = [...new Set((rows ?? []).map((r) => r.user_id))];
  let profiles = [];
  if (userIds.length) {
    const { data: profileRows } = await supabase
      .from('ogi_profiles')
      .select('id, one_id, display_name')
      .in('id', userIds);
    profiles = profileRows ?? [];
  }

  const profileById = new Map(profiles.map((p) => [p.id, p]));

  return (rows ?? [])
    .map((row) => {
      const profile = profileById.get(row.user_id);
      const creator = profile
        ? {
            userId: row.user_id,
            oneId: formatOneId(profile.one_id) || profile.one_id,
            displayName: profile.display_name,
          }
        : { userId: row.user_id, oneId: null, displayName: null };
      return {
        ...row,
        historyEntry: generationRowToHistoryEntry(row, creator),
        creator,
      };
    })
    .filter((item) => item.historyEntry);
}

export async function insertWorkspaceGeneration(supabase, row) {
  const { data, error } = await supabase
    .from('ogi_workspace_generations')
    .insert(row)
    .select(
      'id, workspace_id, user_id, studio_type, external_id, media_url, thumbnail_url, prompt, model, metadata, created_at',
    )
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteWorkspaceGeneration(supabase, workspaceId, generationId, callerUserId) {
  await requireWorkspaceMember(supabase, workspaceId, callerUserId);

  const { error } = await supabase
    .from('ogi_workspace_generations')
    .delete()
    .eq('id', generationId)
    .eq('workspace_id', workspaceId);

  if (error) throw new Error(error.message);
}
