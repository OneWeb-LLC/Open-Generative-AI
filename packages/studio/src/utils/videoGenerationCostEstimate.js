import { estimateVideoCost, estimateV2VCost } from '../muapi.js';

const LOCAL_ESTIMATE_PATH = '/api/ogi/generation-cost-estimate';

/**
 * @typedef {{ cost: number, currency: string, source?: string }} VideoCostEstimate
 */

/**
 * @param {string} apiProviderId
 */
export function isMuapiStyleCostProvider(apiProviderId) {
  return (
    apiProviderId === 'muapi-proxy' ||
    apiProviderId === 'muapi-direct' ||
    apiProviderId === 'oweb-backend' ||
    apiProviderId === 'custom' ||
    !apiProviderId
  );
}

/**
 * @param {string} apiProviderId
 */
export function isLocalTableCostProvider(apiProviderId) {
  return apiProviderId === 'vercel-ai-gateway' || apiProviderId === 'comfy-runpod';
}

async function fetchLocalConfiguredEstimate(body, signal) {
  const response = await fetch(LOCAL_ESTIMATE_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text.slice(0, 120) || 'Cost estimate failed');
  }
  const data = await response.json();
  if (typeof data?.cost !== 'number' || !Number.isFinite(data.cost)) return null;
  const currency =
    typeof data.currency === 'string' && data.currency.trim()
      ? data.currency.trim().toUpperCase()
      : 'USD';
  return { cost: data.cost, currency, source: data.source || 'estimate' };
}

/**
 * @param {{
 *   apiProviderId: string,
 *   apiKey?: string,
 *   modelKind: 't2v' | 'i2v' | 'v2v',
 *   params: Record<string, unknown>,
 *   enabled?: boolean,
 * }} options
 * @param {AbortSignal} [signal]
 * @returns {Promise<VideoCostEstimate | null>}
 */
export async function fetchVideoGenerationCostEstimate(
  { apiProviderId, apiKey, modelKind, params, enabled = true },
  signal,
) {
  if (!enabled || !params?.model) return null;

  if (isMuapiStyleCostProvider(apiProviderId)) {
    try {
      if (modelKind === 'v2v') return await estimateV2VCost(apiKey, params, signal);
      return await estimateVideoCost(apiKey, params, { modelKind }, signal);
    } catch {
      return null;
    }
  }

  if (isLocalTableCostProvider(apiProviderId)) {
    try {
      return await fetchLocalConfiguredEstimate(
        {
          providerId: apiProviderId,
          modelId: params.model,
          gatewayModel: params.gatewayModel,
          duration: params.duration,
          resolution: params.resolution,
          generateAudio: params.generate_audio === true || params.generateAudio === true,
        },
        signal,
      );
    } catch {
      return null;
    }
  }

  return null;
}
