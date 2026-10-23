import { getOwebPlatformApiUrl, owebWorkspaceTeamUrl } from '@/lib/ogi/constants';

/**
 * Invite a teammate via OWeb control-plane (preferred) or One OS RPC fallback.
 * Invitees must accept with their OneID — no shadow accounts on the satellite.
 */
export async function inviteWorkspaceMember(supabase, accessToken, workspaceId, { email, role }) {
  const normalizedEmail = email.trim().toLowerCase();
  const inviteRole = role === 'admin' ? 'admin' : 'member';

  if (accessToken) {
    const paths = [
      `/workspaces/${workspaceId}/invites`,
      `/ecosystem/workspaces/${workspaceId}/invite`,
    ];
    for (const path of paths) {
      try {
        const res = await fetch(`${getOwebPlatformApiUrl()}${path}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: normalizedEmail, role: inviteRole }),
        });
        if (res.ok) {
          const payload = await res.json().catch(() => ({}));
          return { ok: true, via: 'oweb_api', ...payload };
        }
        if (res.status !== 404) {
          const payload = await res.json().catch(() => ({}));
          return {
            ok: false,
            error: payload.error || payload.message || `invite_failed_${res.status}`,
          };
        }
      } catch (err) {
        console.warn('[ogi] OWeb invite HTTP error', err?.message ?? err);
      }
    }
  }

  const rpcNames = ['ao_invite_org_member', 'ao_org_invite_member'];
  for (const rpc of rpcNames) {
    const { error } = await supabase.rpc(rpc, {
      p_org_id: workspaceId,
      p_email: normalizedEmail,
      p_role: inviteRole,
    });
    if (!error) return { ok: true, via: rpc };
    if (!error.message?.includes('does not exist')) {
      return { ok: false, error: error.message };
    }
  }

  return {
    ok: false,
    error: 'invite_unavailable',
    manageUrl: owebWorkspaceTeamUrl(),
  };
}

/**
 * Create a shared team workspace on One OS (RPC when available).
 * Personal workspaces remain per-user; team workspaces are shared tenants.
 */
export async function createTeamWorkspace(supabase, userId, { name, slug }) {
  const rpcNames = ['ao_create_team_workspace', 'ao_create_org'];
  for (const rpc of rpcNames) {
    const { data, error } = await supabase.rpc(rpc, {
      p_user_id: userId,
      p_name: name,
      p_slug: slug,
      p_kind: 'team',
    });
    if (!error && data) {
      const workspaceId = typeof data === 'string' ? data : data?.id ?? data?.org_id;
      if (workspaceId) return { ok: true, workspaceId, via: rpc };
    }
    if (error && !error.message?.includes('does not exist')) {
      return { ok: false, error: error.message };
    }
  }

  return {
    ok: false,
    error: 'create_team_unavailable',
    manageUrl: owebWorkspaceTeamUrl(),
  };
}
