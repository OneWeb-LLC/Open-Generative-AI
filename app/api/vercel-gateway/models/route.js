import { NextResponse } from 'next/server';
import { gateway } from '@ai-sdk/gateway';
import { getVercelVideoCatalog } from '@/lib/ogi/vercel-video-models';

export const dynamic = 'force-dynamic';

export async function GET() {
  const catalog = getVercelVideoCatalog();
  try {
    const { models } = await gateway.getAvailableModels();
    const videoModels = models.filter((m) => m.modelType === 'video');
    return NextResponse.json({ catalog, gatewayVideoModels: videoModels });
  } catch (error) {
    return NextResponse.json({
      catalog,
      gatewayVideoModels: [],
      warning: error?.message || 'Could not list gateway models',
    });
  }
}
