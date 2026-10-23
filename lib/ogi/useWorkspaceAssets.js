'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  completionToGenerationPayload,
  groupGenerationsByStudio,
  readLocalStudioHistory,
  STUDIO_PERSIST_BASE_KEYS,
} from '@/lib/ogi/workspace-assets';
import {
  deleteWorkspaceGenerationRecord,
  fetchWorkspaceGenerations,
  persistWorkspaceGeneration,
} from '@/lib/ogi/workspace-generations-client';

const BACKFILL_STUDIO_TYPES = Object.keys(STUDIO_PERSIST_BASE_KEYS);

/**
 * Workspace-scoped asset library state (logout-safe).
 * @param {{ userId: string | null; workspaceId: string | null; storageScope: string | null; apiKey: string | null }} scope
 */
export function useWorkspaceAssets({ userId, workspaceId, storageScope, apiKey }) {
  const enabled = Boolean(userId && workspaceId);
  const [ready, setReady] = useState(false);
  const [historyByStudio, setHistoryByStudio] = useState({});
  const [allGenerations, setAllGenerations] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const backfillStarted = useRef(false);

  const reload = useCallback(async () => {
    if (!enabled) {
      setHistoryByStudio({});
      setAllGenerations([]);
      setReady(false);
      return;
    }

    const body = await fetchWorkspaceGenerations({ workspaceId, limit: 250 });
    const grouped = groupGenerationsByStudio(body.generations);
    setHistoryByStudio(grouped);
    setAllGenerations(body.generations ?? []);
    setLoadError(null);
    setReady(true);
  }, [enabled, workspaceId]);

  const runLocalBackfill = useCallback(async () => {
    if (!enabled || !apiKey) return;

    const backfillKey = `ogi_asset_backfill_${workspaceId}`;
    if (sessionStorage.getItem(backfillKey) === 'done') return;

    let existingUrls = new Set();
    try {
      const snapshot = await fetchWorkspaceGenerations({ workspaceId, limit: 250 });
      existingUrls = new Set(
        (snapshot.generations ?? []).map((g) => g.media_url).filter(Boolean),
      );
    } catch (err) {
      console.warn('[ogi] backfill snapshot failed', err);
    }

    const tasks = [];
    for (const studioType of BACKFILL_STUDIO_TYPES) {
      const localEntries = readLocalStudioHistory(studioType, apiKey, storageScope);
      for (const entry of localEntries) {
        if (!entry?.url || existingUrls.has(entry.url)) continue;
        const payload = completionToGenerationPayload(
          {
            ...entry,
            type: studioType,
            id: entry.id,
          },
          studioType,
        );
        if (!payload) continue;
        tasks.push(
          persistWorkspaceGeneration(payload, workspaceId).catch((err) => {
            console.warn('[ogi] backfill persist failed', studioType, err);
          }),
        );
        existingUrls.add(entry.url);
      }
    }

    if (tasks.length) {
      await Promise.all(tasks);
      await reload();
    }

    sessionStorage.setItem(backfillKey, 'done');
  }, [apiKey, enabled, reload, storageScope, workspaceId]);

  useEffect(() => {
    backfillStarted.current = false;
  }, [workspaceId]);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      setHistoryByStudio({});
      setAllGenerations([]);
      return;
    }

    let cancelled = false;
    setReady(false);

    (async () => {
      try {
        await reload();
        if (cancelled) return;
        if (!backfillStarted.current) {
          backfillStarted.current = true;
          await runLocalBackfill();
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[ogi] workspace assets load failed', err);
          setLoadError(err?.message ?? 'load_failed');
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, workspaceId, storageScope, reload, runLocalBackfill]);

  const persistCompletion = useCallback(
    async (data, tabId) => {
      if (!enabled) return;
      const payload = completionToGenerationPayload(data, tabId);
      if (!payload) return;

      try {
        const body = await persistWorkspaceGeneration(payload, workspaceId);
        const entry = body.historyEntry;
        if (!entry) return;

        const studioType = payload.studio_type;
        setHistoryByStudio((previous) => {
          const list = previous[studioType] ?? [];
          const next = [
            entry,
            ...list.filter(
              (item) => item.recordId !== entry.recordId && item.id !== entry.id && item.url !== entry.url,
            ),
          ].slice(0, 120);
          return { ...previous, [studioType]: next };
        });

        setAllGenerations((previous) => [
          { ...(body.generation ?? {}), historyEntry: entry, studio_type: studioType },
          ...previous.filter((row) => row.id !== body.generation?.id),
        ].slice(0, 250));
      } catch (err) {
        console.error('[ogi] workspace asset persist failed', err);
        setLoadError(err?.message ?? 'persist_failed');
      }
    },
    [enabled, workspaceId],
  );

  const deleteHistoryItem = useCallback(
    async (studioType, entry) => {
      const recordId = entry?.recordId;
      if (recordId && enabled) {
        try {
          await deleteWorkspaceGenerationRecord(recordId, workspaceId);
        } catch (err) {
          console.warn('[ogi] workspace asset delete failed', err);
        }
      }

      setHistoryByStudio((previous) => ({
        ...previous,
        [studioType]: (previous[studioType] ?? []).filter(
          (item) => item.recordId !== recordId && item.id !== entry?.id,
        ),
      }));
      setAllGenerations((previous) => previous.filter((row) => row.id !== recordId));
    },
    [enabled, workspaceId],
  );

  const historyForStudio = useCallback(
    (studioType) => {
      if (!enabled || !ready) return undefined;
      return historyByStudio[studioType] ?? [];
    },
    [enabled, ready, historyByStudio],
  );

  return {
    enabled,
    ready,
    loadError,
    allGenerations,
    historyForStudio,
    persistCompletion,
    deleteHistoryItem,
    reload,
  };
}
