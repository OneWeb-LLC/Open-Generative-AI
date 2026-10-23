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
    <main className="px-4 sm:px-6 py-12 md:py-16 text-[#5f6368]">
      <div className="max-w-6xl mx-auto">
        <header className="max-w-3xl mb-10 md:mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a73e8] mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-tight text-[#202124]">
            {title}
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed">{description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#80868b]">
            <span>
              Last updated <span className="text-[#202124] font-medium">{lastUpdated}</span>
            </span>
            {related?.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#1a73e8] hover:underline underline-offset-4"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        <div className="grid lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#80868b] mb-3">
              On this page
            </p>
            <nav aria-label="Table of contents">
              <ol className="space-y-2 text-sm text-[#5f6368] border-l border-[#dadce0] pl-3">
                {toc.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block hover:text-[#1a73e8] transition-colors leading-snug"
                    >
                      <span className="text-[#80868b] mr-1.5 tabular-nums">
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
      <h2 className="text-xl font-medium tracking-tight text-[#202124] border-b border-[#e8eaed] pb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalCallout({ children }) {
  return (
    <div className="rounded-xl border border-[#e8eaed] bg-[#e8f0fe]/40 px-4 py-3.5 text-[#3c4043] leading-relaxed">
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
