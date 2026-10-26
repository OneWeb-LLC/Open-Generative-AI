"use client";

const PROVIDER_SHORT_LABELS = {
  "muapi-proxy": "MuAPI",
  "muapi-direct": "MuAPI",
  "oweb-backend": "OWeb API",
  custom: "Custom API",
  "vercel-ai-gateway": "Vercel AI Gateway",
  "comfy-runpod": "ComfyUI (RunPod)",
};

const DEFAULT_COST_COPY = {
  label: "Est.",
  loading: "Estimating…",
  unavailable: "—",
  unavailableTitle: "No cost estimate for {provider} with these settings",
  readyTitle: "Estimated cost via {provider}: {amount}",
  unknownProvider: "API provider",
  chipTitle: "Estimated generation cost",
};

/**
 * @param {{ status: string, label: string | null, apiProviderId: string, copy?: Record<string, unknown>, variant?: 'chip' | 'stacked' | 'button' }} props
 */
export default function VideoGenerationCostEstimate({
  status,
  label,
  apiProviderId,
  copy,
  variant = "chip",
}) {
  const costCopy = { ...DEFAULT_COST_COPY, ...(copy?.costEstimate || {}) };
  const providerName =
    PROVIDER_SHORT_LABELS[apiProviderId] || apiProviderId || costCopy.unknownProvider;

  const amount =
    status === "ready" && label
      ? label
      : status === "loading"
        ? costCopy.loading
        : costCopy.unavailable;

  const title =
    status === "ready" && label
      ? costCopy.readyTitle.replace("{provider}", providerName).replace("{amount}", label)
      : costCopy.unavailableTitle.replace("{provider}", providerName);

  if (variant === "button") {
    const buttonAmount =
      status === "ready" && label
        ? label
        : status === "loading"
          ? costCopy.loading
          : null;
    if (!buttonAmount) return null;
    return (
      <span
        className={`block text-[10px] font-semibold tabular-nums leading-tight text-[color:var(--ogi-accent-fg,#04121a)]/70 ${
          status === "loading" ? "animate-pulse opacity-80" : ""
        }`}
      >
        {buttonAmount}
      </span>
    );
  }

  const chipClass =
    variant === "stacked"
      ? "flex flex-col items-end gap-0.5 px-2 py-1 min-w-[7.5rem]"
      : "inline-flex items-center gap-2 px-3 h-[38px] rounded-md border shadow-inner whitespace-nowrap";

  const chipTone =
    status === "ready" && label
      ? "border-[#22d3ee]/35 bg-[#22d3ee]/10"
      : status === "loading"
        ? "border-white/10 bg-white/[0.04]"
        : "border-white/[0.08] bg-white/[0.03]";

  return (
    <div
      className={`${chipClass} ${chipTone}`}
      title={title}
      aria-live="polite"
      aria-label={`${costCopy.chipTitle}: ${amount}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
        {costCopy.label}
      </span>
      <span
        className={`tabular-nums font-bold ${
          status === "ready" && label ? "text-[#22d3ee] text-sm" : "text-white/55 text-xs"
        } ${status === "loading" ? "animate-pulse" : ""}`}
      >
        {amount}
      </span>
      {variant === "stacked" && (
        <span className="text-[9px] text-white/35 truncate max-w-[10rem]">{providerName}</span>
      )}
    </div>
  );
}
