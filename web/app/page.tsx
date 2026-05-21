import Link from "next/link";
import { allStocks, statsByCountry, statsBySector } from "@/lib/stocks";

export default function HomePage() {
  const byCountry = statsByCountry();
  const bySector = statsBySector();

  return (
    <div className="space-y-16">
      <section className="max-w-3xl space-y-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Interview prep · Folketrygdfondet PhD · Tromsø
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tightest text-ink-900 leading-[1.05]">
          En arbeidsplass for å forstå{" "}
          <span className="text-accent-700">Statens fond i Tromsø</span> — fra
          mandat til hver enkelt aksje.
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Hele small-cap-universet Folketrygdfondet skal forvalte fra Tromsø
          — 361 selskaper, fem mulige forvaltningsstrategier, og en konkret
          plan for hvordan BANTHE-arbeidet kan utvides til et 3-årig nærings-ph.d.
          forankret i SFTX-indeksen.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/strategier"
            className="rounded-md bg-ink-900 hover:bg-ink-800 text-white px-4 py-2 text-[13px] font-medium"
          >
            De fem strategiene →
          </Link>
          <Link
            href="/bakgrunn"
            className="rounded-md border hairline hover:border-ink-300 px-4 py-2 text-[13px] font-medium text-ink-800"
          >
            Min bakgrunn vs. mandatet
          </Link>
          <Link
            href="/thesis"
            className="rounded-md border hairline hover:border-ink-300 px-4 py-2 text-[13px] font-medium text-ink-800"
          >
            PhD-prosjektutkast
          </Link>
          <Link
            href="/stocks"
            className="rounded-md border hairline hover:border-ink-300 px-4 py-2 text-[13px] font-medium text-ink-800"
          >
            Bla i {allStocks.length} selskaper
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Konstituenter, snapshot"
          value={allStocks.length.toString()}
          hint="VINX Small Cap EUR NI, mai 2026"
        />
        <StatCard
          label="SFTX-universet"
          value="~344"
          hint="Etter SPN + SPU-eksklusjoner"
        />
        <StatCard
          label="Startkapital SFT"
          value="NOK 15 mrd"
          hint="Skalérbart opp til 30 mrd"
        />
        <StatCard
          label="Aktiv ramme (TE)"
          value="5 pp"
          hint="vs 3 pp på SPN — 67 % mer aktiv plass"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink-900">
              Fordeling per land
            </h2>
            <span className="text-[11px] uppercase tracking-wider text-ink-500">
              VINX Small Cap snapshot
            </span>
          </div>
          <ul className="mt-5 space-y-3 text-[13px]">
            {byCountry.map((row) => (
              <BarRow
                key={row.country}
                label={row.country}
                value={row.count}
                max={allStocks.length}
              />
            ))}
          </ul>
          <p className="mt-5 text-xs text-ink-500 leading-relaxed">
            Norge er fraværende — VINX Small Cap dekker Nasdaq Nordic, og Oslo
            Børs (Euronext) er ikke en del av datasettet. SFTX legger norske
            small-caps tilbake inn via SPN-eksklusjonen i mandatet.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink-900">
              Fordeling per sektor
            </h2>
            <span className="text-[11px] uppercase tracking-wider text-ink-500">
              Kuratert klassifisering
            </span>
          </div>
          <ul className="mt-5 space-y-3 text-[13px]">
            {bySector.map((row) => (
              <BarRow
                key={row.sector}
                label={row.sector}
                value={row.count}
                max={allStocks.length}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
            Tre ting å lese før intervjuet
          </h2>
          <Link
            href="/research"
            className="text-[13px] text-ink-600 hover:text-ink-900"
          >
            Alle research-notater →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard
            title="De fem strategiene"
            body="Finansdepartementet ba FTF drøfte fem forvaltningsstrategier — fra ren indeks til ekstern forvalter-utvelgelse. Hvor passer en PhD i AI/data-analyse inn, og hvor er min komparative fordel?"
            href="/strategier"
            cta="Les analysen"
          />
          <FeatureCard
            title="Tromsø-mandatet i klartekst"
            body="15 mrd. kr åpnet 2. juni 2025, fullt investert ved utgangen av 2025. SFTX-indeksen er VINX Small Cap utbyttejustert for FTFs skatteposisjon, ekskl. SPN + SPU-utelukkelser."
            href="/fund"
            cta="Detaljer"
          />
          <FeatureCard
            title="Bro fra BANTHE til SFT"
            body="11,4 % over OSEBX i masteroppgaven. Long-only-restriksjonen og 5 pp TE-rammen endrer hvordan effekten må fanges — her er et konkret 3-årig prosjektutkast."
            href="/thesis"
            cta="Prosjektplan"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold text-ink-900 tracking-tightest">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-ink-500 leading-relaxed">{hint}</div>
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = (value / max) * 100;
  return (
    <li>
      <div className="flex justify-between text-ink-800">
        <span>{label}</span>
        <span className="tabular-nums text-ink-500">
          {value}{" "}
          <span className="text-ink-400">({pct.toFixed(1)}%)</span>
        </span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-ink-100 overflow-hidden">
        <div
          className="h-full bg-accent-600"
          style={{ width: `${pct.toFixed(2)}%` }}
        />
      </div>
    </li>
  );
}

function FeatureCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="card card-hover p-6 block h-full">
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      <p className="mt-3 text-[13px] text-ink-600 leading-relaxed">{body}</p>
      <p className="mt-5 text-[12px] text-accent-700">{cta} →</p>
    </Link>
  );
}
