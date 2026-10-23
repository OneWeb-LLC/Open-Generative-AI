import HeroPromptBar from '@/components/marketing/HeroPromptBar';
import {
  MarketingPrimaryButton,
  MarketingSecondaryButton,
} from '@/components/marketing/MarketingButtons';
import { loginPath, marketingPath, studioDashboardPath } from '@/lib/marketing/copy';

function HighlightVisual({ side }) {
  const gradient =
    side === 'left'
      ? 'from-[#e8f0fe] via-[#fce8e6] to-[#e6f4ea]'
      : 'from-[#fef7e0] via-[#f3e8fd] to-[#e8f0fe]';
  return (
    <div
      className={`relative min-h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} shadow-inner`}
      aria-hidden
    >
      <div className="absolute inset-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm" />
      <div className="absolute bottom-8 left-8 right-8 h-3 rounded-full bg-[#1a73e8]/20" />
      <div className="absolute bottom-14 left-8 h-8 w-8 rounded-full bg-[#1a73e8]/30" />
      <div className="absolute top-10 right-10 h-16 w-16 rounded-2xl bg-white/50 shadow-sm" />
    </div>
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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-wide text-[#1a73e8]">
              {copy.home.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-normal tracking-tight text-[#202124] sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              {copy.home.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#5f6368]">
              {copy.home.subhead}
            </p>
            <HeroPromptBar
              placeholder={copy.home.promptPlaceholder}
              buttonLabel={copy.home.promptCta}
              studioHref={dashboardHref}
            />
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MarketingPrimaryButton href={primaryHref}>{primaryLabel}</MarketingPrimaryButton>
              <MarketingSecondaryButton href={featuresHref}>
                {copy.home.secondaryCta}
              </MarketingSecondaryButton>
            </div>
            <p className="mt-8 text-sm text-[#80868b]">{copy.home.trustLine}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8eaed] bg-[#f8f9fa] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="text-lg font-medium text-[#202124]">{copy.models.title}</h2>
          <p className="mt-2 text-sm text-[#5f6368]">{copy.models.subtitle}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {copy.models.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#dadce0] bg-white px-4 py-1.5 text-sm text-[#3c4043] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-normal text-[#202124]">{copy.showcase.title}</h2>
          <p className="mt-2 max-w-2xl text-[#5f6368]">{copy.showcase.subtitle}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.showcase.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#e8eaed] p-6 transition hover:shadow-md"
                style={{ backgroundColor: item.accent }}
              >
                <h3 className="text-lg font-medium text-[#202124]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5f6368]">{item.body}</p>
              </article>
            ))}
          </div>
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
          <h2 className="text-2xl font-normal text-[#202124]">{copy.highlights.title}</h2>
          <div className="mt-12 space-y-16">
            {copy.highlights.items.map((item, index) => {
              const visualFirst = item.imageSide === 'left';
              return (
                <div
                  key={item.title}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  {visualFirst ? (
                    <HighlightVisual side={index % 2 === 0 ? 'left' : 'right'} />
                  ) : null}
                  <div>
                    <h3 className="text-2xl font-normal text-[#202124]">{item.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-[#5f6368]">{item.body}</p>
                  </div>
                  {!visualFirst ? (
                    <HighlightVisual side={index % 2 === 0 ? 'right' : 'left'} />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e8eaed] bg-[#f8f9fa]">
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

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-normal text-[#202124] text-center">{copy.faq.title}</h2>
          <dl className="mt-10 space-y-6">
            {copy.faq.items.map((item) => (
              <div key={item.q} className="rounded-2xl border border-[#e8eaed] bg-[#f8f9fa] px-6 py-5">
                <dt className="text-base font-medium text-[#202124]">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#5f6368]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-[#e8eaed] bg-[#e8f0fe]/40">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-normal text-[#202124]">{copy.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[#5f6368]">
            {isAuthenticated ? copy.cta.signedIn : copy.cta.signedOut}
          </p>
          <div className="mt-8">
            <MarketingPrimaryButton href={primaryHref}>{primaryLabel}</MarketingPrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
