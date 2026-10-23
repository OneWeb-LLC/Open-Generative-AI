import { Roboto } from 'next/font/google';
import MarketingFooter from './MarketingFooter';
import MarketingHeader from './MarketingHeader';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export default function MarketingShell({ locale, copy, isAuthenticated, children }) {
  return (
    <div
      className={`${roboto.className} min-h-screen flex flex-col bg-[#f8f9fa] text-[#202124] antialiased`}
    >
      <MarketingHeader locale={locale} copy={copy} isAuthenticated={isAuthenticated} />
      <main className="flex-1">{children}</main>
      <MarketingFooter locale={locale} copy={copy} />
    </div>
  );
}
