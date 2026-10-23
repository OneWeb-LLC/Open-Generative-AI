import './globals.css';
import { Inter } from "next/font/google";
import { headers } from 'next/headers';
import { getLocaleConfig } from '@/lib/locales';
import { OWEB_ICON_PATH, SITE_NAME, SITE_SHORT_TAGLINE, pageTitle } from '@/lib/ogi/branding';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: pageTitle(SITE_SHORT_TAGLINE),
  description: `${SITE_NAME} — ${SITE_SHORT_TAGLINE}. Flux, Kling, Veo, Seedance and more.`,
  icons: {
    icon: OWEB_ICON_PATH,
    shortcut: OWEB_ICON_PATH,
  },
};

export default async function RootLayout({ children }) {
  // Locale is derived from the URL path by middleware.js and passed
  // through as a plain response header — the root layout is shared by
  // every locale's route tree, so it can't take a `locale` prop directly.
  const headerList = await headers();
  const { htmlLang } = getLocaleConfig(headerList.get('x-locale'));

  return (
    <html lang={htmlLang}>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
