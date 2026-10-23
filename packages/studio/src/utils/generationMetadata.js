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
    priceUsd: null,
    priceSource: null,
    cost: null,
    currency: null,
    credits: null,
    requestId: null,
    generationId: null,
  };

  if (!result || typeof result !== 'object') {
    applyUsdEstimateFallback(meta);
    return meta;
  }

  const requestId = result.request_id || result.id;
  if (requestId) meta.requestId = String(requestId);

  if (result.metadata && typeof result.metadata === 'object') {
    meta.gateway = result.metadata;
    if (typeof result.metadata.generationId === 'string') {
      meta.generationId = result.metadata.generationId;
    }
    if (
      typeof result.metadata.priceUsd === 'number' &&
      Number.isFinite(result.metadata.priceUsd)
    ) {
      setUsdPrice(meta, result.metadata.priceUsd, result.metadata.priceSource || 'actual');
    }
  }

  const costBlock = result.cost;
  if (costBlock && typeof costBlock === 'object') {
    const usd = readUsdFromCostBlock(costBlock);
    if (usd != null) {
      setUsdPrice(meta, usd, 'actual');
    } else if (
      typeof costBlock.amount_credits === 'number' &&
      Number.isFinite(costBlock.amount_credits)
    ) {
      meta.credits = costBlock.amount_credits;
      meta.cost = costBlock.amount_credits;
      meta.currency = 'CREDITS';
    } else if (typeof costBlock.cost === 'number' && Number.isFinite(costBlock.cost)) {
      const cur =
        typeof costBlock.currency === 'string' ? costBlock.currency.trim().toUpperCase() : 'USD';
      if (cur === 'USD') {
        setUsdPrice(meta, costBlock.cost, 'actual');
      } else {
        meta.cost = costBlock.cost;
        meta.currency = cur;
      }
    } else if (typeof costBlock.amount === 'number' && Number.isFinite(costBlock.amount)) {
      const cur =
        typeof costBlock.currency === 'string' ? costBlock.currency.trim().toUpperCase() : 'USD';
      if (cur === 'USD') {
        setUsdPrice(meta, costBlock.amount, 'actual');
      } else {
        meta.cost = costBlock.amount;
        meta.currency = cur;
      }
    }
    if (typeof costBlock.generationId === 'string') {
      meta.generationId = costBlock.generationId;
    }
  }

  if (meta.priceUsd == null && typeof result.usage?.cost === 'number') {
    const cur = result.usage.currency?.toUpperCase?.() || 'USD';
    if (cur === 'USD') {
      setUsdPrice(meta, result.usage.cost, 'actual');
    }
  }

  applyUsdEstimateFallback(meta);
  return meta;
}

function readUsdFromCostBlock(costBlock) {
  const candidates = [
    costBlock.usd,
    costBlock.cost_usd,
    costBlock.amount_usd,
    costBlock.price_usd,
  ];
  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  if (typeof costBlock.cost === 'number' && Number.isFinite(costBlock.cost)) {
    const cur =
      typeof costBlock.currency === 'string' ? costBlock.currency.trim().toUpperCase() : '';
    if (cur === 'USD') return costBlock.cost;
  }
  if (typeof costBlock.amount === 'number' && Number.isFinite(costBlock.amount)) {
    const cur =
      typeof costBlock.currency === 'string' ? costBlock.currency.trim().toUpperCase() : '';
    if (cur === 'USD') return costBlock.amount;
  }
  return null;
}

function setUsdPrice(meta, priceUsd, source) {
  meta.priceUsd = priceUsd;
  meta.priceSource = source;
  meta.cost = priceUsd;
  meta.currency = 'USD';
}

function applyUsdEstimateFallback(meta) {
  if (meta.priceUsd != null) return;
  const estCur = (meta.estimatedCurrency || 'USD').toUpperCase();
  if (
    estCur === 'USD' &&
    typeof meta.estimatedCost === 'number' &&
    Number.isFinite(meta.estimatedCost)
  ) {
    meta.priceUsd = meta.estimatedCost;
    meta.priceSource = 'estimate';
    meta.cost = meta.estimatedCost;
    meta.currency = 'USD';
  }
}

export function formatGenerationCostLabel(meta, { freeLabel = '—' } = {}) {
  if (!meta) return freeLabel;

  if (typeof meta.priceUsd === 'number' && Number.isFinite(meta.priceUsd)) {
    const prefix = meta.priceSource === 'estimate' ? '~' : '';
    return `${prefix}$${meta.priceUsd.toFixed(4)} USD`;
  }

  if (typeof meta.cost === 'number' && Number.isFinite(meta.cost)) {
    if (meta.currency === 'CREDITS') {
      return `${meta.cost} cr`;
    }
    if ((meta.currency || 'USD').toUpperCase() === 'USD') {
      const prefix = meta.priceSource === 'estimate' ? '~' : '';
      return `${prefix}$${meta.cost.toFixed(4)} USD`;
    }
    const cur = meta.currency || 'USD';
    const value = meta.cost.toFixed(4);
    return `${value} ${cur}`;
  }

  if (typeof meta.estimatedCost === 'number' && Number.isFinite(meta.estimatedCost)) {
    const cur = (meta.estimatedCurrency || 'USD').toUpperCase();
    if (cur === 'USD') {
      return `~$${meta.estimatedCost.toFixed(4)} USD`;
    }
    return `~${meta.estimatedCost.toFixed(4)} ${cur}`;
  }

  return freeLabel;
}
