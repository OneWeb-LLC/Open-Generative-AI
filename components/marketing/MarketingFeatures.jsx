import Link from 'next/link';
import { loginPath, studioDashboardPath } from '@/lib/marketing/copy';

export default function MarketingFeatures({ copy, locale, isAuthenticated }) {
  const ctaHref = isAuthenticated ? studioDashboardPath(locale) : loginPath(locale);
  const ctaLabel = isAuthenticated ? copy.nav.openDashboard : copy.nav.getStarted;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-normal tracking-tight text-[#202124] sm:text-5xl">
          {copy.featuresPage.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#5f6368]">{copy.featuresPage.subhead}</p>

        <div className="mt-16 space-y-12">
          {copy.featuresPage.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-[#e8eaed] bg-[#f8f9fa] p-8 sm:p-10"
            >
              <h2 className="text-2xl font-medium text-[#202124]">{section.title}</h2>
              <p className="mt-3 max-w-3xl text-[#5f6368]">{section.body}</p>
              <ul className="mt-6 space-y-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm text-[#3c4043]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1a73e8]" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-8 py-3 text-base font-medium text-white no-underline shadow-md transition hover:bg-[#1765cc]"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
