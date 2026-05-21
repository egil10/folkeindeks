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
  const color = pct === null ? "text-nordic-300" : pct > 0 ? "text-emerald-300" : pct < 0 ? "text-rose-300" : "text-nordic-200";
  const sign = pct === null ? "" : pct > 0 ? "+" : "";

  const irQuery = encodeURIComponent(`${s.name} investor relations`);
  const wikiQuery = encodeURIComponent(s.name);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/stocks" className="text-sm text-nordic-300 hover:text-nordic-100">
          ← Tilbake til oversikten
        </Link>
      </div>

      <header className="glass rounded-2xl p-6 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-nordic-400">
              {s.flag} {s.country} · {s.exchange} · {s.sector}
            </div>
            <h1 className="text-3xl font-semibold text-nordic-50 mt-1">{s.name}</h1>
          </div>
          <div className="text-right">
            <div className="text-2xl tabular-nums text-nordic-50">
              {s.last !== null ? s.last.toLocaleString("nb-NO") : "—"}{" "}
              <span className="text-sm text-nordic-400">{s.ccy}</span>
            </div>
            <div className={`text-sm tabular-nums ${color}`}>
              {s.change !== null ? `${sign}${s.change}` : "—"}{" "}
              {pct !== null ? `(${sign}${pct.toFixed(2)}%)` : ""}
            </div>
          </div>
        </div>
        <p className="text-nordic-200 max-w-3xl">{s.description}</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Datum label="Bid" value={fmt(s.bid)} />
        <Datum label="Ask" value={fmt(s.ask)} />
        <Datum label="Volum" value={s.volume !== null ? s.volume.toLocaleString("nb-NO") : "—"} />
        <Datum label="Omsetning" value={s.turnover !== null ? s.turnover.toLocaleString("nb-NO") : "—"} />
        <Datum label="Valuta" value={s.ccy} />
        <Datum label="Sist oppdatert (CET)" value={s.updated || "—"} />
        <Datum label="Sektor" value={s.sector} />
        <Datum label="Marked" value={s.exchange} />
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-nordic-100">Mer informasjon</h2>
        <p className="text-sm text-nordic-200 mt-2">
          Folkeindeks holder seg til kuraterte beskrivelser. For dypere granskning
          (kvartalsrapporter, eierstruktur, ESG-policy) — bruk lenkene under.
        </p>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <ExternalLink
            label="Investor relations (Google)"
            href={`https://www.google.com/search?q=${irQuery}`}
          />
          <ExternalLink
            label="Wikipedia (søk)"
            href={`https://en.wikipedia.org/w/index.php?search=${wikiQuery}`}
          />
          <ExternalLink
            label="Nasdaq Nordic — finn ticker"
            href={`https://www.nasdaqomxnordic.com/aksjer/microsite?Instrument=&Identifier=${encodeURIComponent(s.name)}`}
          />
          <ExternalLink
            label="Yahoo Finance — søk"
            href={`https://finance.yahoo.com/lookup?s=${wikiQuery}`}
          />
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
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-nordic-400">{label}</div>
      <div className="mt-1 text-sm text-nordic-50 tabular-nums">{value}</div>
    </div>
  );
}

function ExternalLink({ label, href }: { label: string; href: string }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noreferrer" className="text-nordic-200 hover:text-white underline underline-offset-4 decoration-nordic-500/60">
        {label} ↗
      </a>
    </li>
  );
}
