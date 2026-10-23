/** Client helpers for workspace-scoped generation history (survives logout). */

function workspaceHeaders(workspaceId) {
  if (!workspaceId) return {};
  return { 'X-OGI-Workspace-Id': workspaceId };
}

export async function fetchWorkspaceGenerations({ workspaceId, studioType, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (studioType) params.set('studio_type', studioType);
  if (limit) params.set('limit', String(limit));

  const res = await fetch(`/api/workspace/generations?${params.toString()}`, {
    credentials: 'same-origin',
    headers: workspaceHeaders(workspaceId),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `generations_http_${res.status}`);
  }
  return body;
}

export async function persistWorkspaceGeneration(payload, workspaceId) {
  const res = await fetch('/api/workspace/generations', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...workspaceHeaders(workspaceId),
    },
    body: JSON.stringify({ ...payload, workspace_id: workspaceId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `generations_post_${res.status}`);
  }
  return body;
}

export async function deleteWorkspaceGenerationRecord(recordId, workspaceId) {
  const res = await fetch(`/api/workspace/generations/${encodeURIComponent(recordId)}`, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: workspaceHeaders(workspaceId),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `generations_delete_${res.status}`);
  }
  return body;
}

export async function fetchWorkspaceMembers(workspaceId) {
  const res = await fetch('/api/workspace/members', {
    credentials: 'same-origin',
    headers: workspaceHeaders(workspaceId),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `members_http_${res.status}`);
  }
  return body;
}

export async function inviteWorkspaceMemberByEmail(email, role = 'member', workspaceId) {
  const res = await fetch('/api/workspace/invite', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...workspaceHeaders(workspaceId),
    },
    body: JSON.stringify({ email, role, workspace_id: workspaceId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || body.manageUrl || `invite_http_${res.status}`);
  }
  return body;
}

export async function createTeamWorkspace({ name, slug }) {
  const res = await fetch('/api/workspace/team', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, slug }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || body.manageUrl || `team_create_http_${res.status}`);
  }
  return body;
}
