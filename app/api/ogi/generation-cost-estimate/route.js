import { NextResponse } from 'next/server';
import {
  estimateConfiguredVideoCost,
  isLocalCostEstimateProvider,
} from '@/lib/ogi/generation-cost-estimate';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const providerId = String(body.providerId || body.provider || '').trim();
  if (!providerId) {
    return NextResponse.json({ error: 'missing_provider' }, { status: 400 });
  }

  if (!isLocalCostEstimateProvider(providerId)) {
    return NextResponse.json(
      {
        error: 'unsupported_provider',
        message: 'Use MuAPI estimate-cost for MuAPI providers.',
      },
      { status: 400 },
    );
  }

  const estimate = estimateConfiguredVideoCost({
    providerId,
    modelId: body.modelId || body.model,
    gatewayModel: body.gatewayModel,
    duration: body.duration != null ? Number(body.duration) : undefined,
    resolution: body.resolution,
    generateAudio: body.generateAudio === true || body.generate_audio === true,
  });

  if (!estimate) {
    return NextResponse.json({ error: 'estimate_unavailable' }, { status: 404 });
  }

  return NextResponse.json(estimate);
}
