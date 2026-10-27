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
 * Compact USD label for model picker rows.
 * @param {number} cost
 * @returns {string}
 */
export function formatVideoPickerUsdShort(cost) {
  if (typeof cost !== 'number' || !Number.isFinite(cost)) return '';
  if (cost >= 0.01) return `~$${cost.toFixed(2)}`;
  return `~$${cost.toFixed(4)}`;
}

/**
 * @param {import('../modelFamilies.js').ModelPickerEntry} entry
 * @param {string} categoryId
 * @returns {string | undefined}
 */
export function pickerEntryVariantModelId(entry, categoryId = 'all') {
  if (!entry) return undefined;
  if (categoryId === 't2v' && entry.variantsByMode?.t2v) return entry.variantsByMode.t2v.model.id;
  if (categoryId === 'i2v' && entry.variantsByMode?.i2v) return entry.variantsByMode.i2v.model.id;
  if (categoryId === 'v2v' && entry.variantsByMode?.v2v) return entry.variantsByMode.v2v.model.id;
  return entry.defaultVariant?.model?.id;
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
  return formatVideoPickerUsdShort(estimate.cost);
}

/**
 * Synchronous picker price for gateway / Comfy providers.
 * @param {string} apiProviderId
 * @param {import('../modelFamilies.js').ModelPickerEntry} entry
 * @param {{
 *   categoryId?: string,
 *   selectedModelId?: string,
 *   gatewayPricingByGatewayModelId?: Record<string, string>,
 *   durationSeconds?: number,
 * }} [options]
 * @returns {string | null}
 */
export function resolveSyncVideoPickerUsdPrice(apiProviderId, entry, options = {}) {
  const durationSeconds =
    typeof options.durationSeconds === 'number' && options.durationSeconds > 0
      ? options.durationSeconds
      : 5;
  const categoryId = options.categoryId || 'all';
  const modelId = pickerEntryVariantModelId(entry, categoryId);

  if (apiProviderId === 'vercel-ai-gateway') {
    const slug = pickerEntryGatewaySlug(
      entry,
      options.selectedModelId,
      options.gatewayPricingByGatewayModelId || {},
    );
    return resolveVideoPickerUsdPriceLabel(slug, options.gatewayPricingByGatewayModelId || {}, {
      modelId,
      durationSeconds,
    });
  }

  if (apiProviderId === 'comfy-runpod') {
    if (!modelId) return null;
    const estimate = estimateConfiguredVideoCost({
      providerId: 'comfy-runpod',
      modelId,
      duration: durationSeconds,
    });
    if (!estimate || typeof estimate.cost !== 'number' || !Number.isFinite(estimate.cost)) {
      return null;
    }
    return formatVideoPickerUsdShort(estimate.cost);
  }

  return null;
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
