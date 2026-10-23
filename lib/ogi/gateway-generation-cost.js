/**
 * Resolve USD price for a completed Vercel AI Gateway generation.
 * @param {import('@ai-sdk/gateway').GatewayProvider} gateway
 * @param {import('ai').GenerateVideoResult} result
 */
export async function resolveGatewayVideoPriceUsd(gateway, result) {
  const generationId = result?.providerMetadata?.gateway?.generationId;
  if (!generationId || typeof generationId !== 'string') {
    return null;
  }

  try {
    const info = await gateway.getGenerationInfo({ id: generationId });
    if (typeof info?.totalCost !== 'number' || !Number.isFinite(info.totalCost)) {
      return null;
    }
    return {
      priceUsd: info.totalCost,
      currency: 'USD',
      generationId,
      providerName: info.providerName ?? null,
      model: info.model ?? null,
      source: 'actual',
    };
  } catch (error) {
    console.warn('[gateway-generation-cost] getGenerationInfo failed', {
      generationId,
      message: error?.message,
    });
    return null;
  }
}
