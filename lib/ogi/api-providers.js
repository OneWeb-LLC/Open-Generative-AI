/** @typedef {'proxy' | 'direct' | 'vercel-video' | 'comfy-video' | 'oweb-studio'} ApiProviderMode */

/**
 * @typedef {Object} ApiProvider
 * @property {string} id
 * @property {string} label
 * @property {string} [description]
 * @property {ApiProviderMode} mode
 * @property {string} [proxyPath] - browser path when mode=proxy
 * @property {string} [upstream] - server-only upstream base URL
 * @property {string} [signupUrl]
 * @property {string} [keyHint]
 */

import { getOwebAppUrl } from './constants.js';
import { isOwebBillingEnabled } from './oweb-billing.server.js';

const MUAPI_UPSTREAM = (process.env.MUAPI_UPSTREAM || 'https://api.muapi.ai').replace(/\/$/, '');

/** @type {ApiProvider[]} */
export const DEFAULT_API_PROVIDERS = [
  {
    id: 'muapi-proxy',
    label: 'MuAPI (satellite proxy)',
    description: 'Routes through this app — recommended on Vercel (avoids CORS).',
    mode: 'proxy',
    proxyPath: '/api',
    upstream: MUAPI_UPSTREAM,
    signupUrl: 'https://muapi.ai',
    keyHint: 'Muapi.ai API key (x-api-key)',
  },
  {
    id: 'muapi-direct',
    label: 'MuAPI (direct)',
    description: 'Browser calls api.muapi.ai directly (needs MuAPI CORS).',
    mode: 'direct',
    upstream: MUAPI_UPSTREAM,
    signupUrl: 'https://muapi.ai',
    keyHint: 'Muapi.ai API key (x-api-key)',
  },
];

function parseJsonProviders(raw) {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('NEXT_PUBLIC_OGI_API_PROVIDERS must be a non-empty JSON array');
  }
  return parsed;
}

/**
 * Full provider list (server): includes upstream URLs for proxies.
 * @returns {ApiProvider[]}
 */
export function getApiProviders() {
  const raw = process.env.NEXT_PUBLIC_OGI_API_PROVIDERS;
  if (raw) {
    try {
      return parseJsonProviders(raw);
    } catch (err) {
      console.warn('[ogi] invalid NEXT_PUBLIC_OGI_API_PROVIDERS', err?.message ?? err);
    }
  }

  /** @type {ApiProvider[]} */
  const providers = DEFAULT_API_PROVIDERS.map((p) => ({ ...p }));

  if (isOwebBillingEnabled()) {
    providers.unshift({
      id: 'oweb-wallet',
      label: process.env.NEXT_PUBLIC_OGI_OWEB_WALLET_LABEL || 'OWeb OneCredits (workspace wallet)',
      description:
        'Generations debit the active workspace wallet on OWeb — same credits as the rest of your team.',
      mode: 'oweb-studio',
      proxyPath: '/api/oweb-studio/generative',
      signupUrl: `${getOwebAppUrl()}/billing`,
      keyHint: 'Signed-in OneID session (no MuAPI BYOK)',
    });
  }

  const owebBackend = process.env.OGI_OWEB_BACKEND_API_UPSTREAM || process.env.BACKEND_API_URL;
  if (owebBackend) {
    providers.push({
      id: 'oweb-backend',
      label: process.env.NEXT_PUBLIC_OGI_OWEB_BACKEND_LABEL || 'OWeb backend API',
      description: 'Generative gateway from the OWeb Vercel project (MuAPI-compatible proxy path).',
      mode: 'proxy',
      proxyPath: '/api/ogi/upstream/oweb-backend',
      upstream: owebBackend.replace(/\/$/, ''),
      signupUrl: 'https://muapi.ai',
      keyHint: 'API key accepted by the OWeb backend gateway',
    });
  }

  const vercelVideoProviderEnabled =
    Boolean(process.env.AI_GATEWAY_API_KEY) ||
    Boolean(process.env.VERCEL_AI_GATEWAY_API_KEY) ||
    process.env.OGI_ENABLE_VERCEL_VIDEO_PROVIDER === 'true' ||
    process.env.NEXT_PUBLIC_OGI_ENABLE_VERCEL_VIDEO_PROVIDER === 'true' ||
    process.env.VERCEL === '1';
  const comfyRunPodEnabled =
    Boolean(process.env.RUNPOD_API_KEY?.trim()) ||
    process.env.OGI_ENABLE_COMFY_RUNPOD_PROVIDER === 'true' ||
    process.env.NEXT_PUBLIC_OGI_ENABLE_COMFY_RUNPOD_PROVIDER === 'true';
  if (comfyRunPodEnabled) {
    providers.push({
      id: 'comfy-runpod',
      label: process.env.NEXT_PUBLIC_OGI_COMFY_PROVIDER_LABEL || 'ComfyUI (RunPod)',
      description: 'Oweb Sol and other Comfy workflows on RunPod serverless (server uses RUNPOD_API_KEY).',
      mode: 'comfy-video',
      proxyPath: '/api/comfy-runpod',
      signupUrl: 'https://www.runpod.io/',
      keyHint: 'MuAPI key optional; generation uses server RunPod credentials',
    });
  }

  if (vercelVideoProviderEnabled) {
    providers.push({
      id: 'vercel-ai-gateway',
      label: process.env.NEXT_PUBLIC_OGI_VERCEL_PROVIDER_LABEL || 'Vercel AI Gateway (video)',
      description:
        'Video generation via AI SDK experimental_generateVideo and Vercel AI Gateway (server route).',
      mode: 'vercel-video',
      proxyPath: '/api/vercel-gateway',
      signupUrl: 'https://vercel.com/docs/ai-gateway',
      keyHint: 'AI Gateway API key (optional if server has AI_GATEWAY_API_KEY)',
    });
  }

  const customUpstream = process.env.OGI_CUSTOM_API_UPSTREAM;
  if (customUpstream) {
    providers.push({
      id: 'custom',
      label: process.env.NEXT_PUBLIC_OGI_CUSTOM_API_LABEL || 'Custom API',
      description: 'Extra upstream configured via OGI_CUSTOM_API_UPSTREAM.',
      mode: 'proxy',
      proxyPath: '/api/ogi/upstream/custom',
      upstream: customUpstream.replace(/\/$/, ''),
      keyHint: 'API key for the custom upstream',
    });
  }

  return providers;
}

/**
 * Safe for the browser: no secret upstream URLs for custom/oweb entries.
 * @returns {Omit<ApiProvider, 'upstream'>[]}
 */
export function getPublicApiProviders() {
  return getApiProviders().map((p) => {
    if (p.mode === 'direct') return { ...p };
    const { upstream, ...rest } = p;
    return rest;
  });
}

/**
 * @param {string} providerId
 * @returns {ApiProvider | undefined}
 */
export function getApiProviderById(providerId) {
  return getApiProviders().find((p) => p.id === providerId);
}

export function getDefaultApiProviderId() {
  const providers = getPublicApiProviders();
  const fromEnv = process.env.NEXT_PUBLIC_OGI_DEFAULT_API_PROVIDER;
  if (fromEnv && providers.some((p) => p.id === fromEnv)) return fromEnv;
  if (isOwebBillingEnabled() && providers.some((p) => p.id === 'oweb-wallet')) {
    return 'oweb-wallet';
  }
  return providers[0]?.id ?? 'muapi-proxy';
}
