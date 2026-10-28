/** @typedef {{ id: string, label: string, gatewayModel: string, modes: ('t2v'|'i2v')[] }} VercelVideoCatalogEntry */

export const DEFAULT_VERCEL_VIDEO_CATALOG = [
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
    id: 'vercel-veo-3.1-lite',
    label: 'Google Veo 3.1 Lite',
    gatewayModel: 'google/veo-3.1-lite-generate-001',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-veo-3.0',
    label: 'Google Veo 3.0',
    gatewayModel: 'google/veo-3.0-generate-001',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-veo-3.0-fast',
    label: 'Google Veo 3.0 Fast',
    gatewayModel: 'google/veo-3.0-fast-generate-001',
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
    id: 'vercel-kling-v2.5-turbo-t2v',
    label: 'Kling 2.5 Turbo T2V',
    gatewayModel: 'klingai/kling-v2.5-turbo-t2v',
    modes: ['t2v'],
  },
  {
    id: 'vercel-kling-v2.5-turbo-i2v',
    label: 'Kling 2.5 Turbo I2V',
    gatewayModel: 'klingai/kling-v2.5-turbo-i2v',
    modes: ['i2v'],
  },
  {
    id: 'vercel-grok-video',
    label: 'Grok Imagine Video',
    gatewayModel: 'spacexai/grok-imagine-video',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-grok-video-1.5',
    label: 'Grok Imagine Video 1.5',
    gatewayModel: 'spacexai/grok-imagine-video-1.5',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-grok-video-1.5-lite',
    label: 'Grok Imagine Video 1.5 Lite',
    gatewayModel: 'spacexai/grok-imagine-video-1.5-lite',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-seedance-2.5',
    label: 'Seedance 2.5',
    gatewayModel: 'bytedance/seedance-2.5',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-seedance-2.0',
    label: 'Seedance 2.0',
    gatewayModel: 'bytedance/seedance-2.0',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-seedance-2.0-fast',
    label: 'Seedance 2.0 Fast',
    gatewayModel: 'bytedance/seedance-2.0-fast',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-seedance-2.0-mini',
    label: 'Seedance 2.0 Mini',
    gatewayModel: 'bytedance/seedance-2.0-mini',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-wan-v2.6-t2v',
    label: 'Wan 2.6 T2V',
    gatewayModel: 'alibaba/wan-v2.6-t2v',
    modes: ['t2v'],
  },
  {
    id: 'vercel-wan-v2.6-i2v',
    label: 'Wan 2.6 I2V',
    gatewayModel: 'alibaba/wan-v2.6-i2v',
    modes: ['i2v'],
  },
  {
    id: 'vercel-wan-v3.0',
    label: 'Wan 3.0 Video',
    gatewayModel: 'alibaba/wan-v3.0-video',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-wan-v3.0-prime',
    label: 'Wan 3.0 Video Prime',
    gatewayModel: 'alibaba/wan-v3.0-video-prime',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-minimax-h3',
    label: 'MiniMax H3',
    gatewayModel: 'minimax/minimax-h3',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-minimax-h3-max',
    label: 'MiniMax H3 Max',
    gatewayModel: 'minimax/minimax-h3-max',
    modes: ['t2v', 'i2v'],
  },
  {
    id: 'vercel-flux-3-video',
    label: 'FLUX 3 Video',
    gatewayModel: 'bfl/flux-3-video',
    modes: ['t2v', 'i2v'],
  },
];

/** MuAPI catalog model id → AI Gateway video model slug */
export const DEFAULT_MUAPI_TO_GATEWAY = {
  'grok-imagine-text-to-video': 'spacexai/grok-imagine-video',
  'grok-imagine-image-to-video': 'spacexai/grok-imagine-video',
  'grok-imagine-video-1-5-preview': 'spacexai/grok-imagine-video-1.5',
  'veo3.1-text-to-video': 'google/veo-3.1-generate-001',
  'veo3.1-image-to-video': 'google/veo-3.1-generate-001',
  'veo3.1-fast-text-to-video': 'google/veo-3.1-fast-generate-001',
  'veo3.1-fast-image-to-video': 'google/veo-3.1-fast-generate-001',
  'veo3.1-lite-text-to-video': 'google/veo-3.1-lite-generate-001',
  'veo3.1-lite-image-to-video': 'google/veo-3.1-lite-generate-001',
  'veo3-text-to-video': 'google/veo-3.0-generate-001',
  'veo3-image-to-video': 'google/veo-3.0-generate-001',
  'veo3-fast-text-to-video': 'google/veo-3.0-fast-generate-001',
  'veo3-fast-image-to-video': 'google/veo-3.0-fast-generate-001',
  'seedance-2.5-text-to-video': 'bytedance/seedance-2.5',
  'seedance-2.5-image-to-video': 'bytedance/seedance-2.5',
  'wan3.0-text-to-video': 'alibaba/wan-v3.0-video',
  'wan3.0-image-to-video': 'alibaba/wan-v3.0-video',
  'wan3.0-prime-text-to-video': 'alibaba/wan-v3.0-video-prime',
  'wan3.0-prime-image-to-video': 'alibaba/wan-v3.0-video-prime',
  'wan2.6-image-to-video': 'alibaba/wan-v2.6-i2v',
  'minimax-h3-text-to-video': 'minimax/minimax-h3',
  'minimax-h3-image-to-video': 'minimax/minimax-h3',
  'minimax-h3-max-text-to-video': 'minimax/minimax-h3-max',
  'minimax-h3-max-image-to-video': 'minimax/minimax-h3-max',
};

