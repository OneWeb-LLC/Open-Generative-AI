import Image from 'next/image';
import { OWEB_ICON_PATH, SITE_NAME } from '@/lib/ogi/branding';

export default function BrandLogo({
  size = 32,
  showName = false,
  nameClassName = '',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="rounded-lg bg-[#0f172a] flex items-center justify-center shadow-lg shadow-[#22d3ee]/10 border border-white/10"
        style={{ width: size, height: size }}
      >
        <Image
          src={OWEB_ICON_PATH}
          alt={`${SITE_NAME} logo`}
          width={Math.round(size * 0.7)}
          height={Math.round(size * 0.7)}
          priority
        />
      </div>
      {showName ? (
        <span className={`text-sm font-bold tracking-tight text-white ${nameClassName}`}>
          {SITE_NAME}
        </span>
      ) : null}
    </div>
  );
}
