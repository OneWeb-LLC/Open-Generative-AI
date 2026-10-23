import {
  formatGatewayVideoPriceSuffix,
  resolveGatewayVideoModelStrict,
} from '../../../../lib/ogi/gateway-video-capability.js';

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
