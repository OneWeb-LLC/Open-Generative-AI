"use client";

import { useEffect, useState } from "react";

/** Matches OWeb compact shell / studio mobile composer clearance (max-width: 1023px). */
export const COMPACT_STUDIO_LAYOUT_QUERY = "(max-width: 1023px)";

export default function useCompactStudioLayout() {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(COMPACT_STUDIO_LAYOUT_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const media = window.matchMedia(COMPACT_STUDIO_LAYOUT_QUERY);
    const onChange = () => setCompact(media.matches);
    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return compact;
}
