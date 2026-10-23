import { resolveGatewayVideoModel } from './vercel-video-models.js';

/** @typedef {{ baseUsd?: number, perSecondUsd?: number, audioMultiplier?: number, resolutionMultipliers?: Record<string, number> }} CostRate */

const DEFAULT_PROVIDER_RATES = {
  'vercel-ai-gateway': {
    _default: { baseUsd: 0, perSecondUsd: 0.05, audioMultiplier: 1.25 },
    models: {
      'google/veo-3.1-generate-001': { baseUsd: 0, perSecondUsd: 0.75, audioMultiplier: 1.5 },
      'google/veo-3.1-fast-generate-001': { baseUsd: 0, perSecondUsd: 0.4, audioMultiplier: 1.5 },
      'klingai/kling-v2.6-t2v': { baseUsd: 0, perSecondUsd: 0.08 },
      'klingai/kling-v2.6-i2v': { baseUsd: 0, perSecondUsd: 0.08 },
      'klingai/kling-v3.0-t2v': { baseUsd: 0, perSecondUsd: 0.1 },
      'klingai/kling-v3.0-i2v': { baseUsd: 0, perSecondUsd: 0.1 },
      'spacexai/grok-imagine-video': { baseUsd: 0, perSecondUsd: 0.06 },
    },
  },
  'comfy-runpod': {
    _default: { baseUsd: 0.04, perSecondUsd: 0.012 },
    models: {
      'oweb-sol-t2v': { baseUsd: 0.04, perSecondUsd: 0.012 },
      'oweb-sol-i2v': { baseUsd: 0.05, perSecondUsd: 0.014 },
    },
  },
};

function parseOverrideRates() {
  const raw =
    process.env.OGI_GENERATION_COST_ESTIMATES ||
    process.env.NEXT_PUBLIC_OGI_GENERATION_COST_ESTIMATES;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function mergeRates(base, override) {
  if (!override || typeof override !== 'object') return base;
  const out = { ...base };
  for (const [providerId, providerRates] of Object.entries(override)) {
    if (!providerRates || typeof providerRates !== 'object') continue;
    const existing = out[providerId] || { _default: {}, models: {} };
    out[providerId] = {
      _default: { ...existing._default, ...providerRates._default },
      models: { ...existing.models, ...providerRates.models },
    };
  }
  return out;
}

export function getGenerationCostRateTable() {
  return mergeRates(DEFAULT_PROVIDER_RATES, parseOverrideRates());
}

/**
 * @param {string} providerId
 * @param {string} modelKey - studio model id or gateway slug
 * @returns {CostRate | null}
 */
export function resolveConfiguredCostRate(providerId, modelKey) {
  const table = getGenerationCostRateTable();
  const provider = table[providerId];
  if (!provider) return null;
  const models = provider.models || {};
  if (modelKey && models[modelKey]) {
    return { ...provider._default, ...models[modelKey] };
  }
  return provider._default ?? null;
}

function resolutionMultiplier(rate, resolution) {
  if (!resolution || !rate?.resolutionMultipliers) return 1;
  const key = String(resolution).trim().toLowerCase();
  const hit = rate.resolutionMultipliers[key];
  return typeof hit === 'number' && Number.isFinite(hit) ? hit : 1;
}

/**
 * @param {CostRate} rate
 * @param {{ durationSeconds?: number, resolution?: string, generateAudio?: boolean }} dims
 */
export function computeCostFromRate(rate, dims = {}) {
  if (!rate) return null;
  const durationRaw = dims.durationSeconds;
  const duration =
    typeof durationRaw === 'number' && Number.isFinite(durationRaw) && durationRaw > 0
      ? durationRaw
      : 5;
  const base = typeof rate.baseUsd === 'number' && Number.isFinite(rate.baseUsd) ? rate.baseUsd : 0;
  const perSecond =
    typeof rate.perSecondUsd === 'number' && Number.isFinite(rate.perSecondUsd)
      ? rate.perSecondUsd
      : 0;
  let cost = base + perSecond * duration;
  cost *= resolutionMultiplier(rate, dims.resolution);
  if (dims.generateAudio) {
    const mult =
      typeof rate.audioMultiplier === 'number' && Number.isFinite(rate.audioMultiplier)
        ? rate.audioMultiplier
        : 1;
    cost *= mult;
  }
  if (!Number.isFinite(cost) || cost < 0) return null;
  return Math.round(cost * 1_000_000) / 1_000_000;
}

/**
 * Local (config-driven) estimate for gateway / Comfy providers.
 * @param {{
 *   providerId: string,
 *   modelId?: string,
 *   gatewayModel?: string,
 *   duration?: number,
 *   resolution?: string,
 *   generateAudio?: boolean,
 * }} input
 */
export function estimateConfiguredVideoCost(input) {
  const providerId = input.providerId;
  if (providerId === 'vercel-ai-gateway') {
    const gatewayModel =
      input.gatewayModel ||
      (input.modelId ? resolveGatewayVideoModel(input.modelId) : null);
    if (!gatewayModel) return null;
    const rate =
      resolveConfiguredCostRate(providerId, gatewayModel) ||
      resolveConfiguredCostRate(providerId, input.modelId || '');
    const cost = computeCostFromRate(rate, {
      durationSeconds: input.duration,
      resolution: input.resolution,
      generateAudio: input.generateAudio,
    });
    if (cost == null) return null;
    return {
      cost,
      currency: 'USD',
      source: 'estimate',
      modelKey: gatewayModel,
    };
  }

  if (providerId === 'comfy-runpod') {
    const modelId = input.modelId;
    if (!modelId) return null;
    const rate = resolveConfiguredCostRate(providerId, modelId);
    const cost = computeCostFromRate(rate, {
      durationSeconds: input.duration,
      resolution: input.resolution,
    });
    if (cost == null) return null;
    return {
      cost,
      currency: 'USD',
      source: 'estimate',
      modelKey: modelId,
    };
  }

  return null;
}

export function isLocalCostEstimateProvider(providerId) {
  return providerId === 'vercel-ai-gateway' || providerId === 'comfy-runpod';
}

export function isMuapiCostEstimateProvider(providerId) {
  return (
    providerId === 'muapi-proxy' ||
    providerId === 'muapi-direct' ||
    providerId === 'oweb-backend' ||
    providerId === 'custom'
  );
}
