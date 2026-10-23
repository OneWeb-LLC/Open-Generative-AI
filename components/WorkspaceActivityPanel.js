'use client';

import { useEffect, useState } from 'react';
import { fetchWorkspaceGenerations } from '@/lib/ogi/workspace-generations-client';

/**
 * Workspace-wide video activity for team leads.
 * @param {{ workspaceId: string | null; userId: string | null; copy: Record<string, unknown> }} props
 */
export default function WorkspaceActivityPanel({ workspaceId, userId, copy }) {
  const activityCopy = copy?.teamActivity ?? {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!workspaceId || !userId) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const body = await fetchWorkspaceGenerations({
          workspaceId,
          studioType: 'video',
          limit: 30,
        });
        if (!cancelled) {
          setItems(body.generations ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message ?? 'activity_failed');
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, userId]);

  if (!userId || !workspaceId) {
    return (
      <p className="text-sm text-white/50">
        {activityCopy.signInRequired || 'Sign in and pick a workspace to see team activity.'}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">
          {activityCopy.title || 'Team video activity'}
        </h3>
        <p className="text-xs text-white/40">
          {activityCopy.subtitle ||
            'Videos saved to this workspace stay here after logout — track what your team creates.'}
        </p>
      </div>

      {loading && <p className="text-xs text-white/40">{activityCopy.loading || 'Loading…'}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {items.map((item) => {
            const entry = item.historyEntry;
            const creator = item.creator;
            const label = creator?.oneId || creator?.displayName || creator?.userId?.slice(0, 8);
            return (
              <li
                key={item.id}
                className="flex gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-2"
              >
                {entry?.url ? (
                  <video
                    src={entry.url}
                    className="h-14 w-20 rounded object-cover bg-black shrink-0"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className="h-14 w-20 rounded bg-black/60 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-mono text-[#22d3ee] truncate">{label}</p>
                  <p className="text-xs text-white/80 line-clamp-2">{entry?.prompt || item.prompt || '—'}</p>
                  <p className="text-[10px] text-white/35 mt-1">
                    {item.model || entry?.model || 'video'}
                    {item.created_at
                      ? ` · ${new Date(item.created_at).toLocaleString()}`
                      : ''}
                  </p>
                </div>
              </li>
            );
          })}
          {!items.length && (
            <li className="text-xs text-white/40">
              {activityCopy.empty || 'No saved videos yet. Completed videos appear here automatically.'}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
