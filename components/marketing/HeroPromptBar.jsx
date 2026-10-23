'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroPromptBar({ placeholder, buttonLabel, studioHref }) {
  const router = useRouter();
  const [value, setValue] = useState('');

  function openStudio() {
    const trimmed = value.trim();
    const url = trimmed
      ? `${studioHref}?prompt=${encodeURIComponent(trimmed)}`
      : studioHref;
    router.push(url);
  }

  return (
    <div className="mt-10 w-full max-w-2xl">
      <div
        className="flex flex-col gap-3 rounded-3xl border border-[#dadce0] bg-white p-2 shadow-[0_1px_6px_rgba(32,33,36,0.12)] sm:flex-row sm:items-center sm:rounded-full sm:pl-6 sm:pr-2 sm:py-2"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') openStudio();
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-base text-[#202124] outline-none placeholder:text-[#80868b] sm:px-0 sm:py-2"
          aria-label={placeholder}
        />
        <button
          type="button"
          onClick={openStudio}
          className="rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1765cc] sm:shrink-0"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
