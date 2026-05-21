import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allStocks,
  getStock,
  getHistoricals,
  type Historicals,
  type Multiples,
} from "@/lib/stocks";
import PriceChart from "@/components/PriceChart";
import StockPager from "./StockPager";

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

  const sorted = [...allStocks].sort((a, b) => a.name.localeCompare(b.name, "nb"));
  const idx = sorted.findIndex((x) => x.slug === s.slug);
  const prev = idx > 0 ? sorted[idx - 1] : sorted[sorted.length - 1];
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : sorted[0];

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
  const historicals = getHistoricals(s.slug);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/stocks"
          className="text-[12px] text-ink-500 hover:text-ink-900"
        >
          ← Tilbake til oversikten
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
            {s.flag} {s.country} · {s.exchange} · {s.sector}
          </div>
          <StockPager
            prev={{ slug: prev.slug, name: prev.name }}
            next={{ slug: next.slug, name: next.name }}
            position={`${idx + 1} / ${sorted.length}`}
          />
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

      <HistoricalsPanel h={historicals} ccy={s.ccy} />

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

function fmtPct(v: number | null, digits = 1) {
  if (v === null || !Number.isFinite(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)} %`;
}

function fmtPrice(v: number | null) {
  if (v === null || !Number.isFinite(v)) return "—";
  return v.toLocaleString("nb-NO", { maximumFractionDigits: 2 });
}

function pctTone(v: number | null) {
  if (v === null || !Number.isFinite(v)) return "text-ink-900";
  if (v > 0) return "text-emerald-700";
  if (v < 0) return "text-rose-700";
  return "text-ink-900";
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

function HistoricalsPanel({ h, ccy }: { h: Historicals | null; ccy: string }) {
  if (!h) {
    return (
      <section className="card p-6">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Historikk
        </h2>
        <p className="mt-3 text-[12px] text-ink-500">
          Ingen prishistorikk tilgjengelig for denne aksjen.
        </p>
      </section>
    );
  }

  const returns: Array<{ label: string; value: number | null; hint?: string }> = [
    { label: "1M", value: h.return1M },
    { label: "3M", value: h.return3M },
    { label: "6M", value: h.return6M },
    { label: "ÅTD", value: h.returnYTD },
    { label: "1Å", value: h.return1Y },
    { label: "3Å", value: h.return3Y, hint: "ann." },
    { label: "5Å", value: h.return5Y, hint: "ann." },
    { label: "Vol 1Å", value: h.volatility1Y, hint: "ann. stdev" },
  ];

  return (
    <section className="card p-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Historikk
        </h2>
        <span className="text-[10px] text-ink-400">
          Pr. {h.asOf} · {h.bars.toLocaleString("nb-NO")} handelsdager · justerte sluttkurser i {ccy}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {returns.map((r) => (
          <div key={r.label} className="rounded-md border hairline p-3 bg-ink-50">
            <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">
              {r.label}
              {r.hint ? (
                <span className="ml-1 normal-case tracking-normal text-ink-400">
                  · {r.hint}
                </span>
              ) : null}
            </div>
            <div className={`mt-1 text-[14px] tabular-nums ${pctTone(r.value)}`}>
              {fmtPct(r.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="rounded-md border hairline p-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">52v høy</div>
          <div className="mt-1 text-[14px] text-ink-900 tabular-nums">
            {fmtPrice(h.high52w)} <span className="text-[11px] text-ink-500">{ccy}</span>
          </div>
        </div>
        <div className="rounded-md border hairline p-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">52v lav</div>
          <div className="mt-1 text-[14px] text-ink-900 tabular-nums">
            {fmtPrice(h.low52w)} <span className="text-[11px] text-ink-500">{ccy}</span>
          </div>
        </div>
        <div className="rounded-md border hairline p-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">
            Maks drawdown <span className="normal-case tracking-normal text-ink-400">· 1Å</span>
          </div>
          <div className={`mt-1 text-[14px] tabular-nums ${pctTone(h.maxDrawdown1Y)}`}>
            {fmtPct(h.maxDrawdown1Y)}
          </div>
        </div>
        <div className="rounded-md border hairline p-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">
            Snittvolum <span className="normal-case tracking-normal text-ink-400">· 3M</span>
          </div>
          <div className="mt-1 text-[14px] text-ink-900 tabular-nums">
            {h.avgVolume3M !== null ? h.avgVolume3M.toLocaleString("nb-NO") : "—"}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-ink-500 leading-relaxed">
        Avkastningstall er punkt-til-punkt på justerte sluttkurser i lokal valuta.
        Volatilitet er annualisert stdev av daglige log-avkastninger over de siste
        252 handelsdagene. Drawdown er største topp-til-bunn-fall over samme vindu.
      </p>
    </section>
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
