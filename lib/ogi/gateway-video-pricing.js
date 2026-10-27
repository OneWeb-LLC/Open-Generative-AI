import { formatGatewayVideoPriceSuffix } from './gateway-video-capability.js';
import { estimateConfiguredVideoCost } from './generation-cost-estimate.js';

/**
 * Catalog price suffix for a gateway video model (live pricing + configured estimate fallback).
 * @param {{
 *   gatewayModel: string,
 *   pricing?: import('@ai-sdk/gateway').GatewayLanguageModelEntry['pricing'] | null,
 *   durationSeconds?: number,
 * }} input
 * @returns {string | null}
 */
export function buildGatewayVideoModelPriceSuffix(input) {
  const durationSeconds =
    typeof input.durationSeconds === 'number' && input.durationSeconds > 0
      ? input.durationSeconds
      : 5;
  const fromGateway = formatGatewayVideoPriceSuffix(input.pricing ?? null, {
    modelType: 'video',
  });
  if (fromGateway) return fromGateway;

  const estimate = estimateConfiguredVideoCost({
    providerId: 'vercel-ai-gateway',
    gatewayModel: input.gatewayModel,
    duration: durationSeconds,
  });
  if (!estimate || typeof estimate.cost !== 'number' || !Number.isFinite(estimate.cost)) {
    return null;
  }
  const cost = estimate.cost;
  const label = cost >= 0.01 ? cost.toFixed(2) : cost.toFixed(4);
  return ` · ~$${label} (${durationSeconds}s)`;
}
