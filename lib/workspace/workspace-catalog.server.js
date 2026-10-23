import { isPlatformWorkspace } from '@/lib/workspace/platform-workspace';
import {
  activatedWorkspaceIdSet,
  fetchWorkspaceActivations,
} from '@/lib/workspace/workspace-activations.server';
import { fetchMyWorkspaces } from '@/lib/workspace/workspace-queries';

async function fetchMembershipRoles(supabase, userId) {
  const { data, error } = await supabase
    .from('ao_org_members')
    .select('org_id, role')
    .eq('user_id', String(userId))
    .is('left_at', null);

  if (error) {
    console.warn('[ogi] membership roles failed', error.message);
    return new Map();
  }

  return new Map((data ?? []).map((row) => [row.org_id, row.role]));
}

/**
 * OWeb-style workspace catalog: OneID membership ∩ activation state for this satellite.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function buildWorkspaceCatalog(supabase, userId, activeWorkspaceId = null) {
  const workspaces = await fetchMyWorkspaces(supabase, userId);
  const activations = await fetchWorkspaceActivations(supabase, userId);
  const activatedIds = activatedWorkspaceIdSet(activations);
  const activationById = new Map(activations.map((row) => [row.workspace_id, row]));
  const roles = await fetchMembershipRoles(supabase, userId);

  const items = workspaces
    .filter((ws) => !isPlatformWorkspace(ws))
    .map((ws) => {
      const activation = activationById.get(ws.id);
      return {
        id: ws.id,
        name: ws.name,
        slug: ws.slug,
        kind: ws.kind ?? null,
        role: roles.get(ws.id) ?? null,
        activated_for_app: activatedIds.has(ws.id),
        activation_kind: activation?.activation_kind ?? null,
        activated_at: activation?.last_seen_at ?? activation?.first_seen_at ?? null,
        is_active: activeWorkspaceId === ws.id,
        is_team: ws.kind !== 'personal',
      };
    });

  const activatedWorkspaces = workspaces.filter((ws) => activatedIds.has(ws.id));

  return {
    workspaces: items,
    activated_workspace_ids: [...activatedIds],
    activated_workspaces: activatedWorkspaces,
    has_unactivated_team:
      items.some((ws) => ws.is_team && !ws.activated_for_app) &&
      items.some((ws) => ws.is_team),
  };
}
