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
  "absolute bottom-4 left-0 right-0 z-[100] mx-auto w-[min(100%,calc(100%-2rem))] max-w-4xl animate-fade-in-up pointer-events-auto px-0";

/* Surfaces/accents read --ogi-* from the OWeb host when embedded so Light,
   Dark (Google-neutral), and Cosmic themes stay coherent. Fallbacks keep the
   standalone MuAPI look. */
const DEFAULT_PANEL_CLASS =
  "w-full overflow-visible bg-[color:var(--ogi-panel-solid,var(--ogi-panel,rgba(32,33,36,0.96)))] backdrop-blur-xl rounded-[28px] border border-[color:var(--ogi-border,rgba(255,255,255,0.06))] p-3 sm:p-4 flex flex-col gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.22),0_12px_32px_-8px_rgba(0,0,0,0.45)]";

const DEFAULT_TEXTAREA_CLASS =
  "w-full bg-transparent border-none text-[color:var(--ogi-fg,#fff)] text-[15px] sm:text-sm placeholder:text-[color:var(--ogi-faint,rgba(255,255,255,0.38))] focus:outline-none focus:ring-0 resize-none px-0.5 pt-0.5 pb-1 leading-relaxed min-h-[40px] max-h-[150px] md:max-h-[220px] overflow-y-auto custom-scrollbar disabled:opacity-40";

const DEFAULT_ACTION_CLASS =
  "bg-[color:var(--ogi-accent,var(--primary,#1a73e8))] text-[color:var(--ogi-accent-solid-fg,var(--ogi-accent-fg,#fff))] px-5 py-2 rounded-full font-medium text-sm hover:brightness-[1.03] active:scale-[0.98] transition-[transform,filter] duration-150 flex items-center justify-center gap-1.5 shrink-0 border-0 shadow-none z-10 disabled:opacity-50 disabled:cursor-not-allowed";

const CONTROL_LAYOUT_CLASS =
  "h-8 flex items-center gap-1 rounded-full transition-colors duration-150 group whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ogi-accent-ring,rgba(255,255,255,0.12))] focus-visible:ring-offset-0";

const CONTROL_IDLE_CLASS =
  "text-[color:var(--ogi-muted,rgba(255,255,255,0.72))] bg-transparent hover:bg-[color:var(--ogi-control,rgba(255,255,255,0.06))] border border-transparent";

const CONTROL_ACTIVE_CLASS =
  "text-[color:var(--ogi-fg,#fff)] bg-[color:var(--ogi-control,rgba(255,255,255,0.08))] hover:bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.1))] border border-[color:var(--ogi-border,rgba(255,255,255,0.08))]";

const MEDIA_CONTROL_LAYOUT_CLASS =
  "w-10 h-10 shrink-0 rounded-full border transition-colors duration-150 flex items-center justify-center relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ogi-accent-ring,rgba(255,255,255,0.12))] focus-visible:ring-offset-0";

const DEFAULT_POPOVER_POSITION_CLASS =
  "absolute bottom-[calc(100%+12px)] left-0 z-[80]";

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
      ? "border-[color:var(--ogi-border-strong,var(--ogi-border))] bg-[color:var(--ogi-control-hover,rgba(255,255,255,0.1))]"
      : "border-[color:var(--ogi-border,rgba(255,255,255,0.08))] bg-transparent hover:bg-[color:var(--ogi-control,rgba(255,255,255,0.05))] hover:border-[color:var(--ogi-border,rgba(255,255,255,0.12))]",
    className,
  );
}

export const PROMPT_MEDIA_PREVIEW_CLASS =
  "relative w-10 h-10 shrink-0 rounded-full border border-[color:var(--ogi-border,rgba(255,255,255,0.1))] overflow-hidden shadow-md group";

export const PROMPT_CONTROL_LABEL_CLASS =
  "text-xs font-medium text-current opacity-80 group-hover:opacity-100 transition-opacity";

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
      if (!popover) return;
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
      if (bounds.top < top) {
        popover.style.height = `${Math.max(0, bounds.bottom - top)}px`;
      }
    };
    position();
    const popover = popoverRef.current;
    if (!popover) return;
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
      data-ogi-prompt-popover=""
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
      <div
        data-ogi-prompt-panel=""
        className={joinClasses(DEFAULT_PANEL_CLASS, panelClassName)}
      >
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
        "flex flex-row items-center gap-2 pt-1.5 mt-0.5 border-t border-[color:var(--ogi-border,rgba(255,255,255,0.05))] relative z-[2] min-w-0 overflow-visible",
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
        "flex items-center gap-1.5 relative flex-1 min-w-0 flex-wrap md:flex-nowrap overflow-visible",
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
      data-ogi-prompt-action=""
      className={joinClasses(DEFAULT_ACTION_CLASS, className)}
    >
      {children}
    </button>
  );
});
