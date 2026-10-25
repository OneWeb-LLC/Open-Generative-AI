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
  const suffix = gatewaySlug ? pricingByGatewayModelId[gatewaySlug] : null;
  if (suffix) {
    const match = String(suffix).match(/\$[\d.]+/);
    if (match) return match[0];
  }

  const durationSeconds =
    typeof options.durationSeconds === 'number' && options.durationSeconds > 0
      ? options.durationSeconds
      : 5;
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
