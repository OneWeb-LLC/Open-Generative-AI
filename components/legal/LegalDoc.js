import Link from 'next/link';

export function LegalDoc({
  eyebrow,
  title,
  description,
  lastUpdated,
  toc,
  related,
  children,
}) {
  return (
    <main className="px-4 sm:px-6 py-12 md:py-16 text-white/80">
      <div className="max-w-6xl mx-auto">
        <header className="max-w-3xl mb-10 md:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#22d3ee] mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
            {title}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">{description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
            <span>
              Last updated <span className="text-white/90 font-medium">{lastUpdated}</span>
            </span>
            {related?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-3">
              On this page
            </p>
            <nav aria-label="Table of contents">
              <ol className="space-y-2 text-sm text-white/50 border-l border-white/10 pl-3">
                {toc.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block hover:text-white transition-colors leading-snug"
                    >
                      <span className="text-white/30 mr-1.5 tabular-nums">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 space-y-10 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-white border-b border-white/10 pb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalCallout({ children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white/90 leading-relaxed">
      {children}
    </div>
  );
}

export function LegalList({ items }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
