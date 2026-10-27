import { muapiKeyHeaders } from "../muapiAuth.js";

const SUCCESS_STATUSES = new Set([
  "completed",
  "succeeded",
  "success",
  "complete",
  "done",
  "finished",
]);
const FAILURE_STATUSES = new Set(["failed", "error", "cancelled", "canceled"]);
const PENDING_STATUSES = new Set([
  "pending",
  "queued",
  "processing",
  "running",
  "in_progress",
  "in-progress",
  "started",
  "submitted",
]);

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function getGenerationErrorDetail(result) {
  if (typeof result?.error === "string") return result.error;
  if (typeof result?.error?.message === "string") return result.error.message;
  if (typeof result?.message === "string") return result.message;
  return "Unknown error";
}

function createGenerationError(result, requestId) {
  const error = new Error(`Generation failed: ${getGenerationErrorDetail(result)}`);
  error.requestId = requestId;
  error.generationResult = result;
  return error;
}

/**
 * Normalize MuAPI / gateway poll payloads to a single playable media URL when present.
 * @param {unknown} result
 * @returns {string | null}
 */
export function extractGenerationOutputUrl(result) {
  if (!result || typeof result !== "object") return null;
  const record = result;

  const outputs = record.outputs;
  if (Array.isArray(outputs) && outputs.length > 0) {
    const first = outputs[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (first && typeof first === "object") {
      for (const key of ["url", "video_url", "output_url", "media_url"]) {
        const value = first[key];
        if (typeof value === "string" && value.trim()) return value.trim();
      }
    }
  }

  if (typeof record.url === "string" && record.url.trim()) return record.url.trim();

  const output = record.output;
  if (output && typeof output === "object") {
    for (const key of ["url", "video_url", "output_url"]) {
      const value = output[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  if (typeof record.output_data === "string" && record.output_data.trim()) {
    return record.output_data.trim();
  }

  return null;
}

/**
 * @param {unknown} result
 * @returns {boolean}
 */
export function isGenerationResultComplete(result) {
  if (!result || typeof result !== "object") return false;

  const status = String(result.status ?? "").toLowerCase();
  if (FAILURE_STATUSES.has(status)) return false;
  if (SUCCESS_STATUSES.has(status)) return true;

  const outputUrl = extractGenerationOutputUrl(result);
  if (!outputUrl) return false;

  // Some providers return a media URL before flipping status off "processing".
  if (!status || PENDING_STATUSES.has(status)) return true;

  return true;
}

export function appendGenerationRefundNotice(message, error) {
  const cost = error?.generationResult?.cost;
  if (cost?.refunded !== true) return message;

  const credits = cost.amount_credits;
  const notice = Number.isFinite(credits)
    ? `Refunded ${credits} credit${credits === 1 ? "" : "s"}.`
    : "The generation cost was refunded.";
  return `${message} ${notice}`;
}

export async function pollForGenerationResult({
  baseUrl,
  requestId,
  apiKey,
  maxAttempts = 900,
  interval = 2000,
  onAuthRequired,
  fetchImpl = fetch,
}) {
  const pollUrl = `${baseUrl}/api/v1/predictions/${requestId}/result`;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await wait(interval);

    let response;
    try {
      response = await fetchImpl(pollUrl, {
        headers: { "Content-Type": "application/json", ...muapiKeyHeaders(apiKey) },
      });
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      continue;
    }

    if (!response.ok) {
      const detail = await response.text();
      const error = new Error(`Poll Failed: ${response.status} - ${detail.slice(0, 100)}`);
      error.requestId = requestId;

      if (response.status >= 500 && attempt < maxAttempts) continue;
      onAuthRequired?.(response.status, detail);
      throw error;
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      continue;
    }

    if (isGenerationResultComplete(result)) return result;

    const status = result.status?.toLowerCase();
    if (FAILURE_STATUSES.has(status)) throw createGenerationError(result, requestId);
  }

  const error = new Error(`Generation timed out after polling. Request ID: ${requestId}`);
  error.requestId = requestId;
  throw error;
}
