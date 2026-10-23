import { OWEB_SOL_MODEL_IDS } from "./owebSolModels.js";

/** MuAPI catalog ids with a known Vercel AI Gateway video mapping (subset). */
const GATEWAY_CAPABLE_MODEL_IDS = new Set([
  "veo-3.1",
  "veo-3.1-fast",
  "kling-v2.6-t2v",
  "kling-v2.6-i2v",
  "kling-v2.6-pro-text-to-video",
  "kling-v2.6-pro-image-to-video",
  "kling-v3.0-t2v",
  "kling-v3.0-i2v",
  "kling-v3.0-pro-text-to-video",
  "kling-v3.0-pro-image-to-video",
  "grok-imagine-t2v",
  "grok-imagine-i2v",
  "vercel-veo-3.1",
  "vercel-veo-3.1-fast",
  "vercel-kling-t2v",
  "vercel-kling-i2v",
  "vercel-kling-v3-t2v",
  "vercel-kling-v3-i2v",
  "vercel-grok-video",
]);

function isKlingGatewayCapable(modelId) {
  const id = String(modelId || "").toLowerCase();
  if (!id.includes("kling")) return false;
  return (
    id.includes("t2v") ||
    id.includes("i2v") ||
    id.includes("text-to-video") ||
    id.includes("image-to-video")
  );
}

/**
 * Whether a catalog model should appear in the video picker for the active Settings provider.
 * @param {{ id?: string, generativeProviders?: string[] }} model
 * @param {string} apiProviderId
 */
export function isVideoModelVisibleForApiProvider(model, apiProviderId) {
  const modelId = model?.id;
  const allowed = model?.generativeProviders;

  if (allowed?.length) {
    return allowed.includes(apiProviderId);
  }

  if (apiProviderId === "comfy-runpod") {
    return false;
  }

  if (apiProviderId === "vercel-ai-gateway") {
    if (OWEB_SOL_MODEL_IDS.has(modelId)) return false;
    return GATEWAY_CAPABLE_MODEL_IDS.has(modelId) || isKlingGatewayCapable(modelId);
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
