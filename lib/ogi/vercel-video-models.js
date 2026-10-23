/** @typedef {{ id: string, label: string, gatewayModel: string, modes: ('t2v'|'i2v')[] }} VercelVideoModel */

const DEFAULT_VERCEL_VIDEO_MODELS = [
  {
    id: 'vercel-veo-3.1',
    label: 'Google Veo 3.1',
    gatewayModel: 'google/veo-3.1-generate-001',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-veo-3.1-fast',
    label: 'Google Veo 3.1 Fast',
    gatewayModel: 'google/veo-3.1-fast-generate-001',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-kling-t2v',
    label: 'Kling 2.6 T2V',
    gatewayModel: 'klingai/kling-v2.6-t2v',
    modes: ['t2v'],
  },
  {
    id: 'vercel-kling-i2v',
    label: 'Kling 2.6 I2V',
    gatewayModel: 'klingai/kling-v2.6-i2v',
    modes: ['i2v'],
  },
  {
    id: 'vercel-kling-v3-t2v',
    label: 'Kling 3.0 T2V',
    gatewayModel: 'klingai/kling-v3.0-t2v',
    modes: ['t2v'],
  },
  {
    id: 'vercel-kling-v3-i2v',
    label: 'Kling 3.0 I2V',
    gatewayModel: 'klingai/kling-v3.0-i2v',
    modes: ['i2v'],
  },
  {
    id: 'vercel-grok-video',
    label: 'Grok Imagine Video',
    gatewayModel: 'spacexai/grok-imagine-video',
    modes: ['t2v', 'i2v'],
  },
];

/** MuAPI catalog model id → AI Gateway video model slug */
const DEFAULT_MUAPI_TO_GATEWAY = {
  'veo-3.1': 'google/veo-3.1-generate-001',
  'veo-3.1-fast': 'google/veo-3.1-fast-generate-001',
  'kling-v2.6-t2v': 'klingai/kling-v2.6-t2v',
  'kling-v2.6-i2v': 'klingai/kling-v2.6-i2v',
  'grok-imagine-t2v': 'spacexai/grok-imagine-video',
  'grok-imagine-i2v': 'spacexai/grok-imagine-video',
};

const RESOLUTION_ALIASES = {
  '480p': '854x480',
  '720p': '1280x720',
  '1080p': '1920x1080',
  '4k': '3840x2160',
};

function parseJsonMap(raw) {
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') throw new Error('Expected JSON object');
  return parsed;
}

function isKlingImageToVideo(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  return id.includes('image-to-video') || id.includes('-i2v') || id.includes('i2v');
}

function isKlingTextToVideo(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  return id.includes('text-to-video') || id.includes('-t2v') || id.includes('t2v');
}

function resolveKlingGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.includes('kling')) return null;
  const isV3 = id.includes('v3.0') || id.includes('v3-') || id.includes('v3.');
  const isV26 = id.includes('v2.6') || id.includes('v2-6');
  if (isV3) {
    return isKlingImageToVideo(muapiModelId)
      ? 'klingai/kling-v3.0-i2v'
      : 'klingai/kling-v3.0-t2v';
  }
  if (isV26) {
    return isKlingImageToVideo(muapiModelId)
      ? 'klingai/kling-v2.6-i2v'
      : 'klingai/kling-v2.6-t2v';
  }
  if (id.includes('v3')) {
    return isKlingImageToVideo(muapiModelId)
      ? 'klingai/kling-v3.0-i2v'
      : 'klingai/kling-v3.0-t2v';
  }
  return null;
}

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
  return DEFAULT_VERCEL_VIDEO_MODELS;
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
    // Kling on AI Gateway uses aspectRatio + klingai.mode, not MuAPI 720p labels.
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
  const raw = process.env.OGI_VERCEL_VIDEO_MODEL_MAP;
  let map = DEFAULT_MUAPI_TO_GATEWAY;
  if (raw) {
    try {
      map = { ...DEFAULT_MUAPI_TO_GATEWAY, ...parseJsonMap(raw) };
    } catch {
      /* keep defaults */
    }
  }
  if (muapiModelId && map[muapiModelId]) return map[muapiModelId];
  if (muapiModelId) {
    const kling = resolveKlingGatewayModel(muapiModelId);
    if (kling) return kling;
  }
  const catalog = getVercelVideoCatalog();
  const hit = catalog.find((m) => m.id === muapiModelId);
  return hit?.gatewayModel ?? process.env.OGI_VERCEL_DEFAULT_VIDEO_MODEL ?? 'google/veo-3.1-generate-001';
}
