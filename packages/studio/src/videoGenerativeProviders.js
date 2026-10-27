import { OWEB_SOL_MODEL_IDS } from './owebSolModels.js';

/**
 * Whether a catalog model should appear in the video picker for the active Settings provider.
 * @param {{ id?: string, generativeProviders?: string[] }} model
 * @param {string} apiProviderId
 */
export function isVideoModelVisibleForApiProvider(model, apiProviderId) {
  const modelId = model?.id;
  const allowed = model?.generativeProviders;

  if (apiProviderId === 'vercel-ai-gateway') {
    if (OWEB_SOL_MODEL_IDS.has(modelId)) return false;
    // Gateway mode uses explicit catalog stubs (and live gateway API extras), not the
    // full MuAPI matrix — avoids showing Seedance 1.x / extend routes that would
    // silently map to the wrong upstream model.
    return Boolean(allowed?.includes('vercel-ai-gateway'));
  }

  if (allowed?.length) {
    return allowed.includes(apiProviderId);
  }

  if (apiProviderId === 'comfy-runpod') {
    return false;
  }

  if (OWEB_SOL_MODEL_IDS.has(modelId)) {
    return false;
  }

  return true;
}

/**
 * @param {import('./modelFamilies.js').ModelPickerEntry} entry
 * @param {string} apiProviderId
 */
export function isVideoPickerEntryVisibleForApiProvider(entry, apiProviderId) {
  for (const variant of Object.values(entry.variantsByMode || {})) {
    if (variant?.model && isVideoModelVisibleForApiProvider(variant.model, apiProviderId)) {
      return true;
    }
  }
  return false;
}
