import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import LegalFooter from '@/components/legal/LegalFooter';

export default function LegalChrome({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <header className="border-b border-white/5 px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/studio" className="hover:opacity-90 transition-opacity">
          <BrandLogo size={32} showName />
        </Link>
        <nav className="flex items-center gap-4 text-xs text-white/60">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <LegalFooter />
    </div>
  );
}
