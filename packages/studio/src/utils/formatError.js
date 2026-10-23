/**
 * Format API and studio error messages into clean, user-friendly strings.
 */
export function formatErrorMessage(err, fallback = "Generation failed") {
  if (!err) return fallback;
  let message = typeof err === 'string' ? err : (err.message || fallback);

  // If message contains JSON payload (e.g. `API Request Failed: 402 Payment Required - {...}`)
  if (message.includes('{') && message.includes('}')) {
    try {
      const jsonStart = message.indexOf('{');
      const jsonStr = message.slice(jsonStart);
      const data = JSON.parse(jsonStr);
      if (data.detail && typeof data.detail === 'string') {
        return data.detail;
      }
      if (data.error?.message && typeof data.error.message === 'string') {
        return data.error.message;
      }
      if (data.message && typeof data.message === 'string') {
        return data.message;
      }
    } catch {
      // Ignore JSON parse error
    }
  }

  // Handle common HTTP error codes
  if (message.includes('402') || message.includes('INSUFFICIENT_CREDITS') || message.toLowerCase().includes('insufficient credits')) {
    return "Insufficient credits. Please top up your wallet.";
  }
  if (
    message.includes('gateway_auth_failed') ||
    message.includes('AI Gateway auth failed') ||
    message.includes('AI_GATEWAY_API_KEY')
  ) {
    return "Vercel AI Gateway auth failed. Set a valid AI_GATEWAY_API_KEY on this Vercel project (not the MuAPI key in Settings).";
  }
  if (message.includes("Comfy RunPod") || message.includes("runpod_not_configured")) {
    return "Comfy on RunPod failed. Ensure RUNPOD_API_KEY and the Comfy endpoint are set on the server, then retry.";
  }
  if (message.includes('Cannot find module \'undici\'') || message.includes('Failed to download')) {
    return "Video was generated but could not be retrieved from the provider. Retry in a moment or switch to MuAPI (satellite proxy) in Settings.";
  }
  if (message.includes('401') || message.includes('403')) {
    return "Authentication failed. Please check your account session or API key.";
  }
  if (message.includes('429')) {
    return "Too many requests. Please wait a moment and try again.";
  }

  // Strip technical prefix like "API Request Failed: 500 Internal Server Error -"
  message = message.replace(/^API Request Failed: \d+ [^-]+ - /, '');

  return message.length > 150 ? message.slice(0, 147) + '...' : message;
}
