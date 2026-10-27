import { useEffect, useMemo, useState } from 'react';
import {
  fetchVideoGenerationCostEstimate,
  isMuapiStyleCostProvider,
} from '../utils/videoGenerationCostEstimate.js';
import {
  formatVideoPickerUsdShort,
  pickerEntryVariantModelId,
  resolveSyncVideoPickerUsdPrice,
} from '../utils/gatewayVideoPickerLabels.js';
import {
  buildMuapiPickerCostEstimateParams,
  resolvePickerEntryModelKind,
} from '../utils/muapiVideoCostEstimateParams.js';

const MUAPI_FETCH_CONCURRENCY = 4;
const MUAPI_MAX_ENTRIES = 48;

/**
 * @param {Array<() => Promise<void>>} tasks
 * @param {number} concurrency
 */
async function runWithConcurrency(tasks, concurrency) {
  const queue = [...tasks];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) await task();
    }
  });
  await Promise.all(workers);
}

/**
 * Preload USD labels for Video Studio model picker rows (MuAPI + local tables).
 * @param {{
 *   apiProviderId: string,
 *   apiKey?: string,
 *   modelKind: 't2v' | 'i2v' | 'v2v',
 *   entries: import('../modelFamilies.js').ModelPickerEntry[],
 *   categoryId: string,
 *   selectedModelId?: string,
 *   gatewayPricingByGatewayModelId?: Record<string, string>,
 *   durationSeconds?: number,
 *   aspectRatio?: string,
 *   resolution?: string,
 *   enabled?: boolean,
 * }} options
 */
export function useVideoPickerEntryPrices({
  apiProviderId,
  apiKey,
  modelKind,
  entries,
  categoryId,
  selectedModelId,
  gatewayPricingByGatewayModelId = {},
  durationSeconds = 5,
  aspectRatio,
  resolution,
  enabled = true,
}) {
  const syncPrices = useMemo(() => {
    const map = {};
    if (!enabled) return map;
    for (const entry of entries) {
      const label = resolveSyncVideoPickerUsdPrice(apiProviderId, entry, {
        categoryId,
        selectedModelId,
        gatewayPricingByGatewayModelId,
        durationSeconds,
      });
      if (label) map[entry.id] = label;
    }
    return map;
  }, [
    apiProviderId,
    categoryId,
    durationSeconds,
    enabled,
    entries,
    gatewayPricingByGatewayModelId,
    selectedModelId,
  ]);

  const [muapiPrices, setMuapiPrices] = useState({});

  const entryKey = useMemo(
    () =>
      entries
        .map((entry) => entry.id)
        .slice(0, MUAPI_MAX_ENTRIES)
        .join('|'),
    [entries],
  );

  useEffect(() => {
    if (!enabled || !isMuapiStyleCostProvider(apiProviderId)) {
      setMuapiPrices({});
      return undefined;
    }

    const controller = new AbortController();
    const targets = [];
    const seen = new Set();
    const selectedEntry = entries.find((entry) =>
      entry.variantIds?.has?.(selectedModelId),
    );
    if (selectedEntry && !seen.has(selectedEntry.id)) {
      targets.push(selectedEntry);
      seen.add(selectedEntry.id);
    }
    for (const entry of entries) {
      if (targets.length >= MUAPI_MAX_ENTRIES) break;
      if (seen.has(entry.id)) continue;
      targets.push(entry);
      seen.add(entry.id);
    }

    const tasks = targets.map((entry) => async () => {
      const entryModelKind = resolvePickerEntryModelKind(entry, categoryId, modelKind);
      const variantCategory = categoryId === 'all' ? entryModelKind : categoryId;
      const modelId = pickerEntryVariantModelId(entry, variantCategory);
      if (!modelId) return;
      const params = buildMuapiPickerCostEstimateParams(modelId, entryModelKind, {
        duration: durationSeconds,
        aspect_ratio: aspectRatio,
        resolution,
      });

      try {
        const estimate = await fetchVideoGenerationCostEstimate(
          {
            apiProviderId,
            apiKey,
            modelKind: entryModelKind,
            params,
            enabled: true,
          },
          controller.signal,
        );
        if (controller.signal.aborted || !estimate) return;
        const label = formatVideoPickerUsdShort(estimate.cost);
        if (!label) return;
        setMuapiPrices((prev) =>
          prev[entry.id] === label ? prev : { ...prev, [entry.id]: label },
        );
      } catch {
        /* ignore per-row estimate failures */
      }
    });

    setMuapiPrices({});
    void runWithConcurrency(tasks, MUAPI_FETCH_CONCURRENCY);

    return () => {
      controller.abort();
    };
  }, [
    apiKey,
    apiProviderId,
    aspectRatio,
    categoryId,
    durationSeconds,
    enabled,
    entryKey,
    modelKind,
    resolution,
    selectedModelId,
  ]);

  return useMemo(() => {
    if (!enabled) return {};
    if (isMuapiStyleCostProvider(apiProviderId)) {
      return muapiPrices;
    }
    return syncPrices;
  }, [apiProviderId, enabled, muapiPrices, syncPrices]);
}
