import { NextResponse } from 'next/server';
import { experimental_generateVideo as generateVideo } from 'ai';
import { resolveGatewayVideoModel } from '@/lib/ogi/vercel-video-models';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function resolveGatewayApiKey(request) {
  const header = request.headers.get('x-api-key') || request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();
  if (header) return header.trim();
  return process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY || null;
}

function aspectRatioFromParams(aspectRatio) {
  if (!aspectRatio || aspectRatio === 'auto') return undefined;
  return aspectRatio;
}

export async function POST(request) {
  const gatewayKey = resolveGatewayApiKey(request);
  if (!gatewayKey) {
    return NextResponse.json(
      { error: 'missing_gateway_key', message: 'Set AI_GATEWAY_API_KEY on the server or pass x-api-key.' },
      { status: 401 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const muapiModelId = body.model;
  const gatewayModel = body.gatewayModel || resolveGatewayVideoModel(muapiModelId);
  const promptText = String(body.prompt || '').trim();
  const imageUrl = body.image_url || body.imageUrl;

  if (!gatewayModel) {
    return NextResponse.json({ error: 'missing_model' }, { status: 400 });
  }
  if (!promptText && !imageUrl) {
    return NextResponse.json({ error: 'missing_prompt' }, { status: 400 });
  }

  const prompt = imageUrl
    ? { text: promptText || 'Animate this image', image: imageUrl }
    : promptText;

  const aspectRatio = aspectRatioFromParams(body.aspect_ratio || body.aspectRatio);
  const duration = body.duration != null ? Number(body.duration) : undefined;
  const resolution = body.resolution;

  try {
    const started = Date.now();
    const result = await generateVideo({
      model: gatewayModel,
      prompt,
      ...(aspectRatio ? { aspectRatio } : {}),
      ...(Number.isFinite(duration) ? { duration } : {}),
      ...(resolution ? { resolution } : {}),
      headers: {
        Authorization: `Bearer ${gatewayKey}`,
      },
      poll: {
        intervalMs: 5000,
        timeoutMs: Number(process.env.OGI_VERCEL_VIDEO_POLL_TIMEOUT_MS || 600000),
      },
    });

    const video = result.video;
    if (!video?.base64 && !video?.uint8Array) {
      return NextResponse.json({ error: 'no_video_payload' }, { status: 502 });
    }

    const mediaType = video.mediaType || 'video/mp4';
    let base64 = video.base64;
    if (!base64 && video.uint8Array) {
      base64 = Buffer.from(video.uint8Array).toString('base64');
    }

    const metadata = {
      provider: 'vercel-ai-gateway',
      model: muapiModelId || gatewayModel,
      gatewayModel,
      durationMs: Date.now() - started,
      warnings: result.warnings ?? [],
      providerMetadata: result.providerMetadata ?? null,
      responses: Array.isArray(result.responses)
        ? result.responses.map((r) => ({
            timestamp: r.timestamp,
            modelId: r.modelId,
          }))
        : [],
    };

    const dataUrl = `data:${mediaType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      base64,
      mediaType,
      metadata,
      gatewayModel,
      model: muapiModelId || gatewayModel,
    });
  } catch (error) {
    console.error('[vercel-gateway/video]', error);
    return NextResponse.json(
      {
        error: 'generation_failed',
        message: error?.message || 'Video generation failed',
      },
      { status: 502 },
    );
  }
}
