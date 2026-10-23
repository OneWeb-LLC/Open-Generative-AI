import { DEFAULT_VERCEL_VIDEO_CATALOG } from '../../../lib/ogi/gateway-video-capability.js';

const GATEWAY_VIDEO_INPUTS = Object.freeze({
  prompt: {
    type: 'string',
    title: 'Prompt',
    name: 'prompt',
    description: 'Describe the video you want to generate.',
  },
  aspect_ratio: {
    enum: Object.freeze(['16:9', '9:16', '1:1']),
    type: 'string',
    title: 'Aspect Ratio',
    name: 'aspect_ratio',
    default: '16:9',
  },
  duration: {
    type: 'int',
    title: 'Duration',
    name: 'duration',
    default: 5,
    minValue: 4,
    maxValue: 12,
    step: 1,
  },
  resolution: {
    enum: Object.freeze(['720p', '1080p']),
    type: 'string',
    title: 'Resolution',
    name: 'resolution',
    default: '720p',
  },
});

function providerFromGatewaySlug(gatewayModel) {
  const prefix = String(gatewayModel || '').split('/')[0];
  const names = {
    google: { provider: 'google', provider_name: 'Google' },
    klingai: { provider: 'kling', provider_name: 'Kling AI' },
    spacexai: { provider: 'grok', provider_name: 'xAI' },
    bytedance: { provider: 'bytedance', provider_name: 'ByteDance' },
    alibaba: { provider: 'alibaba', provider_name: 'Alibaba' },
    minimax: { provider: 'minimax', provider_name: 'MiniMax' },
    bfl: { provider: 'blackforest', provider_name: 'Black Forest Labs' },
  };
  return names[prefix] || { provider: prefix || 'vercel', provider_name: 'Vercel Gateway' };
}

function stubCatalogModel({ id, name, gatewayModel, mode }) {
  const providerMeta = providerFromGatewaySlug(gatewayModel);
  return {
    id,
    name,
    endpoint: id,
    family: id,
    hasPrompt: true,
    generativeProviders: ['vercel-ai-gateway'],
    gatewayModel,
    inputs: GATEWAY_VIDEO_INPUTS,
    ...providerMeta,
    gatewayMode: mode,
  };
}

function expandCatalogEntry(entry) {
  const models = { t2v: [], i2v: [] };
  const modes = entry.modes || [];
  if (modes.includes('t2v') && modes.includes('i2v')) {
    models.t2v.push(
      stubCatalogModel({
        id: `${entry.id}-t2v`,
        name: `${entry.label} T2V`,
        gatewayModel: entry.gatewayModel,
        mode: 't2v',
      }),
    );
    models.i2v.push(
      stubCatalogModel({
        id: `${entry.id}-i2v`,
        name: `${entry.label} I2V`,
        gatewayModel: entry.gatewayModel,
        mode: 'i2v',
      }),
    );
    return models;
  }
  if (modes.includes('t2v')) {
    models.t2v.push(
      stubCatalogModel({
        id: entry.id,
        name: entry.label,
        gatewayModel: entry.gatewayModel,
        mode: 't2v',
      }),
    );
  }
  if (modes.includes('i2v')) {
    models.i2v.push(
      stubCatalogModel({
        id: entry.id,
        name: entry.label,
        gatewayModel: entry.gatewayModel,
        mode: 'i2v',
      }),
    );
  }
  return models;
}

const expanded = DEFAULT_VERCEL_VIDEO_CATALOG.reduce(
  (acc, entry) => {
    const chunk = expandCatalogEntry(entry);
    acc.t2v.push(...chunk.t2v);
    acc.i2v.push(...chunk.i2v);
    return acc;
  },
  { t2v: [], i2v: [] },
);

export const VERCEL_GATEWAY_T2V_MODELS = Object.freeze(expanded.t2v);
export const VERCEL_GATEWAY_I2V_MODELS = Object.freeze(expanded.i2v);

/**
 * @param {{ id: string, name?: string }} gatewayModel
 */
export function buildGatewayApiPickerEntry(gatewayModel) {
  const slug = gatewayModel.id;
  const lower = slug.toLowerCase();
  const mode =
    lower.includes('i2v') || lower.includes('image-to-video') || lower.includes('/r2v')
      ? 'i2v'
      : 't2v';
  const model = stubCatalogModel({
    id: `gateway-${slug.replace(/\//g, '-')}`,
    name: gatewayModel.name || slug,
    gatewayModel: slug,
    mode,
  });
  const family = {
    id: model.family,
    name: model.name,
    provider: model.provider,
    provider_name: model.provider_name,
    searchText: `${model.name} ${slug}`.toLowerCase(),
  };
  const variant = { model, mode };
  return Object.freeze({
    id: `${model.id}:dynamic`,
    family,
    name: model.name,
    variantIds: new Set([model.id]),
    variantsByMode: { [mode]: variant },
    defaultVariant: variant,
    searchText: family.searchText,
    gatewayDynamic: true,
  });
}
