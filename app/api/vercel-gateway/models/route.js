import { NextResponse } from 'next/server';
import { gateway } from '@ai-sdk/gateway';
import { getVercelVideoCatalog } from '@/lib/ogi/vercel-video-models';
import { formatGatewayVideoPriceSuffix } from '@/lib/ogi/gateway-video-capability';

export const dynamic = 'force-dynamic';

function serializeGatewayVideoModels(models) {
  const pricingByGatewayModelId = {};
  const gatewayVideoModels = [];

  for (const model of models) {
    if (model.modelType !== 'video') continue;
    const pricing = model.pricing ?? null;
    const priceSuffix = formatGatewayVideoPriceSuffix(pricing);
    gatewayVideoModels.push({
      id: model.id,
      name: model.name,
      description: model.description ?? null,
      pricing,
      priceSuffix,
    });
    if (priceSuffix) {
      pricingByGatewayModelId[model.id] = priceSuffix;
    }
  }

  return { gatewayVideoModels, pricingByGatewayModelId };
}

export async function GET() {
  const catalog = getVercelVideoCatalog();
  try {
    const { models } = await gateway.getAvailableModels();
    const { gatewayVideoModels, pricingByGatewayModelId } = serializeGatewayVideoModels(models);
    return NextResponse.json({ catalog, gatewayVideoModels, pricingByGatewayModelId });
  } catch (error) {
    return NextResponse.json({
      catalog,
      gatewayVideoModels: [],
      pricingByGatewayModelId: {},
      warning: error?.message || 'Could not list gateway models',
    });
  }
}
