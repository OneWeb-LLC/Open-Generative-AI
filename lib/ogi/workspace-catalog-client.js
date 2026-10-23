export async function fetchWorkspaceCatalog() {
  const res = await fetch('/api/workspace/catalog', { credentials: 'same-origin' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `catalog_http_${res.status}`);
  }
  return body;
}

export async function activateWorkspace(workspaceId) {
  const res = await fetch('/api/workspace/activate', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id: workspaceId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `activate_http_${res.status}`);
  }
  return body;
}
