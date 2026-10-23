import Link from 'next/link';

export function MarketingPrimaryButton({ href, children, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-8 py-3 text-base font-medium text-white no-underline shadow-md transition hover:bg-[#1765cc] hover:shadow-lg ${className}`}
    >
      {children}
    </Link>
  );
}

export function MarketingSecondaryButton({ href, children, className = '' }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border border-[#dadce0] bg-white px-8 py-3 text-base font-medium text-[#1a73e8] no-underline transition hover:bg-[#f8f9fa] ${className}`}
    >
      {children}
    </Link>
  );
}

export function MarketingNavPill({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6368] no-underline transition hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
    >
      {children}
    </Link>
  );
}

export function MarketingHeaderPrimary({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-[#1765cc]"
    >
      {children}
    </Link>
  );
}

export function MarketingHeaderText({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-[#1a73e8] no-underline transition hover:bg-[#e8f0fe]"
    >
      {children}
    </Link>
  );
}
