import { useEffect, useMemo, useState } from 'react';
import { fetchVideoGenerationCostEstimate } from '../utils/videoGenerationCostEstimate.js';
import { formatGenerationCostLabel } from '../utils/generationMetadata.js';

/**
 * Debounced pre-generation cost estimate for Video Studio.
 * @param {{
 *   apiProviderId: string,
 *   apiKey?: string,
 *   modelKind: 't2v' | 'i2v' | 'v2v',
 *   params: Record<string, unknown> | null,
 *   enabled?: boolean,
 *   debounceMs?: number,
 *   freeLabel?: string,
 * }} options
 */
export function useVideoCostEstimate({
  apiProviderId,
  apiKey,
  modelKind,
  params,
  enabled = true,
  debounceMs = 320,
  freeLabel = '—',
}) {
  const [state, setState] = useState({
    status: 'idle',
    estimate: null,
    label: null,
  });

  const serialized = useMemo(() => JSON.stringify(params ?? null), [params]);
  const parsedParams = useMemo(() => {
    if (!serialized || serialized === 'null') return null;
    try {
      return JSON.parse(serialized);
    } catch {
      return null;
    }
  }, [serialized]);

  useEffect(() => {
    if (!enabled || !parsedParams?.model) {
      setState({ status: 'idle', estimate: null, label: null });
      return undefined;
    }

    setState({ status: 'loading', estimate: null, label: null });

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const estimate = await fetchVideoGenerationCostEstimate(
          {
            apiProviderId,
            apiKey,
            modelKind,
            params: parsedParams,
            enabled,
          },
          controller.signal,
        );
        if (controller.signal.aborted) return;
        if (!estimate) {
          setState({ status: 'unavailable', estimate: null, label: null });
          return;
        }
        const label = formatGenerationCostLabel(
          {
            priceUsd: estimate.cost,
            priceSource: 'estimate',
            estimatedCost: estimate.cost,
            estimatedCurrency: estimate.currency,
            currency: estimate.currency,
          },
          { freeLabel },
        );
        setState({ status: 'ready', estimate, label });
      } catch {
        if (!controller.signal.aborted) {
          setState({ status: 'unavailable', estimate: null, label: null });
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [apiProviderId, apiKey, modelKind, serialized, enabled, debounceMs, freeLabel]);

  return state;
}
