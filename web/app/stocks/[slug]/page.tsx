import Link from "next/link";
import { notFound } from "next/navigation";
import { allStocks, getStock, type Multiples } from "@/lib/stocks";
import PriceChart from "@/components/PriceChart";

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
      <div className="flex items-center justify-between">
        <Link
          href="/stocks"
          className="text-[12px] text-ink-500 hover:text-ink-900"
        >
          ← Tilbake til oversikten
        </Link>
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
          {s.flag} {s.country} · {s.exchange} · {s.sector}
        </div>
      </div>

      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          {s.name}
        </h1>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-2xl font-semibold text-ink-900 tabular-nums">
            {s.last !== null ? s.last.toLocaleString("nb-NO") : "—"}
            <span className="ml-1 text-sm font-normal text-ink-500">{s.ccy}</span>
          </span>
          <span className={`text-sm tabular-nums ${color}`}>
            {s.change !== null ? `${sign}${s.change}` : "—"}
            {pct !== null ? ` (${sign}${pct.toFixed(2)}%)` : ""}
          </span>
          {s.tier ? <CapTierBadge tier={s.tier} /> : null}
        </div>
        <p className="text-ink-700 text-[14px] max-w-prose leading-relaxed">
          {s.description}
        </p>
      </header>

      <PriceChart slug={s.slug} />

      {s.long ? (
        <section className="card p-6 max-w-prose">
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Om selskapet
          </h2>
          <p className="mt-3 text-[14px] text-ink-800 leading-relaxed">
            {s.long}
          </p>
        </section>
      ) : null}

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

      <MultiplesPanel m={s.multiples} ccy={s.ccy} />

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

function CapTierBadge({ tier }: { tier: "Large" | "Mid" | "Small" }) {
  const styles = {
    Large: "bg-emerald-50 text-emerald-800 border-emerald-200",
    Mid: "bg-amber-50 text-amber-800 border-amber-200",
    Small: "bg-sky-50 text-sky-800 border-sky-200",
  } as const;
  const label = { Large: "Large cap", Mid: "Mid cap", Small: "Small cap" } as const;
  return (
    <span
      className={`inline-flex items-center text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-full border ${styles[tier]}`}
    >
      {label[tier]}
    </span>
  );
}

function MultiplesPanel({ m, ccy }: { m: Multiples; ccy: string }) {
  const cells: Array<{ label: string; value: string; hint?: string }> = [
    {
      label: "Markedsverdi",
      value: m.marketCapMNOK !== null ? `${m.marketCapMNOK.toLocaleString("nb-NO")} MNOK` : "—",
    },
    {
      label: "P/E",
      value: m.peRatio !== null ? m.peRatio.toFixed(1) + "×" : "—",
      hint: "TTM",
    },
    {
      label: "EV/EBITDA",
      value: m.evEbitda !== null ? m.evEbitda.toFixed(1) + "×" : "—",
      hint: "TTM",
    },
    {
      label: "P/B",
      value: m.pbRatio !== null ? m.pbRatio.toFixed(2) + "×" : "—",
    },
    {
      label: "Direkteavkastning",
      value: m.dividendYield !== null ? m.dividendYield.toFixed(2) + " %" : "—",
    },
    {
      label: "Netto gjeld / EBITDA",
      value: m.netDebtEbitda !== null ? m.netDebtEbitda.toFixed(1) + "×" : "—",
    },
    {
      label: "ROE",
      value: m.roe !== null ? m.roe.toFixed(1) + " %" : "—",
    },
    {
      label: "Beta (3 år)",
      value: m.beta !== null ? m.beta.toFixed(2) : "—",
    },
  ];

  const hasAny = cells.some((c) => c.value !== "—");

  return (
    <section className="card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Nøkkeltall og multipler
        </h2>
        <span className="text-[10px] text-ink-400">Valuta: {ccy}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {cells.map((c) => (
          <div key={c.label} className="rounded-md border hairline p-3 bg-ink-50">
            <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">
              {c.label}
              {c.hint ? (
                <span className="ml-1 normal-case tracking-normal text-ink-400">
                  · {c.hint}
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-[14px] text-ink-900 tabular-nums">
              {c.value}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-ink-500 leading-relaxed">
        {hasAny
          ? "Multipler er indikative — verifiser mot oppdaterte kvartalsrapporter før beslutninger."
          : "Multipler er ikke koblet til live-data ennå. Skjemaet er på plass; en feeder mot Yahoo/Borsdata/IR-PDF kan legges inn senere uten endringer i frontend."}
      </p>
    </section>
  );
}
