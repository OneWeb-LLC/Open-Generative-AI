import {
  DEFAULT_VERCEL_VIDEO_CATALOG,
  loadMuapiToGatewayMapFromEnv,
  resolveGatewayVideoModelStrict,
} from './gateway-video-capability.js';

/** @typedef {import('./gateway-video-capability.js').VercelVideoCatalogEntry} VercelVideoModel */

const RESOLUTION_ALIASES = {
  '480p': '854x480',
  '720p': '1280x720',
  '1080p': '1920x1080',
  '4k': '3840x2160',
};

/**
 * MuAPI uses labels like 720p; AI Gateway expects `{width}x{height}`.
 * @param {string | undefined | null} resolution
 * @returns {string | undefined}
 */
export function normalizeGatewayResolution(resolution) {
  if (resolution == null || resolution === '') return undefined;
  const raw = String(resolution).trim();
  if (/^\d+x\d+$/i.test(raw)) return raw.toLowerCase();
  const alias = RESOLUTION_ALIASES[raw.toLowerCase()];
  return alias ?? undefined;
}

export function getVercelVideoCatalog() {
  const raw = process.env.OGI_VERCEL_VIDEO_MODELS || process.env.NEXT_PUBLIC_OGI_VERCEL_VIDEO_MODELS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      /* fall through */
    }
  }
  return DEFAULT_VERCEL_VIDEO_CATALOG;
}

function resolveKlingGatewayMode(muapiModelId) {
  const id = String(muapiModelId || '').toLowerCase();
  if (
    id.includes('-pro-') ||
    id.includes('omni-pro') ||
    id.includes('turbo-pro') ||
    id.endsWith('-pro-text-to-video') ||
    id.endsWith('-pro-image-to-video')
  ) {
    return 'pro';
  }
  return 'std';
}

/**
 * Normalize studio payload → AI SDK `experimental_generateVideo` options.
 * @param {string | undefined} muapiModelId
 * @param {string} gatewayModel
 * @param {Record<string, unknown>} body
 */
export function buildGatewayVideoCallOptions(muapiModelId, gatewayModel, body) {
  const rawAspect = body.aspect_ratio || body.aspectRatio;
  const aspectRatio =
    rawAspect && rawAspect !== 'auto' ? String(rawAspect) : undefined;
  const durationRaw = body.duration != null ? Number(body.duration) : undefined;
  const duration = Number.isFinite(durationRaw) ? durationRaw : undefined;

  let resolution = normalizeGatewayResolution(body.resolution);
  /** @type {Record<string, Record<string, unknown>> | undefined} */
  let providerOptions;
  let generateAudio;

  if (gatewayModel.startsWith('klingai/')) {
    resolution = undefined;
    providerOptions = {
      klingai: {
        mode: resolveKlingGatewayMode(muapiModelId),
      },
    };
    if (body.generate_audio === true || body.generateAudio === true) {
      generateAudio = true;
    }
  }

  return {
    aspectRatio,
    duration,
    resolution,
    providerOptions,
    generateAudio,
  };
}

export function resolveGatewayVideoModel(muapiModelId) {
  const catalog = getVercelVideoCatalog();
  const map = loadMuapiToGatewayMapFromEnv();
  const resolved = resolveGatewayVideoModelStrict(muapiModelId, { catalog, map });
  if (resolved) return resolved;
  return process.env.OGI_VERCEL_DEFAULT_VIDEO_MODEL ?? 'google/veo-3.1-generate-001';
}
