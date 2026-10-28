import {
  formatGatewayVideoPriceSuffix,
  resolveGatewayVideoModelStrict,
} from '../../../../lib/ogi/gateway-video-capability.js';
import { estimateConfiguredVideoCost } from '../../../../lib/ogi/generation-cost-estimate.js';

/**
 * @param {{ id?: string, gatewayModel?: string }} model
 * @returns {string | null}
 */
export function resolveStudioModelGatewaySlug(model) {
  if (!model) return null;
  if (model.gatewayModel) return model.gatewayModel;
  return resolveGatewayVideoModelStrict(model.id);
}

/**
 * @param {string} baseName
 * @param {string | null | undefined} gatewaySlug
 * @param {Record<string, string>} pricingByGatewayModelId
 */
export function formatVideoPickerLabelWithPrice(baseName, gatewaySlug, pricingByGatewayModelId = {}) {
  const suffix = gatewaySlug ? pricingByGatewayModelId[gatewaySlug] : null;
  if (suffix) return `${baseName}${suffix}`;
  return baseName;
}

/**
 * USD label for model picker rows (right-aligned), without mutating the model title.
 * @param {string | null | undefined} gatewaySlug
 * @param {Record<string, string>} pricingByGatewayModelId
 * @param {{ modelId?: string, durationSeconds?: number }} [options]
 * @returns {string | null}
 */
export function resolveVideoPickerUsdPriceLabel(
  gatewaySlug,
  pricingByGatewayModelId = {},
  options = {},
) {
  const durationSeconds =
    typeof options.durationSeconds === 'number' && options.durationSeconds > 0
      ? options.durationSeconds
      : 5;
  const suffix = gatewaySlug ? pricingByGatewayModelId[gatewaySlug] : null;
  if (suffix) {
    const text = String(suffix);
    if (!/\/unit\b/.test(text)) {
      const perSec = text.match(/\$([\d.]+)\/sec\b/);
      if (perSec) {
        const rate = Number(perSec[1]);
        if (Number.isFinite(rate) && rate > 0) {
          const total = rate * durationSeconds;
          return total >= 0.01 ? `~$${total.toFixed(2)}` : `~$${total.toFixed(4)}`;
        }
      }
      const estimateMatch = text.match(/~\$([\d.]+)/);
      if (estimateMatch) return `~$${estimateMatch[1]}`;
      const perMOut = text.match(/\$([\d.]+)\/M out\b/);
      if (perMOut) return `$${perMOut[1]}/M`;
    }
  }

  const estimate = estimateConfiguredVideoCost({
    providerId: 'vercel-ai-gateway',
    modelId: options.modelId,
    gatewayModel: gatewaySlug || undefined,
    duration: durationSeconds,
  });
  if (!estimate || typeof estimate.cost !== 'number' || !Number.isFinite(estimate.cost)) {
    return null;
  }
  const cost = estimate.cost;
  if (cost >= 0.01) return `~$${cost.toFixed(2)}`;
  return `~$${cost.toFixed(4)}`;
}

/**
 * @param {import('../modelFamilies.js').ModelPickerEntry} entry
 * @param {string | undefined} selectedModelId
 * @param {Record<string, string>} pricingByGatewayModelId
 */
export function pickerEntryGatewaySlug(entry, selectedModelId, pricingByGatewayModelId) {
  const variant =
    (selectedModelId && entry.variantsByMode
      ? Object.values(entry.variantsByMode).find((v) => v?.model?.id === selectedModelId)
      : null) || entry.defaultVariant;
  return resolveStudioModelGatewaySlug(variant?.model);
}

export { formatGatewayVideoPriceSuffix };
