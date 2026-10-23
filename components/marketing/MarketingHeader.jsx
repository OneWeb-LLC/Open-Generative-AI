import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { getOwebAppUrl } from '@/lib/ogi/constants';
import { loginPath, marketingPath, studioDashboardPath } from '@/lib/marketing/copy';

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6368] no-underline transition hover:bg-[#e8f0fe] hover:text-[#1a73e8]"
    >
      {children}
    </Link>
  );
}

function PrimaryButton({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-5 py-2.5 text-sm font-medium text-white no-underline shadow-sm transition hover:bg-[#1765cc] hover:shadow"
    >
      {children}
    </Link>
  );
}

function TextButton({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-[#1a73e8] no-underline transition hover:bg-[#e8f0fe]"
    >
      {children}
    </Link>
  );
}

export default function MarketingHeader({ locale, copy, isAuthenticated }) {
  const homeHref = marketingPath(locale, '');
  const featuresHref = marketingPath(locale, '/features');
  const dashboardHref = studioDashboardPath(locale);
  const signInHref = loginPath(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dadce0]/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link href={homeHref} className="no-underline hover:opacity-90 transition-opacity">
            <BrandLogo size={36} showName nameClassName="text-base font-medium text-[#202124]" />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <NavLink href={featuresHref}>{copy.nav.features}</NavLink>
          <NavLink href={dashboardHref}>{copy.nav.studio}</NavLink>
          <a
            href={getOwebAppUrl()}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6368] no-underline transition hover:bg-[#f1f3f4] hover:text-[#202124]"
          >
            OWeb
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <PrimaryButton href={dashboardHref}>{copy.nav.openDashboard}</PrimaryButton>
          ) : (
            <>
              <TextButton href={signInHref}>{copy.nav.signIn}</TextButton>
              <PrimaryButton href={signInHref}>{copy.nav.getStarted}</PrimaryButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
