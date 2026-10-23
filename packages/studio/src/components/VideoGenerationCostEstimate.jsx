"use client";

const PROVIDER_SHORT_LABELS = {
  "muapi-proxy": "MuAPI",
  "muapi-direct": "MuAPI",
  "oweb-backend": "OWeb API",
  custom: "Custom API",
  "vercel-ai-gateway": "Vercel AI Gateway",
  "comfy-runpod": "ComfyUI (RunPod)",
};

export default function VideoGenerationCostEstimate({
  status,
  label,
  apiProviderId,
  copy,
}) {
  if (!copy) return null;

  if (status === 'idle') return null;

  const providerName =
    PROVIDER_SHORT_LABELS[apiProviderId] || apiProviderId || copy.costEstimate.unknownProvider;

  if (status === 'loading') {
    return (
      <p className="text-[11px] text-white/45 text-right px-1 animate-pulse">
        {copy.costEstimate.loading}
      </p>
    );
  }

  if (status === 'unavailable') {
    return (
      <p
        className="text-[11px] text-white/35 text-right px-1"
        title={copy.costEstimate.unavailableTitle.replace('{provider}', providerName)}
      >
        {copy.costEstimate.unavailable}
      </p>
    );
  }

  if (status === 'ready' && label) {
    return (
      <p
        className="text-[11px] font-semibold text-[#22d3ee]/90 text-right px-1 tabular-nums"
        title={copy.costEstimate.readyTitle
          .replace('{provider}', providerName)
          .replace('{amount}', label)}
      >
        <span className="text-white/45 font-medium mr-1.5">{copy.costEstimate.label}</span>
        {label}
      </p>
    );
  }

  return null;
}
