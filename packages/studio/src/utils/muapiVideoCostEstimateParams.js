import {
  getAspectRatiosForI2VModel,
  getAspectRatiosForVideoModel,
  getDurationsForI2VModel,
  getDurationsForModel,
  getI2VModelById,
  getResolutionsForI2VModel,
  getResolutionsForVideoModel,
  getV2VModelById,
  getVideoModelById,
} from '../models.js';

/**
 * @param {import('../modelFamilies.js').ModelPickerEntry} entry
 * @param {string} categoryId
 * @param {'t2v' | 'i2v' | 'v2v'} [fallback]
 */
export function resolvePickerEntryModelKind(entry, categoryId = 'all', fallback = 't2v') {
  if (!entry?.variantsByMode) return fallback;
  if (categoryId === 't2v' && entry.variantsByMode.t2v) return 't2v';
  if (categoryId === 'i2v' && entry.variantsByMode.i2v) return 'i2v';
  if (categoryId === 'v2v' && entry.variantsByMode.v2v) return 'v2v';
  if (entry.variantsByMode.t2v) return 't2v';
  if (entry.variantsByMode.i2v) return 'i2v';
  if (entry.variantsByMode.v2v) return 'v2v';
  return fallback;
}

/**
 * @param {'t2v' | 'i2v' | 'v2v'} modelKind
 * @param {string} modelId
 */
export function getMuapiVideoModelInfo(modelKind, modelId) {
  if (!modelId) return null;
  if (modelKind === 'i2v') return getI2VModelById(modelId);
  if (modelKind === 'v2v') return getV2VModelById(modelId);
  return getVideoModelById(modelId);
}

/**
 * @param {*} value
 * @param {Array<*>} options
 * @param {*} defaultValue
 */
function pickAllowedOption(value, options, defaultValue) {
  if (!Array.isArray(options) || options.length === 0) return undefined;
  if (value !== undefined && value !== null && options.includes(value)) return value;
  if (defaultValue !== undefined && defaultValue !== null && options.includes(defaultValue)) {
    return defaultValue;
  }
  return options[0];
}

/**
 * Snap duration / aspect ratio / resolution to values the model accepts (MuAPI estimate-cost).
 * @param {string} modelId
 * @param {'t2v' | 'i2v' | 'v2v'} modelKind
 * @param {{ duration?: number, aspect_ratio?: string, resolution?: string, quality?: string }} dims
 */
export function snapVideoCostEstimateFields(modelId, modelKind, dims = {}) {
  const model = getMuapiVideoModelInfo(modelKind, modelId);
  if (!model) {
    return {
      duration: dims.duration,
      aspect_ratio: dims.aspect_ratio,
      resolution: dims.resolution,
      quality: dims.quality,
    };
  }

  const inputs = model.inputs || {};
  const out = { ...dims };

  const aspectRatios =
    modelKind === 'i2v'
      ? getAspectRatiosForI2VModel(modelId)
      : getAspectRatiosForVideoModel(modelId);
  if (aspectRatios.length > 0) {
    out.aspect_ratio = pickAllowedOption(
      out.aspect_ratio,
      aspectRatios,
      inputs.aspect_ratio?.default,
    );
  }

  const durations =
    modelKind === 'i2v' ? getDurationsForI2VModel(modelId) : getDurationsForModel(modelId);
  if (durations.length > 0) {
    out.duration = pickAllowedOption(out.duration, durations, inputs.duration?.default);
  }

  const resolutions =
    modelKind === 'i2v'
      ? getResolutionsForI2VModel(modelId)
      : getResolutionsForVideoModel(modelId, { aspect_ratio: out.aspect_ratio });
  if (resolutions.length > 0) {
    out.resolution = pickAllowedOption(
      out.resolution,
      resolutions,
      inputs.resolution?.default,
    );
  }

  const qualities = inputs.quality?.enum || [];
  if (qualities.length > 0) {
    out.quality = pickAllowedOption(out.quality, qualities, inputs.quality?.default);
  }

  return out;
}

/**
 * @param {string} modelId
 * @param {'t2v' | 'i2v' | 'v2v'} modelKind
 * @param {{ duration?: number, aspect_ratio?: string, resolution?: string, quality?: string, prompt?: string }} [global]
 */
export function buildMuapiPickerCostEstimateParams(modelId, modelKind, global = {}) {
  const snapped = snapVideoCostEstimateFields(modelId, modelKind, {
    duration: global.duration,
    aspect_ratio: global.aspect_ratio,
    resolution: global.resolution,
    quality: global.quality,
  });
  const params = { model: modelId, ...snapped };
  if (global.prompt?.trim()) params.prompt = global.prompt.trim();
  return params;
}
