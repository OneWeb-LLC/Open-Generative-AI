"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

const DEFAULT_POSITION_CLASS =
  "absolute bottom-4 w-full max-w-[95%] lg:max-w-4xl z-30 animate-fade-in-up";

/* Surfaces/accents read --ogi-* from the OWeb host when embedded so Light,
   Dark (Google-neutral), and Cosmic themes stay coherent. Fallbacks keep the
   standalone MuAPI look. */
const DEFAULT_PANEL_CLASS =
  "w-full bg-[color:var(--ogi-panel,rgba(15,15,18,0.92))] backdrop-blur-2xl rounded-2xl border border-[color:var(--ogi-border,rgba(255,255,255,0.08))] p-2.5 sm:p-3 flex flex-col gap-2 shadow-[var(--ogi-shadow,0_12px_40px_rgba(0,0,0,0.45))]";

const DEFAULT_TEXTAREA_CLASS =
  "w-full bg-transparent border-none text-[color:var(--ogi-fg,#fff)] text-sm placeholder:text-[color:var(--ogi-faint,rgba(255,255,255,0.28))] focus:outline-none resize-none pt-0.5 leading-relaxed min-h-[32px] max-h-[150px] md:max-h-[220px] overflow-y-auto custom-scrollbar disabled:opacity-40";

const DEFAULT_ACTION_CLASS =
  "bg-[color:var(--ogi-accent,#22d3ee)] text-[color:var(--ogi-accent-fg,#04121a)] px-4 py-1.5 rounded-full font-semibold text-xs hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-[0_4px_16px_var(--ogi-accent-soft,rgba(34,211,238,0.18))] border border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.12))] z-10 disabled:opacity-50 disabled:cursor-not-allowed";

const CONTROL_LAYOUT_CLASS =
  "h-[30px] flex items-center gap-1.5 rounded-lg transition-all border group whitespace-nowrap shadow-inner focus:outline-none focus-visible:border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.45))] focus-visible:ring-1 focus-visible:ring-[color:var(--ogi-accent-ring,rgba(34,211,238,0.3))]";

const CONTROL_IDLE_CLASS =
  "text-[color:var(--ogi-fg,#fff)] bg-[color:var(--ogi-control,rgba(22,22,26,0.6))] hover:bg-[color:var(--ogi-control-hover,rgba(32,32,38,0.8))] border-[color:var(--ogi-border,rgba(255,255,255,0.06))]";

const CONTROL_ACTIVE_CLASS =
  "text-[color:var(--ogi-accent,#22d3ee)] bg-[color:var(--ogi-accent-soft,rgba(34,211,238,0.1))] hover:bg-[color:var(--ogi-accent-soft,rgba(34,211,238,0.15))] border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.25))]";

const MEDIA_CONTROL_LAYOUT_CLASS =
  "w-10 h-10 shrink-0 rounded-full border transition-all flex items-center justify-center relative overflow-hidden group focus:outline-none focus-visible:border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.45))] focus-visible:ring-1 focus-visible:ring-[color:var(--ogi-accent-ring,rgba(34,211,238,0.3))]";

const DEFAULT_POPOVER_POSITION_CLASS =
  "absolute bottom-[calc(100%+12px)] left-0 z-50";

const DEFAULT_POPOVER_CLASS =
  "rounded-xl p-3.5 shadow-[var(--ogi-shadow,0_10px_40px_rgba(0,0,0,0.8))] border border-[color:var(--ogi-border,rgba(255,255,255,0.08))] bg-[color:var(--ogi-panel-solid,#0c0c0f)] backdrop-blur-2xl min-w-[160px] max-h-[40vh] overflow-y-auto custom-scrollbar";

function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function promptControlClassName({
  active = false,
  compact = false,
  iconOnly = false,
  className = "",
} = {}) {
  return joinClasses(
    CONTROL_LAYOUT_CLASS,
    iconOnly
      ? "w-[30px] px-0 justify-center"
      : compact
        ? "px-2.5"
        : "px-3",
    active ? CONTROL_ACTIVE_CLASS : CONTROL_IDLE_CLASS,
    className,
  );
}

