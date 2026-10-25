"use client";

import { forwardRef, useEffect, useId, useRef } from "react";
import { PromptChevronIcon, PromptPopover, PromptTextarea } from "./PromptComposer.jsx";

function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AspectRatioGlyph({ ratio, className = "" }) {
  const [wRaw, hRaw] = String(ratio || "1:1").split(":");
  const w = Number(wRaw) || 1;
  const h = Number(hRaw) || 1;
  const max = 14;
  const scale = max / Math.max(w, h);
  const width = Math.max(6, Math.round(w * scale));
  const height = Math.max(6, Math.round(h * scale));
  return (
    <span
      className={joinClasses(
        "inline-flex items-center justify-center rounded-[3px] border-[1.5px] border-current opacity-80",
        className,
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

function ImageModeIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-4.5-4.5L7 20" />
    </svg>
  );
}

function VideoModeIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 10l4.55-2.27A1 1 0 0 1 21 8.64v6.72a1 1 0 0 1-1.45.91L15 14" />
      <rect x="3" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function PlusIcon({ className = "" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowSubmitIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

const SEGMENT_IDLE =
  "bg-[color:var(--ogi-control,rgba(255,255,255,0.04))] text-[color:var(--ogi-muted,rgba(255,255,255,0.55))] border border-transparent";
const SEGMENT_ACTIVE =
  "bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.12))] text-[color:var(--ogi-fg,#fff)] border border-[color:var(--ogi-border,rgba(255,255,255,0.08))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]";

export function FlowSegmentButton({
  children,
  selected = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      aria-pressed={selected}
      className={joinClasses(
        "min-h-11 flex-1 rounded-xl px-2 py-2.5 text-[13px] font-semibold transition-colors",
        "flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
        selected ? SEGMENT_ACTIVE : SEGMENT_IDLE,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FlowSegmentRow({ children, className = "" }) {
  return (
    <div className={joinClasses("flex items-stretch gap-2", className)}>{children}</div>
  );
}

/**
 * Google Flow–style mobile prompt: floating prompt card + expandable options sheet.
 */
export const MobileFlowPrompt = forwardRef(function MobileFlowPrompt(
  {
    mediaType = "image",
    onMediaTypeChange,
    prompt,
    onPromptChange,
    placeholder = "What do you want to make?",
    aspectRatio,
    aspectRatios = [],
    onAspectRatioChange,
    quantity = 1,
    quantities = [1, 2, 3, 4],
    onQuantityChange,
    showQuantity = true,
    duration,
    durations = [],
    onDurationChange,
    modelLabel,
    modelMenuOpen = false,
    onModelToggle,
    modelMenu = null,
    creditText,
    creditHref,
    onCreditClick,
    onAttach,
    attachDisabled = false,
    attachControl = null,
    onGenerate,
    generating = false,
    generateDisabled = false,
    optionsOpen = false,
    onOptionsOpenChange,
    mediaSlot = null,
    className = "",
  },
  forwardedRef,
) {
  const optionsId = useId();
  const sheetRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!optionsOpen) return undefined;
    const onPointerDown = (event) => {
      const root = sheetRef.current;
      if (!root) return;
      if (root.contains(event.target)) return;
      onOptionsOpenChange?.(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") onOptionsOpenChange?.(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [optionsOpen, onOptionsOpenChange]);

  const summaryParts = [
    mediaType === "video" ? "Video" : "Image",
    aspectRatio ? (
      <AspectRatioGlyph key="ar" ratio={aspectRatio} className="mx-0.5 opacity-90" />
    ) : null,
    showQuantity ? `x${quantity}` : null,
  ].filter(Boolean);

  return (
    <div
      ref={(node) => {
        sheetRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      data-ogi-prompt-composer=""
      data-ogi-mobile-flow-prompt=""
      className={joinClasses(
        "absolute bottom-4 left-0 right-0 z-[100] mx-auto w-full max-w-none pointer-events-auto px-0 flex flex-col gap-2",
        className,
      )}
    >
      <div
        className={joinClasses(
          "w-full rounded-[22px] border border-[color:var(--ogi-border,rgba(255,255,255,0.08))]",
          "bg-[color:var(--ogi-panel-solid,#1c1c1e)] shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
          "flex flex-col gap-3 p-3.5",
        )}
      >
        {mediaSlot}

        <PromptTextarea
          ref={textareaRef}
          value={prompt}
          onChange={onPromptChange}
          placeholder={placeholder}
          maxHeightMobile={120}
          maxHeightDesktop={120}
          onFocus={() => onOptionsOpenChange?.(true)}
          className={joinClasses(
            "min-h-[52px] text-[22px] leading-snug font-semibold tracking-[-0.02em]",
            "placeholder:text-[color:var(--ogi-faint,rgba(255,255,255,0.28))] placeholder:font-semibold",
          )}
        />

        <div className="flex items-center gap-2">
          {attachControl ?? (
            <button
              type="button"
              onClick={onAttach}
              disabled={attachDisabled || !onAttach}
              aria-label="Add reference"
              className={joinClasses(
                "h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors",
                "text-[color:var(--ogi-muted,rgba(255,255,255,0.7))] bg-[color:var(--ogi-control,rgba(255,255,255,0.06))]",
                "hover:bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.1))] disabled:opacity-40",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
              )}
            >
              <PlusIcon />
            </button>
          )}

          <div className="flex-1" />

          <button
            type="button"
            aria-expanded={optionsOpen}
            aria-controls={optionsId}
            onClick={() => onOptionsOpenChange?.(!optionsOpen)}
            className={joinClasses(
              "h-10 max-w-[58%] rounded-full px-3.5 inline-flex items-center gap-1.5",
              "bg-[color:var(--ogi-control,rgba(255,255,255,0.08))] text-[color:var(--ogi-fg,#fff)]",
              "text-[13px] font-semibold tracking-tight",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
              optionsOpen && "ring-1 ring-white/15",
            )}
          >
            <span className="truncate inline-flex items-center gap-1">
              {summaryParts.map((part, index) =>
                typeof part === "string" ? (
                  <span key={`${part}-${index}`}>{part}</span>
                ) : (
                  part
                ),
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={generateDisabled || generating}
            aria-label={generating ? "Generating" : "Generate"}
            className={joinClasses(
              "h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all",
              "bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.14))] text-[color:var(--ogi-fg,#fff)]",
              "hover:bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.2))] active:scale-[0.97]",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
            )}
          >
            {generating ? (
              <span className="animate-spin text-base leading-none">◌</span>
            ) : (
              <ArrowSubmitIcon />
            )}
          </button>
        </div>
      </div>

      {optionsOpen && (
        <div
          id={optionsId}
          data-ogi-mobile-flow-sheet=""
          className={joinClasses(
            "w-full rounded-[22px] border border-[color:var(--ogi-border,rgba(255,255,255,0.08))]",
            "bg-[color:var(--ogi-panel-solid,#1c1c1e)] shadow-[0_16px_48px_rgba(0,0,0,0.5)]",
            "flex flex-col gap-3 p-3.5 animate-fade-in-up",
          )}
        >
          {creditText && (
            <p className="text-[12px] text-[color:var(--ogi-faint,rgba(255,255,255,0.45))] px-0.5">
              Generating will use{" "}
              {creditHref || onCreditClick ? (
                <button
                  type="button"
                  onClick={onCreditClick}
                  className="underline underline-offset-2 text-[color:var(--ogi-muted,rgba(255,255,255,0.72))] font-medium"
                >
                  {creditText}
                </button>
              ) : (
                <span className="underline underline-offset-2 text-[color:var(--ogi-muted,rgba(255,255,255,0.72))] font-medium">
                  {creditText}
                </span>
              )}
            </p>
          )}

          {onMediaTypeChange && (
            <FlowSegmentRow>
              <FlowSegmentButton
                selected={mediaType === "image"}
                onClick={() => onMediaTypeChange("image")}
              >
                <ImageModeIcon />
                Image
              </FlowSegmentButton>
              <FlowSegmentButton
                selected={mediaType === "video"}
                onClick={() => onMediaTypeChange("video")}
              >
                <VideoModeIcon />
                Video
              </FlowSegmentButton>
            </FlowSegmentRow>
          )}

          {aspectRatios.length > 0 && (
            <FlowSegmentRow className={aspectRatios.length > 4 ? "gap-1.5" : undefined}>
              {aspectRatios.map((ratio) => (
                <FlowSegmentButton
                  key={ratio}
                  selected={aspectRatio === ratio}
                  onClick={() => onAspectRatioChange?.(ratio)}
                  className={joinClasses(
                    "flex-col gap-1.5 min-h-[3.25rem] px-1.5",
                    aspectRatios.length > 4 && "text-[11px]",
                  )}
                >
                  <AspectRatioGlyph ratio={ratio} />
                  <span>{ratio}</span>
                </FlowSegmentButton>
              ))}
            </FlowSegmentRow>
          )}

          {showQuantity && quantities.length > 0 && (
            <FlowSegmentRow>
              {quantities.map((count) => (
                <FlowSegmentButton
                  key={count}
                  selected={quantity === count}
                  onClick={() => onQuantityChange?.(count)}
                >
                  x{count}
                </FlowSegmentButton>
              ))}
            </FlowSegmentRow>
          )}

          {durations.length > 0 && (
            <FlowSegmentRow>
              {durations.map((value) => (
                <FlowSegmentButton
                  key={value}
                  selected={Number(duration) === Number(value)}
                  onClick={() => onDurationChange?.(value)}
                >
                  {value}s
                </FlowSegmentButton>
              ))}
            </FlowSegmentRow>
          )}

          {modelLabel && (
            <div className="relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onModelToggle?.();
                }}
                className={joinClasses(
                  "w-full min-h-12 rounded-xl px-3.5 py-3 flex items-center justify-between gap-3",
                  "bg-[color:var(--ogi-control,rgba(255,255,255,0.06))] text-[color:var(--ogi-fg,#fff)]",
                  "text-[14px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
                  modelMenuOpen && SEGMENT_ACTIVE,
                )}
              >
                <span className="truncate text-left">{modelLabel}</span>
                <PromptChevronIcon className="opacity-70" />
              </button>
              {modelMenuOpen && modelMenu && (
                <PromptPopover
                  onClick={(event) => event.stopPropagation()}
                  positionClassName="absolute bottom-[calc(100%+10px)] left-0 right-0 z-[90]"
                  className="w-full max-h-[55vh] !min-w-0"
                >
                  {modelMenu}
                </PromptPopover>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default MobileFlowPrompt;
