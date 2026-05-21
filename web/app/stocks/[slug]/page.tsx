import Link from "next/link";
import { notFound } from "next/navigation";
import { allStocks, getStock } from "@/lib/stocks";

export function generateStaticParams() {
  return allStocks.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getStock(slug);
  if (!s) return { title: "Aksje ikke funnet" };
  return { title: `${s.name} — Folkeindeks`, description: s.description };
}

export default async function StockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getStock(slug);
  if (!s) notFound();

  const pct = s.changePct;
  const color =
    pct === null
      ? "text-ink-500"
      : pct > 0
      ? "text-emerald-700"
      : pct < 0
      ? "text-rose-700"
      : "text-ink-500";
  const sign = pct === null ? "" : pct > 0 ? "+" : "";

  const irQuery = encodeURIComponent(`${s.name} investor relations`);
  const wikiQuery = encodeURIComponent(s.name);

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/stocks"
          className="text-[13px] text-ink-500 hover:text-ink-900"
        >
          ← Tilbake til oversikten
        </Link>
      </div>

      <header className="space-y-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          {s.flag} {s.country} · {s.exchange} · {s.sector}
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          {s.name}
        </h1>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-ink-900 tabular-nums">
            {s.last !== null ? s.last.toLocaleString("nb-NO") : "—"}
            <span className="ml-1 text-sm font-normal text-ink-500">{s.ccy}</span>
          </span>
          <span className={`text-sm tabular-nums ${color}`}>
            {s.change !== null ? `${sign}${s.change}` : "—"}
            {pct !== null ? ` (${sign}${pct.toFixed(2)}%)` : ""}
          </span>
        </div>
        <p className="text-ink-700 text-[15px] max-w-prose leading-relaxed">
          {s.description}
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Datum label="Bid" value={fmt(s.bid)} />
        <Datum label="Ask" value={fmt(s.ask)} />
        <Datum label="Volum" value={s.volume !== null ? s.volume.toLocaleString("nb-NO") : "—"} />
        <Datum label="Omsetning" value={s.turnover !== null ? s.turnover.toLocaleString("nb-NO") : "—"} />
        <Datum label="Valuta" value={s.ccy} />
        <Datum label="Sist oppdatert (CET)" value={s.updated || "—"} />
        <Datum label="Sektor" value={s.sector} />
        <Datum label="Marked" value={s.exchange} />
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-ink-900">Mer informasjon</h2>
        <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">
          Folkeindeks holder seg til kuraterte beskrivelser. For kvartalsrapporter,
          eierstruktur eller ESG-policy — bruk eksterne kilder.
        </p>
        <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-[13px]">
          <ExternalLink label="Investor relations (Google)" href={`https://www.google.com/search?q=${irQuery}`} />
          <ExternalLink label="Wikipedia (søk)" href={`https://en.wikipedia.org/w/index.php?search=${wikiQuery}`} />
          <ExternalLink label="Nasdaq Nordic — finn ticker" href={`https://www.nasdaqomxnordic.com/aksjer/microsite?Instrument=&Identifier=${encodeURIComponent(s.name)}`} />
          <ExternalLink label="Yahoo Finance — søk" href={`https://finance.yahoo.com/lookup?s=${wikiQuery}`} />
        </ul>
      </section>
    </div>
  );
}

function fmt(v: number | null) {
  return v === null ? "—" : v.toLocaleString("nb-NO");
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">{label}</div>
      <div className="mt-1 text-[13px] text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}

function ExternalLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-accent-700 hover:text-accent-900 underline underline-offset-4 decoration-accent-300/60"
      >
        {label} ↗
      </a>
    </li>
  );
}
