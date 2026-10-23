/**
 * Server-side workspace authorization using the caller's Supabase session (RLS).
 * UI hiding is not security — enforce on server routes.
 */

export class WorkspaceAuthorizationError extends Error {
  constructor(permission) {
    super(`Missing workspace permission: ${permission}`);
    this.name = 'WorkspaceAuthorizationError';
    this.permission = permission;
  }
}

export async function loadWorkspaceMembership(supabase, workspaceId, userId) {
  const { data: membership, error } = await supabase
    .from('ao_org_members')
    .select('role')
    .eq('org_id', workspaceId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!membership) {
    throw new WorkspaceAuthorizationError('workspace.view');
  }

  return { role: membership.role, isSuperAdmin: false };
}

/** Assert the user is an active member of the workspace (user-scoped client). */
export async function requireWorkspaceMember(supabase, workspaceId, userId) {
  return loadWorkspaceMembership(supabase, workspaceId, userId);
}

const WORKSPACE_ADMIN_ROLES = new Set(['owner', 'admin']);

/** Assert the user can manage workspace membership (owner/admin). */
export async function requireWorkspaceAdmin(supabase, workspaceId, userId) {
  const membership = await requireWorkspaceMember(supabase, workspaceId, userId);
  if (!WORKSPACE_ADMIN_ROLES.has(membership.role)) {
    throw new WorkspaceAuthorizationError('workspace.admin');
  }
  return membership;
}