const GATEWAY_UNSUPPORTED_PATTERNS = [
  /extend/i,
  /-4k(?:-|$)/i,
  /4k-video/i,
  /reference-to-video/i,
  /reference-video/i,
  /motion-control/i,
  /video-edit/i,
  /video-upscal/i,
  /watermark/i,
  /lora/i,
  /effects/i,
  /dress-change/i,
  /background-remov/i,
];

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
  if (!isKlingTextToVideo(muapiModelId) && !isKlingImageToVideo(muapiModelId)) return null;

  if (id.includes('v2.5') || id.includes('v2-5') || id.includes('turbo')) {
    return isKlingImageToVideo(muapiModelId)
      ? 'klingai/kling-v2.5-turbo-i2v'
      : 'klingai/kling-v2.5-turbo-t2v';
  }

  const isV3 = id.includes('v3.0') || id.includes('v3-') || id.includes('v3.');
  const isV26 = id.includes('v2.6') || id.includes('v2-6');
  if (isV3 || id.includes('v3')) {
    return isKlingImageToVideo(muapiModelId)
      ? 'klingai/kling-v3.0-i2v'
      : 'klingai/kling-v3.0-t2v';
  }
  if (isV26) {
    return isKlingImageToVideo(muapiModelId)
      ? 'klingai/kling-v2.6-i2v'
      : 'klingai/kling-v2.6-t2v';
  }
  return null;
}

function resolveVeoGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.startsWith('veo')) return null;
  if (!id.includes('text-to-video') && !id.includes('image-to-video')) return null;

  if (id.includes('lite')) return 'google/veo-3.1-lite-generate-001';
  if (id.includes('fast')) return 'google/veo-3.1-fast-generate-001';
  if (id.includes('3.1') || id.includes('veo3.1')) return 'google/veo-3.1-generate-001';
  if (id.includes('3.0-fast') || id.includes('veo3-fast')) return 'google/veo-3.0-fast-generate-001';
  if (id.includes('veo3') || id.includes('veo-3')) return 'google/veo-3.0-generate-001';
  return null;
}

function resolveGrokGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.includes('grok-imagine')) return null;
  if (!id.includes('text-to-video') && !id.includes('image-to-video') && !id.includes('video-1-5')) {
    return null;
  }
  if (id.includes('1-5') || id.includes('1.5')) {
    return id.includes('lite')
      ? 'spacexai/grok-imagine-video-1.5-lite'
      : 'spacexai/grok-imagine-video-1.5';
  }
  return 'spacexai/grok-imagine-video';
}

function resolveSeedanceGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.includes('seedance')) return null;
  const isT2vOrI2v =
    id.includes('text-to-video') ||
    id.includes('image-to-video') ||
    id.endsWith('-t2v') ||
    id.endsWith('-i2v');
  if (!isT2vOrI2v) return null;
  // Seedance 1.x exists on MuAPI only — not on Vercel AI Gateway video.
  if (/seedance-(?:lite|pro)(?:-|$)/.test(id) || /seedance-v1(?:\.|5)/.test(id)) {
    return null;
  }
  if (id.includes('2.5')) return 'bytedance/seedance-2.5';
  if (id.includes('mini')) return 'bytedance/seedance-2.0-mini';
  if (id.includes('fast')) return 'bytedance/seedance-2.0-fast';
  if (
    id.includes('2.0') ||
    id.includes('2-0') ||
    /^seedance-2(?:-|$)/.test(id) ||
    id.startsWith('seedance-v2.0')
  ) {
    return 'bytedance/seedance-2.0';
  }
  return null;
}

function resolveWanGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.startsWith('wan')) return null;
  if (!id.includes('text-to-video') && !id.includes('image-to-video')) return null;
  if (id.includes('prime')) return 'alibaba/wan-v3.0-video-prime';
  if (id.includes('wan3') || id.includes('wan-3') || id.includes('wan3.0')) {
    return 'alibaba/wan-v3.0-video';
  }
  if (id.includes('wan2.6') || id.includes('wan-2.6')) {
    return id.includes('image-to-video') ? 'alibaba/wan-v2.6-i2v' : 'alibaba/wan-v2.6-t2v';
  }
  return null;
}

function resolveMinimaxGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.includes('minimax-h3')) return null;
  if (!id.includes('text-to-video') && !id.includes('image-to-video')) return null;
  if (id.includes('h3-max')) return 'minimax/minimax-h3-max';
  return 'minimax/minimax-h3';
}

function resolveFluxGatewayModel(muapiModelId) {
  const id = muapiModelId.toLowerCase();
  if (!id.includes('flux-3') && !id.includes('flux-3-')) return null;
  if (!id.includes('text-to-video') && !id.includes('image-to-video')) return null;
  return 'bfl/flux-3-video';
}

/**
 * @param {string | undefined | null} muapiModelId
 * @param {{ catalog?: VercelVideoCatalogEntry[], map?: Record<string, string> }} [options]
 * @returns {string | null}
 */
export function resolveGatewayVideoModelStrict(muapiModelId, options = {}) {
  if (!muapiModelId) return null;
  const id = String(muapiModelId);
  const map = options.map ?? DEFAULT_MUAPI_TO_GATEWAY;
  if (map[id]) return map[id];

  const catalog = options.catalog ?? DEFAULT_VERCEL_VIDEO_CATALOG;
  const catalogHit =
    catalog.find((entry) => entry.id === id) ||
    catalog.find((entry) => {
      if (id.endsWith('-t2v') || id.endsWith('-i2v')) {
        return entry.id === id.replace(/-(t2v|i2v)$/, '');
      }
      return false;
    });
  if (catalogHit?.gatewayModel) return catalogHit.gatewayModel;

  const resolvers = [
    resolveKlingGatewayModel,
    resolveVeoGatewayModel,
    resolveGrokGatewayModel,
    resolveSeedanceGatewayModel,
    resolveWanGatewayModel,
    resolveMinimaxGatewayModel,
    resolveFluxGatewayModel,
  ];
  for (const resolve of resolvers) {
    const slug = resolve(id);
    if (slug) return slug;
  }
  return null;
}

/**
 * @param {string | undefined | null} muapiModelId
 * @returns {boolean}
 */
export function isGatewayUnsupportedMuapiVideoTool(muapiModelId) {
  const id = String(muapiModelId || '');
  if (!id) return true;
  return GATEWAY_UNSUPPORTED_PATTERNS.some((pattern) => pattern.test(id));
}

/**
 * @param {string | undefined | null} muapiModelId
 * @param {{ catalog?: VercelVideoCatalogEntry[], map?: Record<string, string> }} [options]
 * @returns {boolean}
 */
export function isMuapiVideoModelGatewaySupported(muapiModelId, options = {}) {
  if (!muapiModelId || isGatewayUnsupportedMuapiVideoTool(muapiModelId)) return false;
  return Boolean(resolveGatewayVideoModelStrict(muapiModelId, options));
}

/**
 * @param {import('@ai-sdk/gateway').GatewayLanguageModelEntry['pricing'] | null | undefined} pricing
 * @param {{ modelType?: string | null }} [options]
 * @returns {string | null}
 */
export function formatGatewayVideoPriceSuffix(pricing, options = {}) {
  if (!pricing) return null;
  const output = pricing.output != null ? Number(pricing.output) : NaN;
  const input = pricing.input != null ? Number(pricing.input) : NaN;
  const isVideo = options.modelType === 'video';

  if (isVideo) {
    if (!Number.isFinite(output) || output <= 0) return null;
    // Gateway lists video output as $/sec when the rate is sub-dollar; larger values are $/M tokens.
    if (output >= 1) {
      return ` · $${output.toFixed(2)}/M out`;
    }
    if (output >= 0.01) return ` · $${output.toFixed(2)}/sec`;
    if (output >= 0.001) return ` · $${output.toFixed(3)}/sec`;
    return ` · $${output.toFixed(4)}/sec`;
  }

  const value = Number.isFinite(output) && output > 0 ? output : input;
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value >= 0.01) return ` · $${value.toFixed(2)}/unit`;
  if (value >= 0.001) return ` · $${value.toFixed(3)}/unit`;
  return ` · $${value.toFixed(4)}/unit`;
}

export function loadMuapiToGatewayMapFromEnv() {
  const raw = process.env.OGI_VERCEL_VIDEO_MODEL_MAP;
  if (!raw) return DEFAULT_MUAPI_TO_GATEWAY;
  try {
    return { ...DEFAULT_MUAPI_TO_GATEWAY, ...parseJsonMap(raw) };
  } catch {
    return DEFAULT_MUAPI_TO_GATEWAY;
  }
}
