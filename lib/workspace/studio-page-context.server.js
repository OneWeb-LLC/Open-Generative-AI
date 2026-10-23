import { formatOneId, fetchOneIdHandle, oneIdFromUserMetadata } from '@/lib/oneid';
import { establishProductSession, readRequestedWorkspaceId } from '@/lib/workspace/session.server';
import { buildWorkspaceCatalog } from '@/lib/workspace/workspace-catalog.server';

/**
 * Shared authenticated studio / team page bootstrap (OneID + workspace activation).
 */
export async function loadStudioPageContext(supabase, user, options = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const ctx = await establishProductSession(supabase, user, {
    accessToken: session?.access_token ?? null,
    activationKind: options.activationKind ?? 'sign_in',
    persistCookie: options.persistCookie !== false,
  });

  const activeWorkspaceId =
    ctx.workspaceId ?? (await readRequestedWorkspaceId());

  const catalog = await buildWorkspaceCatalog(supabase, user.id, activeWorkspaceId);

  const handle =
    oneIdFromUserMetadata(user) ?? (await fetchOneIdHandle(supabase, user.id));

  return {
    workspaceId: activeWorkspaceId,
    workspaces: ctx.workspaces ?? [],
    activatedWorkspaces: catalog.activated_workspaces,
    workspaceCatalog: catalog.workspaces,
    hasUnactivatedTeam: catalog.has_unactivated_team,
    oneIdLabel: formatOneId(handle),
    session,
  };
}
