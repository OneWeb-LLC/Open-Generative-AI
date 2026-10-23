'use client';

import Link from 'next/link';
import { useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import {
  MarketingHeaderPrimary,
  MarketingHeaderText,
  MarketingNavPill,
} from '@/components/marketing/MarketingButtons';
import { getOwebAppUrl } from '@/lib/ogi/constants';
import { loginPath, marketingPath, studioDashboardPath } from '@/lib/marketing/copy';

export default function MarketingHeader({ locale, copy, isAuthenticated }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = marketingPath(locale, '');
  const featuresHref = marketingPath(locale, '/features');
  const pricingHref = marketingPath(locale, '/pricing');
  const securityHref = marketingPath(locale, '/security');
  const dashboardHref = studioDashboardPath(locale);
  const signInHref = loginPath(locale);

  const navLinks = [
    { href: featuresHref, label: copy.nav.features },
    { href: pricingHref, label: copy.nav.pricing },
    { href: securityHref, label: copy.nav.security },
    { href: dashboardHref, label: copy.nav.studio },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#dadce0]/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={homeHref} className="no-underline hover:opacity-90 transition-opacity shrink-0">
          <BrandLogo
            size={36}
            showName
            variant="light"
            nameClassName="text-base font-medium text-[#202124]"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <MarketingNavPill key={link.href} href={link.href}>{link.label}</MarketingNavPill>
          ))}
          <a
            href={getOwebAppUrl()}
            className="rounded-full px-4 py-2 text-sm font-medium text-[#5f6368] no-underline transition hover:bg-[#f1f3f4] hover:text-[#202124]"
          >
            OWeb
          </a>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {isAuthenticated ? (
            <MarketingHeaderPrimary href={dashboardHref}>{copy.nav.openDashboard}</MarketingHeaderPrimary>
          ) : (
            <>
              <MarketingHeaderText href={signInHref}>{copy.nav.signIn}</MarketingHeaderText>
              <MarketingHeaderPrimary href={signInHref}>{copy.nav.getStarted}</MarketingHeaderPrimary>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden rounded-full p-2 text-[#5f6368] hover:bg-[#f1f3f4]"
          aria-expanded={menuOpen}
          aria-label={copy.nav.menu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-[#e8eaed] bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-[#3c4043] no-underline hover:bg-[#f1f3f4]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={getOwebAppUrl()}
              className="rounded-lg px-3 py-2.5 text-sm text-[#3c4043] no-underline hover:bg-[#f1f3f4]"
            >
              OWeb
            </a>
            <div className="mt-3 flex flex-col gap-2 border-t border-[#f1f3f4] pt-3">
              {isAuthenticated ? (
                <MarketingHeaderPrimary href={dashboardHref}>{copy.nav.openDashboard}</MarketingHeaderPrimary>
              ) : (
                <>
                  <MarketingHeaderText href={signInHref}>{copy.nav.signIn}</MarketingHeaderText>
                  <MarketingHeaderPrimary href={signInHref}>{copy.nav.getStarted}</MarketingHeaderPrimary>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
