import { NextResponse } from 'next/server';
import { resolveComfyVideoModel } from '@/lib/ogi/comfy-video-models';
import {
  buildRunPodComfyInput,
  extractComfyVideoUrl,
  getRunPodComfyVideoEndpointId,
  runComfyOnRunPod,
} from '@/lib/ogi/runpod-comfy';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(request) {
  if (!process.env.RUNPOD_API_KEY?.trim()) {
    return NextResponse.json(
      {
        error: 'runpod_not_configured',
        message: 'Set RUNPOD_API_KEY on this Vercel project (team RunPod API key).',
      },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const studioModelId = body.model;
  const imageMode = Boolean(body.image_url || body.imageUrl);
  const mode = imageMode ? 'i2v' : 't2v';
  const spec = resolveComfyVideoModel(studioModelId, mode);
  if (!spec) {
    return NextResponse.json(
      { error: 'unknown_model', message: `No Comfy mapping for model ${studioModelId}` },
      { status: 400 },
    );
  }

  if (!String(body.prompt || '').trim() && mode === 't2v') {
    return NextResponse.json({ error: 'prompt_required' }, { status: 400 });
  }

  if (mode === 'i2v' && !body.image_url && !body.imageUrl) {
    return NextResponse.json({ error: 'image_required' }, { status: 400 });
  }

  const endpointId = getRunPodComfyVideoEndpointId();
  const input = buildRunPodComfyInput(body, { workflow: spec.workflow, mode });

  try {
    const result = await runComfyOnRunPod(endpointId, input, {
      timeoutMs: Number(process.env.OGI_RUNPOD_COMFY_TIMEOUT_MS || 1_800_000),
    });
    const videoUrl = extractComfyVideoUrl(result.output);
    if (!videoUrl) {
      return NextResponse.json(
        {
          error: 'comfy_no_video',
          message: 'Comfy finished but no video URL was returned.',
          runpodJobId: result.id,
        },
        { status: 502 },
      );
    }

    let responseUrl = videoUrl;
    if (videoUrl.startsWith('data:video') || (videoUrl.startsWith('data:') && !videoUrl.startsWith('http'))) {
      responseUrl = videoUrl;
    } else if (!videoUrl.startsWith('http')) {
      responseUrl = videoUrl;
    }

    return NextResponse.json({
      url: responseUrl,
      model: spec.id,
      comfyWorkflow: spec.workflow,
      metadata: {
        provider: 'comfy-runpod',
        requestId: result.id,
        executionTime: result.executionTime,
        delayTime: result.delayTime,
        endpointId,
      },
    });
  } catch (error) {
    const message = error?.message || 'Comfy RunPod generation failed';
    const status = message.includes('runpod_missing_api_key') ? 503 : 502;
    return NextResponse.json(
      {
        error: 'comfy_runpod_failed',
        message,
        studioModelId,
        comfyWorkflow: spec.workflow,
      },
      { status },
    );
  }
}
