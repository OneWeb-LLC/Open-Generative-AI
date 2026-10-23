import Link from 'next/link';
import { LEGAL_ENTITY, SITE_NAME } from '@/lib/ogi/branding';

export default function LegalFooter({ className = '' }) {
  return (
    <footer
      className={`border-t border-white/5 px-4 py-4 text-center text-[11px] text-white/40 ${className}`}
    >
      <p>
        © {new Date().getFullYear()} {LEGAL_ENTITY}. {SITE_NAME} is an OWeb ecosystem application.
      </p>
      <p className="mt-1 flex items-center justify-center gap-3">
        <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
        <span aria-hidden>·</span>
        <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</Link>
      </p>
    </footer>
  );
}
