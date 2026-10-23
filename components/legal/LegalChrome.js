import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import LegalFooter from '@/components/legal/LegalFooter';
import { getMarketingCopy } from '@/lib/marketing/copy';
import { marketingPath } from '@/lib/marketing/copy';

export default function LegalChrome({ children }) {
  const copy = getMarketingCopy('en');

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] flex flex-col antialiased">
      <header className="sticky top-0 z-50 border-b border-[#dadce0]/80 bg-white/95 backdrop-blur-sm px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity no-underline">
          <BrandLogo size={32} showName variant="light" nameClassName="text-base font-medium" />
        </Link>
        <nav className="flex items-center gap-4 text-sm text-[#5f6368]">
          <Link href={marketingPath('en', '/features')} className="hover:text-[#1a73e8] no-underline">
            {copy.nav.features}
          </Link>
          <Link href="/privacy" className="hover:text-[#1a73e8] no-underline">Privacy</Link>
          <Link href="/terms" className="hover:text-[#1a73e8] no-underline">Terms</Link>
          <Link
            href="/login"
            className="rounded-full bg-[#1a73e8] px-4 py-2 text-white text-sm font-medium no-underline hover:bg-[#1765cc]"
          >
            {copy.nav.signIn}
          </Link>
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <LegalFooter variant="light" />
    </div>
  );
}
