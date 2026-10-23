import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from './LoginForm';
import BrandLogo from '@/components/BrandLogo';
import { Roboto } from 'next/font/google';
import { SITE_NAME, SITE_SHORT_TAGLINE } from '@/lib/ogi/branding';
import { getMarketingCopy, marketingPath } from '@/lib/marketing/copy';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const copy = getMarketingCopy('en');

  return (
    <div className={`${roboto.className} min-h-screen bg-[#f0f4f9] text-[#202124] antialiased`}>
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-[#e8f0fe] via-[#fce8e6] to-[#e6f4ea] p-12 lg:flex">
          <div>
            <Link href="/" className="text-sm text-[#1a73e8] no-underline hover:underline">
              ← Home
            </Link>
            <div className="mt-10">
              <BrandLogo size={44} showName variant="light" nameClassName="text-xl" />
            </div>
            <p className="mt-8 text-sm font-medium uppercase tracking-wide text-[#1a73e8]">
              OWeb · OneID
            </p>
            <h1 className="mt-4 text-4xl font-normal tracking-tight text-[#202124]">{SITE_NAME}</h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#5f6368]">
              {SITE_SHORT_TAGLINE}. {copy.home.trustLine}
            </p>
          </div>
          <p className="text-sm text-[#80868b]">{copy.footer.ecosystem}</p>
        </div>

        <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-[448px] rounded-3xl border border-[#dadce0] bg-white px-8 py-10 shadow-sm">
            <div className="mb-8 flex justify-center lg:hidden">
              <BrandLogo size={40} showName variant="light" />
            </div>
            <Suspense fallback={<p className="text-sm text-[#5f6368]">Loading…</p>}>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-8 text-center text-xs text-[#80868b]">
            <Link href="/privacy" className="text-[#1a73e8] hover:underline">Privacy</Link>
            {' · '}
            <Link href="/terms" className="text-[#1a73e8] hover:underline">Terms</Link>
            {' · '}
            <Link href={marketingPath('en', '/security')} className="text-[#1a73e8] hover:underline">
              {copy.nav.security}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
