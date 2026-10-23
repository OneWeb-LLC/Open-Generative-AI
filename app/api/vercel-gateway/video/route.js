import { NextResponse } from 'next/server';
import { experimental_generateVideo as generateVideo } from 'ai';
import { createGateway } from '@ai-sdk/gateway';
import {
  buildGatewayVideoCallOptions,
  resolveGatewayVideoModel,
} from '@/lib/ogi/vercel-video-models';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function createGatewayProvider(request) {
  const serverKey =
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_AI_GATEWAY_API_KEY || null;
  if (serverKey) {
    return createGateway({ apiKey: serverKey });
  }
  if (process.env.VERCEL === '1') {
    return createGateway();
  }
  const header =
    request.headers.get('x-ai-gateway-key') ||
    request.headers.get('x-api-key') ||
    request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) {
    return createGateway({ apiKey: header.slice(7).trim() });
  }
  if (header) {
    return createGateway({ apiKey: header.trim() });
  }
  return null;
}

export async function POST(request) {
  const gateway = createGatewayProvider(request);
  if (!gateway) {
    return NextResponse.json(
      {
        error: 'missing_gateway_key',
        message:
          'Set AI_GATEWAY_API_KEY on the server, deploy on Vercel (OIDC), or pass x-ai-gateway-key.',
      },
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

  const callOptions = buildGatewayVideoCallOptions(muapiModelId, gatewayModel, body);

  try {
    const started = Date.now();
    const result = await generateVideo({
      model: gateway.videoModel(gatewayModel),
      prompt,
      ...(callOptions.aspectRatio ? { aspectRatio: callOptions.aspectRatio } : {}),
      ...(callOptions.duration != null ? { duration: callOptions.duration } : {}),
      ...(callOptions.resolution ? { resolution: callOptions.resolution } : {}),
      ...(callOptions.generateAudio != null ? { generateAudio: callOptions.generateAudio } : {}),
      ...(callOptions.providerOptions ? { providerOptions: callOptions.providerOptions } : {}),
      poll: {
        intervalMs: 5000,
        timeoutMs: Number(process.env.OGI_VERCEL_VIDEO_POLL_TIMEOUT_MS || 600000),
      },
    });

    const video = result.video;
    if (!video?.base64 && !video?.uint8Array) {
      return NextResponse.json(
        { error: 'no_video_payload', gatewayModel, muapiModelId },
        { status: 502 },
      );
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
    console.error('[vercel-gateway/video]', { gatewayModel, muapiModelId, error });
    const authFailed =
      error?.statusCode === 401 ||
      error?.type === 'authentication_error' ||
      String(error?.message || '').includes('authentication');
    const status = authFailed ? 401 : 502;
    return NextResponse.json(
      {
        error: authFailed ? 'gateway_auth_failed' : 'generation_failed',
        message: authFailed
          ? 'AI Gateway auth failed. Set a valid AI_GATEWAY_API_KEY on this Vercel project (not your MuAPI workspace key in Settings).'
          : error?.message || 'Video generation failed',
        gatewayModel,
        muapiModelId,
        cause: error?.cause?.message || error?.data?.error?.message || null,
      },
      { status },
    );
  }
}
