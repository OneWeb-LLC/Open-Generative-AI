'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { owebWorkspaceTeamUrl } from '@/lib/ogi/constants';
import { activateWorkspace, fetchWorkspaceCatalog } from '@/lib/ogi/workspace-catalog-client';
import TeamPanel from '@/components/TeamPanel';
import WorkspaceActivityPanel from '@/components/WorkspaceActivityPanel';

/**
 * OWeb-style team workspace hub: membership catalog + per-workspace OGI activation.
 * @param {{
 *   locale?: string;
 *   userId: string | null;
 *   oneId?: string | null;
 *   initialCatalog?: Array<Record<string, unknown>>;
 *   activeWorkspaceId?: string | null;
 *   teamPath: string;
 *   studioPath: string;
 *   copy?: Record<string, unknown>;
 * }} props
 */
export default function TeamWorkspaceHub({
  locale = 'en',
  userId,
  oneId = null,
  initialCatalog = [],
  activeWorkspaceId = null,
  teamPath,
  studioPath,
  copy = {},
}) {
  const hubCopy = copy.teamPage ?? {};
  const router = useRouter();
  const [catalog, setCatalog] = useState(initialCatalog);
  const [filter, setFilter] = useState('team');
  const [selectedId, setSelectedId] = useState(activeWorkspaceId);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return catalog;
    if (filter === 'personal') return catalog.filter((ws) => !ws.is_team);
    return catalog.filter((ws) => ws.is_team);
  }, [catalog, filter]);

  const selected = useMemo(
    () => catalog.find((ws) => ws.id === selectedId) ?? null,
    [catalog, selectedId],
  );

  const refreshCatalog = useCallback(async () => {
    const body = await fetchWorkspaceCatalog();
    setCatalog(body.workspaces ?? []);
    return body;
  }, []);

  const handleActivate = async (workspaceId) => {
    setBusyId(workspaceId);
    setError(null);
    try {
      await activateWorkspace(workspaceId);
      setSelectedId(workspaceId);
      await refreshCatalog();
      router.refresh();
      window.location.href = studioPath;
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setBusyId(null);
    }
  };

  const handleSwitch = async (workspaceId) => {
    setBusyId(workspaceId);
    setError(null);
    try {
      const res = await fetch('/api/workspace/switch', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.error === 'workspace_not_activated') {
          await handleActivate(workspaceId);
          return;
        }
        throw new Error(body.error || 'switch_failed');
      }
      await refreshCatalog();
      router.refresh();
      window.location.href = studioPath;
    } catch (err) {
      setError(String(err?.message ?? err));
    } finally {
      setBusyId(null);
    }
  };

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-white/60">
        {hubCopy.signInRequired || 'Sign in with your OneID to manage team workspaces.'}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#030303] text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#22d3ee] mb-2">
            {hubCopy.eyebrow || 'OneID · Workspace scope'}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            {hubCopy.title || 'Team workspaces'}
          </h1>
          <p className="mt-3 text-sm text-white/45 max-w-2xl leading-relaxed">
            {hubCopy.subtitle ||
              'Workspaces your OneID is associated with appear here. Activate Open Generative AI on a workspace to enable the studio switcher, shared library, and team billing for that tenant.'}
          </p>
          {oneId && (
            <p className="mt-3 text-sm font-mono text-[#d9ff00]/90">{oneId}</p>
          )}
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'team', label: hubCopy.filterTeam || 'Team' },
            { id: 'personal', label: hubCopy.filterPersonal || 'Personal' },
            { id: 'all', label: hubCopy.filterAll || 'All' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                filter === f.id ? 'bg-[#d9ff00] text-black' : 'bg-white/5 text-white/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <ul className="space-y-3 mb-12">
          {filtered.map((ws) => {
            const isBusy = busyId === ws.id;
            const status = ws.is_active
              ? hubCopy.statusActive || 'Active now'
              : ws.activated_for_app
                ? hubCopy.statusActivated || 'Activated'
                : hubCopy.statusAvailable || 'Not activated';

            return (
              <li
                key={ws.id}
                className={`rounded-xl border p-4 transition ${
                  selectedId === ws.id
                    ? 'border-[#22d3ee]/40 bg-[#22d3ee]/5'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <button
                    type="button"
                    className="text-left min-w-0"
                    onClick={() => setSelectedId(ws.id)}
                  >
                    <p className="font-semibold text-white truncate">
                      {ws.name}
                      {ws.kind === 'personal' ? ' (personal)' : ''}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1">
                      {status}
                      {ws.role ? ` · ${ws.role}` : ''}
                      {ws.slug ? ` · ${ws.slug}` : ''}
                    </p>
                  </button>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    {!ws.activated_for_app && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleActivate(ws.id)}
                        className="rounded-md bg-[#d9ff00] text-black text-xs font-bold px-3 py-2 disabled:opacity-40"
                      >
                        {isBusy
                          ? hubCopy.activating || 'Activating…'
                          : hubCopy.activateCta || 'Activate here'}
                      </button>
                    )}
                    {ws.activated_for_app && !ws.is_active && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleSwitch(ws.id)}
                        className="rounded-md bg-white/10 text-white text-xs font-bold px-3 py-2 disabled:opacity-40"
                      >
                        {hubCopy.switchCta || 'Switch here'}
                      </button>
                    )}
                    {ws.is_team && (
                      <a
                        href={owebWorkspaceTeamUrl(ws.slug)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/15 text-white/70 text-xs font-bold px-3 py-2 hover:bg-white/5"
                      >
                        {hubCopy.manageOweb || 'One OS'}
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {!filtered.length && (
            <li className="text-sm text-white/40 py-8 text-center">
              {hubCopy.empty || 'No workspaces in this filter.'}
            </li>
          )}
        </ul>

        {selected && selected.activated_for_app && (
          <section className="border-t border-white/10 pt-10 grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold mb-4">
                {hubCopy.membersTitle || 'Members'} · {selected.name}
              </h2>
              <TeamPanel
                workspaceId={selected.id}
                userId={userId}
                workspaces={catalog.map((ws) => ({
                  id: ws.id,
                  name: ws.name,
                  slug: ws.slug,
                  kind: ws.kind,
                }))}
                copy={copy}
                currentUserOneId={oneId}
                onTeamWorkspaceCreated={() => void refreshCatalog()}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4">
                {hubCopy.activityTitle || 'Recent activity'}
              </h2>
              <WorkspaceActivityPanel
                workspaceId={selected.id}
                userId={userId}
                copy={copy}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
