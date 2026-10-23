import Link from 'next/link';
import { loginPath, marketingPath, studioDashboardPath } from '@/lib/marketing/copy';

function HeroPrimary({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-[#1a73e8] px-8 py-3 text-base font-medium text-white no-underline shadow-md transition hover:bg-[#1765cc]"
    >
      {children}
    </Link>
  );
}

function HeroSecondary({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-[#dadce0] bg-white px-8 py-3 text-base font-medium text-[#1a73e8] no-underline transition hover:bg-[#f8f9fa]"
    >
      {children}
    </Link>
  );
}

export default function MarketingHome({ copy, locale, isAuthenticated }) {
  const dashboardHref = studioDashboardPath(locale);
  const featuresHref = marketingPath(locale, '/features');
  const primaryHref = isAuthenticated ? dashboardHref : loginPath(locale);
  const primaryLabel = isAuthenticated ? copy.nav.openDashboard : copy.home.primaryCta;

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-wide text-[#1a73e8]">
            {copy.home.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-normal tracking-tight text-[#202124] sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {copy.home.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5f6368]">{copy.home.subhead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <HeroPrimary href={primaryHref}>{primaryLabel}</HeroPrimary>
            <HeroSecondary href={featuresHref}>{copy.home.secondaryCta}</HeroSecondary>
          </div>
          <p className="mt-8 text-sm text-[#80868b]">{copy.home.trustLine}</p>
        </div>
      </section>

      <section className="border-t border-[#e8eaed] bg-[#f8f9fa]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-normal text-[#202124]">{copy.pillars.title}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.pillars.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#e8eaed] bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-[#202124]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5f6368]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-normal text-[#202124]">{copy.steps.title}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {copy.steps.items.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-sm font-medium text-[#1a73e8]"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#202124]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5f6368]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[#e8eaed] bg-[#e8f0fe]/40">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-normal text-[#202124]">{copy.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#5f6368]">
            {isAuthenticated ? copy.cta.signedIn : copy.cta.signedOut}
          </p>
          <div className="mt-8">
            <HeroPrimary href={primaryHref}>{primaryLabel}</HeroPrimary>
          </div>
        </div>
      </section>
    </>
  );
}
