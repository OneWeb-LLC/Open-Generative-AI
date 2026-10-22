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
    gatewayModel: 'kling-ai/kling-v2.6-t2v',
    modes: ['t2v'],
  },
  {
    id: 'vercel-kling-i2v',
    label: 'Kling 2.6 I2V',
    gatewayModel: 'kling-ai/kling-v2.6-i2v',
    modes: ['i2v'],
  },
  {
    id: 'vercel-grok-video',
    label: 'Grok Imagine Video',
    gatewayModel: 'xai/grok-imagine-video',
    modes: ['t2v', 'i2v'],
  },
];

/** MuAPI catalog model id → AI Gateway video model slug */
const DEFAULT_MUAPI_TO_GATEWAY = {
  'veo-3.1': 'google/veo-3.1-generate-001',
  'veo-3.1-fast': 'google/veo-3.1-fast-generate-001',
  'kling-v2.6-t2v': 'kling-ai/kling-v2.6-t2v',
  'kling-v2.6-i2v': 'kling-ai/kling-v2.6-i2v',
  'grok-imagine-t2v': 'xai/grok-imagine-video',
  'grok-imagine-i2v': 'xai/grok-imagine-video',
};

function parseJsonMap(raw) {
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') throw new Error('Expected JSON object');
  return parsed;
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
  if (muapiModelId?.includes('kling-v3')) {
    if (muapiModelId.includes('image-to-video')) return 'kling-ai/kling-v2.6-i2v';
    if (muapiModelId.includes('text-to-video')) return 'kling-ai/kling-v2.6-t2v';
  }
  const catalog = getVercelVideoCatalog();
  const hit = catalog.find((m) => m.id === muapiModelId);
  return hit?.gatewayModel ?? process.env.OGI_VERCEL_DEFAULT_VIDEO_MODEL ?? 'google/veo-3.1-generate-001';
}
