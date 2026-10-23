'use client';

import { owebLoginUrl } from '@/lib/ogi/constants';

export default function ContinueWithOweb({ label = 'Continue with OWeb', className = '' }) {
  const href = owebLoginUrl({ launch: true });

  return (
    <a
      href={href}
      className={`inline-flex w-full items-center justify-center rounded-full border border-[#dadce0] bg-white px-5 py-2.5 text-sm font-medium text-[#1a73e8] no-underline shadow-sm transition hover:bg-[#f8f9fa] ${className}`}
    >
      {label}
    </a>
  );
}
