/**
 * Normalize cost / provider fields from MuAPI poll results or gateway responses.
 * @param {unknown} result
 * @param {{ provider?: string, model?: string, gatewayModel?: string, estimatedCost?: number, estimatedCurrency?: string }} extras
 */
export function buildGenerationMetadata(result, extras = {}) {
  const meta = {
    provider: extras.provider ?? null,
    model: extras.model ?? null,
    gatewayModel: extras.gatewayModel ?? null,
    estimatedCost:
      typeof extras.estimatedCost === 'number' && Number.isFinite(extras.estimatedCost)
        ? extras.estimatedCost
        : null,
    estimatedCurrency: extras.estimatedCurrency ?? null,
    cost: null,
    currency: null,
    requestId: null,
  };

  if (!result || typeof result !== 'object') return meta;

  const requestId = result.request_id || result.id;
  if (requestId) meta.requestId = String(requestId);

  const costBlock = result.cost;
  if (costBlock && typeof costBlock === 'object') {
    if (typeof costBlock.cost === 'number' && Number.isFinite(costBlock.cost)) {
      meta.cost = costBlock.cost;
      meta.currency =
        typeof costBlock.currency === 'string' ? costBlock.currency.trim().toUpperCase() : 'USD';
    } else if (typeof costBlock.amount === 'number' && Number.isFinite(costBlock.amount)) {
      meta.cost = costBlock.amount;
      meta.currency =
        typeof costBlock.currency === 'string' ? costBlock.currency.trim().toUpperCase() : 'USD';
    } else if (typeof costBlock.amount_credits === 'number' && Number.isFinite(costBlock.amount_credits)) {
      meta.cost = costBlock.amount_credits;
      meta.currency = 'CREDITS';
    }
  }

  if (meta.cost == null && typeof result.usage?.cost === 'number') {
    meta.cost = result.usage.cost;
    meta.currency = result.usage.currency?.toUpperCase?.() || 'USD';
  }

  if (result.metadata && typeof result.metadata === 'object') {
    meta.gateway = result.metadata;
  }

  return meta;
}

export function formatGenerationCostLabel(meta, { freeLabel = '—' } = {}) {
  if (!meta) return freeLabel;
  if (typeof meta.cost === 'number' && Number.isFinite(meta.cost)) {
    const cur = meta.currency === 'CREDITS' ? 'cr' : meta.currency || 'USD';
    const value = meta.currency === 'CREDITS' ? meta.cost : meta.cost.toFixed(4);
    return `${value} ${cur}`;
  }
  if (typeof meta.estimatedCost === 'number' && Number.isFinite(meta.estimatedCost)) {
    const cur = meta.estimatedCurrency || 'USD';
    return `~${meta.estimatedCost.toFixed(4)} ${cur}`;
  }
  return freeLabel;
}
