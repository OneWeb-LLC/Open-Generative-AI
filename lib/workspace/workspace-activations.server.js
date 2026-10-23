import { WORKSPACE_ACTIVATED_KINDS } from './resolve-activated-workspace.js';

/** @typedef {{ workspace_id: string; activation_kind: string | null; first_seen_at: string | null; last_seen_at: string | null }} WorkspaceActivationRow */

/** Rows from `one_id_workspace_activations` for the signed-in user. */
export async function fetchWorkspaceActivations(supabase, userId) {
  const uid = String(userId);
  const { data, error } = await supabase
    .from('one_id_workspace_activations')
    .select('workspace_id, activation_kind, first_seen_at, last_seen_at')
    .eq('user_id', uid)
    .in('activation_kind', WORKSPACE_ACTIVATED_KINDS);

  if (error) {
    console.warn('[ogi] workspace activations lookup failed', error.message);
    return [];
  }

  return data ?? [];
}

export function activatedWorkspaceIdSet(activationRows) {
  return new Set((activationRows ?? []).map((row) => row.workspace_id));
}

export async function isWorkspaceActivated(supabase, userId, workspaceId) {
  const uid = String(userId);
  const { data, error } = await supabase
    .from('one_id_workspace_activations')
    .select('workspace_id')
    .eq('user_id', uid)
    .eq('workspace_id', workspaceId)
    .in('activation_kind', WORKSPACE_ACTIVATED_KINDS)
    .maybeSingle();

  if (error) {
    console.warn('[ogi] workspace activation check failed', error.message);
    return false;
  }

  return Boolean(data?.workspace_id);
}
