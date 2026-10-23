import { formatOneId } from '@/lib/oneid';
import { requireWorkspaceMember } from '@/lib/workspace/authz.server';

/** @typedef {{ userId: string; role: string; joinedAt: string | null; oneId: string | null; displayName: string | null; avatarUrl: string | null }} WorkspaceMemberSummary */

/** List active workspace members with OneID profile projection (RLS: peers + self). */
export async function listWorkspaceMembers(supabase, workspaceId, callerUserId) {
  await requireWorkspaceMember(supabase, workspaceId, callerUserId);

  const { data: memberships, error: memberErr } = await supabase
    .from('ao_org_members')
    .select('user_id, role, joined_at')
    .eq('org_id', workspaceId)
    .is('left_at', null)
    .order('joined_at', { ascending: true });

  if (memberErr) throw new Error(memberErr.message);

  const memberRows = memberships ?? [];
  const userIds = memberRows.map((m) => m.user_id).filter(Boolean);

  let profiles = [];
  if (userIds.length) {
    const { data: profileRows, error: profileErr } = await supabase
      .from('ogi_profiles')
      .select('id, one_id, display_name, avatar_url')
      .in('id', userIds);

    if (profileErr) {
      console.warn('[ogi] workspace member profiles failed', profileErr.message);
    } else {
      profiles = profileRows ?? [];
    }
  }

  const profileById = new Map(profiles.map((p) => [p.id, p]));

  /** @type {WorkspaceMemberSummary[]} */
  const members = memberRows.map((m) => {
    const profile = profileById.get(m.user_id);
    const rawOneId = profile?.one_id ?? null;
    return {
      userId: m.user_id,
      role: m.role,
      joinedAt: m.joined_at ?? null,
      oneId: formatOneId(rawOneId) || rawOneId,
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    };
  });

  return members;
}
