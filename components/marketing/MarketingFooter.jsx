import Link from 'next/link';
import { SUPPORT_EMAIL } from '@/lib/ogi/branding';
import { getOwebAppUrl } from '@/lib/ogi/constants';
import { loginPath, marketingPath, studioDashboardPath } from '@/lib/marketing/copy';

export default function MarketingFooter({ locale, copy }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#dadce0] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-sm font-medium text-[#202124]">{copy.footer.copyright}</p>
          <p className="mt-2 text-sm text-[#5f6368]">{copy.footer.ecosystem}</p>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#80868b]">
            {copy.footer.product}
          </p>
          <ul className="space-y-2 text-sm text-[#5f6368]">
            <li>
              <Link href={marketingPath(locale, '/features')} className="hover:text-[#1a73e8]">
                {copy.nav.features}
              </Link>
            </li>
            <li>
              <Link href={marketingPath(locale, '/pricing')} className="hover:text-[#1a73e8]">
                {copy.nav.pricing}
              </Link>
            </li>
            <li>
              <Link href={studioDashboardPath(locale)} className="hover:text-[#1a73e8]">
                {copy.nav.studio}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#80868b]">
            {copy.footer.resources}
          </p>
          <ul className="space-y-2 text-sm text-[#5f6368]">
            <li>
              <Link href={marketingPath(locale, '/security')} className="hover:text-[#1a73e8]">
                {copy.nav.security}
              </Link>
            </li>
            <li>
              <a href={getOwebAppUrl()} className="hover:text-[#1a73e8]">
                {copy.footer.owebLink}
              </a>
            </li>
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#1a73e8]">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#80868b]">
            {copy.footer.legal}
          </p>
          <ul className="space-y-2 text-sm text-[#5f6368]">
            <li>
              <Link href={loginPath(locale)} className="hover:text-[#1a73e8]">
                {copy.footer.login}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#1a73e8]">
                {copy.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#1a73e8]">
                {copy.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#f1f3f4] py-4 text-center text-xs text-[#80868b]">
        © {year} {copy.footer.copyright}
      </div>
    </footer>
  );
}
