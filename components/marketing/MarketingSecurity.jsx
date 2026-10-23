import Link from 'next/link';
import { MarketingPrimaryButton } from '@/components/marketing/MarketingButtons';
import { loginPath, studioDashboardPath } from '@/lib/marketing/copy';

export default function MarketingSecurity({ copy, locale, isAuthenticated }) {
  const ctaHref = isAuthenticated ? studioDashboardPath(locale) : loginPath(locale);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-normal tracking-tight text-[#202124] sm:text-5xl">
          {copy.securityPage.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#5f6368]">{copy.securityPage.subhead}</p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {copy.securityPage.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-[#e8eaed] bg-[#f8f9fa] p-6"
            >
              <h2 className="text-lg font-medium text-[#202124]">{section.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#5f6368]">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-[#1a73e8]" aria-hidden>•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/privacy"
            className="rounded-full border border-[#dadce0] bg-white px-8 py-3 text-base font-medium text-[#1a73e8] no-underline hover:bg-[#f8f9fa]"
          >
            {copy.securityPage.cta}
          </Link>
          <MarketingPrimaryButton href={ctaHref}>
            {isAuthenticated ? copy.nav.openDashboard : copy.nav.getStarted}
          </MarketingPrimaryButton>
        </div>
      </div>
    </div>
  );
}
