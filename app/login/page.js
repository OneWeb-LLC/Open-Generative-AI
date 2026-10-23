import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from './LoginForm';
import BrandLogo from '@/components/BrandLogo';
import LegalFooter from '@/components/legal/LegalFooter';
import { SITE_NAME, SITE_SHORT_TAGLINE } from '@/lib/ogi/branding';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#050505] text-white">
      <div className="hidden md:flex flex-col justify-between p-12 border-r border-white/5">
        <div>
          <Link href="/" className="text-xs text-white/40 hover:text-white/70 no-underline">
            ← Back to home
          </Link>
          <div className="mt-6">
            <BrandLogo size={40} showName />
          </div>
          <p className="mt-6 text-xs tracking-[0.2em] text-white/40 uppercase">OWeb Satellite</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">{SITE_NAME}</h1>
          <p className="mt-4 max-w-md text-white/60">
            {SITE_SHORT_TAGLINE} — shared OneID with OWeb. Your MuAPI key stays yours (BYOK).
          </p>
        </div>
        <p className="text-xs text-white/30">One OS · auth.oweb.one</p>
      </div>

      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
          <Link
            href="/"
            className="mb-6 self-start text-xs text-white/40 hover:text-white/70 no-underline md:hidden"
          >
            ← Back to home
          </Link>
          <Suspense fallback={<p className="text-sm text-white/50">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
        <LegalFooter />
      </div>
    </div>
  );
}
