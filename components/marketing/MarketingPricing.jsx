import Link from 'next/link';
import { MarketingPrimaryButton } from '@/components/marketing/MarketingButtons';
import { SUPPORT_EMAIL } from '@/lib/ogi/branding';
import { getOwebAppUrl } from '@/lib/ogi/constants';
import { loginPath, studioDashboardPath } from '@/lib/marketing/copy';

export default function MarketingPricing({ copy, locale, isAuthenticated }) {
  const defaultCta = isAuthenticated ? studioDashboardPath(locale) : loginPath(locale);

  function planHref(planIndex) {
    if (planIndex === 1) return getOwebAppUrl();
    if (planIndex === 2) return `mailto:${SUPPORT_EMAIL}`;
    return defaultCta;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-normal tracking-tight text-[#202124] sm:text-5xl">
          {copy.pricingPage.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#5f6368]">{copy.pricingPage.subhead}</p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {copy.pricingPage.plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-3xl border p-8 ${
                index === 1
                  ? 'border-[#1a73e8] bg-[#e8f0fe]/30 shadow-md'
                  : 'border-[#e8eaed] bg-[#f8f9fa]'
              }`}
            >
              <h2 className="text-lg font-medium text-[#202124]">{plan.name}</h2>
              <p className="mt-2 text-3xl font-normal text-[#202124]">{plan.price}</p>
              <p className="mt-1 text-sm text-[#5f6368]">{plan.detail}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-[#3c4043]">
                {plan.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-[#1a73e8]" aria-hidden>✓</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {index === 2 ? (
                  <Link
                    href={planHref(index)}
                    className="inline-flex w-full items-center justify-center rounded-full border border-[#dadce0] bg-white px-6 py-3 text-sm font-medium text-[#1a73e8] no-underline hover:bg-[#f8f9fa]"
                  >
                    {plan.cta}
                  </Link>
                ) : index === 1 ? (
                  <a
                    href={planHref(index)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#1a73e8] px-6 py-3 text-sm font-medium text-white no-underline hover:bg-[#1765cc]"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <MarketingPrimaryButton href={planHref(index)} className="w-full !px-6 !py-3 !text-sm">
                    {plan.cta}
                  </MarketingPrimaryButton>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#80868b]">{copy.pricingPage.note}</p>
      </div>
    </div>
  );
}
