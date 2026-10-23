import Link from 'next/link';
import { getOwebAppUrl } from '@/lib/ogi/constants';
import { loginPath, marketingPath, studioDashboardPath } from '@/lib/marketing/copy';

export default function MarketingFooter({ locale, copy }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#dadce0] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div>
          <p className="text-sm font-medium text-[#202124]">{copy.footer.copyright}</p>
          <p className="mt-1 text-sm text-[#5f6368]">{copy.footer.ecosystem}</p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
          <div>
            <p className="mb-2 font-medium text-[#202124]">{copy.footer.product}</p>
            <ul className="space-y-2 text-[#5f6368]">
              <li>
                <Link href={marketingPath(locale, '/features')} className="hover:text-[#1a73e8]">
                  {copy.nav.features}
                </Link>
              </li>
              <li>
                <Link href={studioDashboardPath(locale)} className="hover:text-[#1a73e8]">
                  {copy.nav.studio}
                </Link>
              </li>
              <li>
                <Link href={loginPath(locale)} className="hover:text-[#1a73e8]">
                  {copy.footer.login}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-[#202124]">OWeb</p>
            <ul className="space-y-2 text-[#5f6368]">
              <li>
                <a href={getOwebAppUrl()} className="hover:text-[#1a73e8]">
                  {copy.footer.owebLink}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#f1f3f4] py-4 text-center text-xs text-[#80868b]">
        © {year} {copy.footer.copyright}
      </div>
    </footer>
  );
}