export function promptMediaButtonClassName({
  active = false,
  className = "",
} = {}) {
  return joinClasses(
    MEDIA_CONTROL_LAYOUT_CLASS,
    active
      ? "border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.6))] bg-[color:var(--ogi-accent-soft,rgba(34,211,238,0.05))] hover:border-[color:var(--ogi-accent,#22d3ee)]"
      : "border-[color:var(--ogi-border,rgba(255,255,255,0.06))] bg-[color:var(--ogi-control,rgba(255,255,255,0.03))] hover:bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.06))] hover:border-[color:var(--ogi-accent-ring,rgba(34,211,238,0.4))]",
    className,
  );
}

export const PROMPT_MEDIA_PREVIEW_CLASS =
  "relative w-10 h-10 shrink-0 rounded-full border border-[color:var(--ogi-border,rgba(255,255,255,0.1))] overflow-hidden shadow-md group";

export const PROMPT_CONTROL_LABEL_CLASS =
  "text-xs font-semibold text-current opacity-70 group-hover:text-[color:var(--ogi-accent,#22d3ee)] group-hover:opacity-100 transition-all";

export function PromptChevronIcon({ className = "" }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={joinClasses(
        "text-current opacity-[0.45] group-hover:opacity-100 flex-shrink-0 transition-opacity",
        className,
      )}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PromptAspectRatioIcon({ className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={joinClasses("text-current opacity-[0.45] flex-shrink-0", className)}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  );
}

export function PromptDurationIcon({ className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={joinClasses("text-current opacity-[0.45] flex-shrink-0", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PromptQualityIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={joinClasses("text-current opacity-70 flex-shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M6.5 3.5h11L22 9 12 21 2 9l4.5-5.5Z" />
      <path d="M2 9h20" />
      <path d="m6.5 3.5 3 5.5L12 21" />
      <path d="m17.5 3.5-3 5.5L12 21" />
    </svg>
  );
}

export const PromptPopover = forwardRef(function PromptPopover(
  {
    children,
    className = "",
    positionClassName = DEFAULT_POPOVER_POSITION_CLASS,
    fitViewport = false,
    solid = false,
    ...props
  },
  ref,
) {
  const popoverRef = useRef(null);
  useImperativeHandle(ref, () => popoverRef.current);
  useLayoutEffect(() => {
    if (!fitViewport) return;
    const position = () => {
      const popover = popoverRef.current;
      popover.style.translate = "";
      popover.style.height = "";
      let left = 16;
      let right = window.innerWidth - 16;
      let top = 16;
      for (let parent = popover.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        const clipsX = /auto|scroll|hidden|clip/.test(style.overflowX);
        const clipsY = /auto|scroll|hidden|clip/.test(style.overflowY);
        if (!clipsX && !clipsY) continue;
        const bounds = parent.getBoundingClientRect();
        if (clipsX) {
          left = Math.max(left, bounds.left + 16);
          right = Math.min(right, bounds.right - 16);
        }
        if (clipsY) top = Math.max(top, bounds.top + 16);
      }
      const bounds = popover.getBoundingClientRect();
      const shift = Math.max(left - bounds.left, Math.min(0, right - bounds.right));
      popover.style.translate = `${shift}px 0`;
      if (bounds.top < top) popover.style.height = `${Math.max(0, bounds.bottom - top)}px`;
    };
    position();
    const popover = popoverRef.current;
    popover.addEventListener("toggle", position, true);
    window.addEventListener("resize", position);
    return () => {
      popover.removeEventListener("toggle", position, true);
      window.removeEventListener("resize", position);
    };
  }, [fitViewport, children]);
  return (
    <div
      {...props}
      ref={popoverRef}
      className={joinClasses(
        positionClassName,
        DEFAULT_POPOVER_CLASS,
        solid
          ? "bg-[color:var(--ogi-panel-solid,#0c0c0f)]"
          : "bg-[color:var(--ogi-panel,rgba(12,12,15,0.95))]",
        className,
      )}
    >
      {children}
    </div>
  );
});

export function PromptPopoverHeader({ children, className = "" }) {
  return (
    <div
      className={joinClasses(
        "text-[11px] font-semibold text-[color:var(--ogi-faint,rgba(255,255,255,0.35))] uppercase tracking-wider pb-2 border-b border-[color:var(--ogi-border,rgba(255,255,255,0.05))] mb-2 px-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PromptMenuList({ children, className = "" }) {
  return (
    <div role="menu" className={joinClasses("flex flex-col gap-1", className)}>
      {children}
    </div>
  );
}

export function PromptMenuItem({
  children,
  description,
  wrapDescription = false,
  selected = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      aria-checked={selected}
      role="menuitemradio"
      className={joinClasses(
        "w-full min-h-10 flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all group/menu-item",
        "text-xs font-semibold text-[color:var(--ogi-muted,rgba(255,255,255,0.7))] hover:bg-[color:var(--ogi-accent-soft,rgba(34,211,238,0.1))] hover:text-[color:var(--ogi-accent,#22d3ee)] focus:outline-none focus-visible:bg-[color:var(--ogi-accent-soft,rgba(34,211,238,0.1))] focus-visible:text-[color:var(--ogi-accent,#22d3ee)]",
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block truncate">{children}</span>
        {description && (
          <span className={joinClasses(
            "block font-medium mt-0.5",
            wrapDescription
              ? "text-[10px] leading-relaxed whitespace-normal text-[color:var(--ogi-muted,rgba(255,255,255,0.55))] group-hover/menu-item:text-[color:var(--ogi-fg,rgba(255,255,255,0.7))]"
              : "text-[9px] text-[color:var(--ogi-faint,rgba(255,255,255,0.35))] truncate group-hover/menu-item:text-[color:var(--ogi-muted,rgba(255,255,255,0.5))]",
          )}>
            {description}
          </span>
        )}
      </span>
      {selected && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          className="flex-shrink-0 text-[color:var(--ogi-accent,#22d3ee)]"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

export function PromptSegmentedControl({ children, className = "" }) {
  return (
    <div
      className={joinClasses(
        "inline-flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-full p-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PromptSegmentOption({
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
        "min-h-7 px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ogi-accent-ring,rgba(34,211,238,0.4))]",
        selected
          ? "bg-[color:var(--ogi-accent,#22d3ee)] text-[color:var(--ogi-accent-fg,#04121a)] shadow-md shadow-[color:var(--ogi-accent-soft,rgba(34,211,238,0.2))]"
          : "text-[color:var(--ogi-faint,rgba(255,255,255,0.4))] hover:text-[color:var(--ogi-muted,rgba(255,255,255,0.7))]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PromptComposer({
  children,
  className = "",
  panelClassName = "",
  positionClassName = DEFAULT_POSITION_CLASS,
  style = { animationDelay: "0.2s" },
}) {
  return (
    <div
      data-ogi-prompt-composer=""
      className={joinClasses(positionClassName, className)}
      style={style}
    >
      <div className={joinClasses(DEFAULT_PANEL_CLASS, panelClassName)}>
        {children}
      </div>
    </div>
  );
}

export const PromptTextarea = forwardRef(function PromptTextarea(
  {
    value,
    onChange,
    onInput,
    className = "",
    maxHeightMobile = 150,
    maxHeightDesktop = 250,
    rows = 1,
    ...props
  },
  forwardedRef,
) {
  const internalRef = useRef(null);

  useImperativeHandle(forwardedRef, () => internalRef.current);

  const resize = useCallback(
    (element = internalRef.current) => {
      if (!element) return;

      element.style.height = "auto";
      const maxHeight =
        window.innerWidth < 768 ? maxHeightMobile : maxHeightDesktop;
      element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    },
    [maxHeightDesktop, maxHeightMobile],
  );

  useEffect(() => {
    resize();
  }, [resize, value]);

  const handleChange = (event) => {
    onChange?.(event);
    resize(event.currentTarget);
  };

  const handleInput = (event) => {
    onInput?.(event);
    resize(event.currentTarget);
  };

  return (
    <textarea
      {...props}
      ref={internalRef}
      value={value}
      onChange={handleChange}
      onInput={handleInput}
      rows={rows}
      className={joinClasses(DEFAULT_TEXTAREA_CLASS, className)}
    />
  );
});

export function PromptFooter({ children, className = "" }) {
  return (
    <div
      className={joinClasses(
        "flex flex-row items-center gap-2 pt-2 border-t border-[color:var(--ogi-border,rgba(255,255,255,0.04))] relative min-w-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const PromptControls = forwardRef(function PromptControls(
  { children, className = "" },
  ref,
) {
  return (
    <div
      ref={ref}
      data-ogi-prompt-controls=""
      className={joinClasses(
        "flex items-center gap-1.5 relative flex-1 min-w-0 flex-nowrap overflow-x-auto no-scrollbar",
        className,
      )}
    >
      {children}
    </div>
  );
});

export const PromptAction = forwardRef(function PromptAction(
  { children, className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={joinClasses(DEFAULT_ACTION_CLASS, className)}
    >
      {children}
    </button>
  );
});
