const RUNPOD_API_BASE = 'https://api.runpod.ai/v2';

function readRunPodApiKey() {
  const raw = process.env.RUNPOD_API_KEY || '';
  const trimmed = String(raw).trim();
  return trimmed || null;
}

export function getRunPodComfyVideoEndpointId() {
  return (
    process.env.RUNPOD_COMFY_VIDEO_ENDPOINT_ID ||
    process.env.OGI_RUNPOD_COMFY_VIDEO_ENDPOINT_ID ||
    'stfrj1kkcehzdh'
  );
}

/**
 * @param {unknown} output
 * @returns {string | null}
 */
export function extractComfyVideoUrl(output) {
  if (!output) return null;
  if (typeof output === 'string') {
    if (output.startsWith('http://') || output.startsWith('https://')) return output;
    if (output.startsWith('data:video')) return output;
    return null;
  }
  if (typeof output !== 'object') return null;
  const record = output;
  const direct =
    record.url ||
    record.video_url ||
    record.videoUrl ||
    record.output_url ||
    record.outputUrl;
  if (typeof direct === 'string') return direct;

  const videos = record.videos || record.video || record.outputs;
  if (Array.isArray(videos) && videos.length > 0) {
    const first = videos[0];
    if (typeof first === 'string') return first;
    if (first?.url) return first.url;
    if (first?.data && typeof first.data === 'string') {
      const data = first.data;
      if (data.startsWith('http')) return data;
      return `data:${first.type || 'video/mp4'};base64,${data}`;
    }
  }

  const images = record.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first.includes('.mp4')) return first;
    if (first?.url && String(first.url).includes('.mp4')) return first.url;
  }

  return null;
}

/**
 * @param {string} endpointId
 * @param {Record<string, unknown>} input
 * @param {{ timeoutMs?: number, pollIntervalMs?: number }} [options]
 */
export async function runComfyOnRunPod(endpointId, input, options = {}) {
  const apiKey = readRunPodApiKey();
  if (!apiKey) {
    throw new Error('runpod_missing_api_key');
  }

  const timeoutMs = options.timeoutMs ?? Number(process.env.OGI_RUNPOD_COMFY_TIMEOUT_MS || 1_800_000);
  const pollIntervalMs = options.pollIntervalMs ?? 3_000;

  const runResponse = await fetch(`${RUNPOD_API_BASE}/${endpointId}/run`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (!runResponse.ok) {
    const text = await runResponse.text();
    throw new Error(`runpod_run_failed:${runResponse.status}:${text.slice(0, 200)}`);
  }

  const runBody = await runResponse.json();
  const jobId = runBody.id;
  if (!jobId) {
    throw new Error('runpod_missing_job_id');
  }

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const statusResponse = await fetch(`${RUNPOD_API_BASE}/${endpointId}/status/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusResponse.ok) {
      const text = await statusResponse.text();
      throw new Error(`runpod_status_failed:${statusResponse.status}:${text.slice(0, 200)}`);
    }
    const statusBody = await statusResponse.json();
    const status = statusBody.status;
    if (status === 'COMPLETED') {
      return statusBody;
    }
    if (status === 'FAILED' || status === 'CANCELLED') {
      const err = statusBody.error || 'RunPod Comfy job failed';
      throw new Error(typeof err === 'string' ? err : JSON.stringify(err).slice(0, 500));
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error('runpod_comfy_timeout');
}

/**
 * @param {Record<string, unknown>} body
 * @param {{ workflow: string, mode: 't2v'|'i2v' }} spec
 */
export function buildRunPodComfyInput(body, spec) {
  const input = {
    workflow: spec.workflow,
    prompt: body.prompt,
    aspect_ratio: body.aspect_ratio || body.aspectRatio,
    duration: body.duration,
    resolution: body.resolution,
    seed: body.seed,
  };
  if (spec.mode === 'i2v') {
    input.image_url = body.image_url || body.imageUrl;
  }
  return input;
}
