'use client';

import { useState } from 'react';

/**
 * @param {{ workspaces: Array<{ id: string; name: string; slug?: string; kind?: string | null }>; activeWorkspaceId: string | null; onSwitched?: (workspaceId: string) => void }} props
 */
export default function WorkspaceSwitcher({
  workspaces = [],
  activeWorkspaceId,
  onSwitched,
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  if (!workspaces.length) return null;

  async function handleChange(nextId) {
    if (!nextId || nextId === activeWorkspaceId || pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch('/api/workspace/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: nextId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || 'Could not switch workspace');
        return;
      }
      sessionStorage.removeItem('ogi_workspace_cookie_sync');
      onSwitched?.(body.workspace_id ?? nextId);
      window.location.reload();
    } catch {
      setError('Network error while switching workspace');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-xs font-bold text-white/30 mb-2">Workspace</label>
      <select
        className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-sm text-white/90 px-3 disabled:opacity-50"
        value={activeWorkspaceId ?? ''}
        disabled={pending}
        onChange={(e) => void handleChange(e.target.value)}
      >
        {workspaces.map((ws) => (
          <option key={ws.id} value={ws.id} className="bg-[#111]">
            {ws.name}
            {ws.kind === 'personal' ? ' (personal)' : ''}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-[11px] text-red-400">{error}</p> : null}
      {pending ? (
        <p className="mt-2 text-[11px] text-white/40">Switching workspace…</p>
      ) : null}
    </div>
  );
}
