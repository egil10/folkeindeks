import Link from "next/link";
import { allStocks, statsByCountry, statsBySector } from "@/lib/stocks";

export default function HomePage() {
  const byCountry = statsByCountry();
  const bySector = statsBySector();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-nordic-300 text-sm uppercase tracking-widest">
          Interview prep · Folketrygdfondet PhD · Tromsø
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-nordic-50">
          Statens fond i Tromsø, <span className="text-nordic-400">VINXSCEURNI</span>,
          og en sti fra BANTHE til en PhD.
        </h1>
        <p className="max-w-3xl text-nordic-200 leading-relaxed">
          Et lite arbeidsverksted for å lese hele small cap-universet
          Folketrygdfondet skal forvalte fra Tromsø — selskap for selskap — og
          for å forstå hvordan masteroppgavens indekseffekt-arbeid kan bygges
          ut til et doktorgradsprosjekt forankret i den faktiske referanseindeksen.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/stocks" className="rounded-md bg-nordic-500 hover:bg-nordic-400 text-white px-4 py-2 text-sm font-medium">
            Bla i {allStocks.length} selskaper →
          </Link>
          <Link href="/indeks" className="rounded-md border border-white/15 hover:border-nordic-400 px-4 py-2 text-sm font-medium text-nordic-100">
            Om VINX-indeksen
          </Link>
          <Link href="/fund" className="rounded-md border border-white/15 hover:border-nordic-400 px-4 py-2 text-sm font-medium text-nordic-100">
            Om Tromsø-fondet
          </Link>
          <Link href="/thesis" className="rounded-md border border-white/15 hover:border-nordic-400 px-4 py-2 text-sm font-medium text-nordic-100">
            PhD-prosjektutkast
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Konstituenter" value={allStocks.length.toString()} hint="VINX Small Cap EUR NI, mai 2026" />
        <StatCard label="Land" value={byCountry.length.toString()} hint="Sverige, Danmark, Finland, Island" />
        <StatCard label="Sektorer" value={bySector.length.toString()} hint="GICS-lignende klassifisering" />
        <StatCard label="Fondsstørrelse" value="NOK 15 mrd" hint="Tildelt 2025-mandatet" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-nordic-100">Fordeling per land</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {byCountry.map((row) => (
              <li key={row.country}>
                <BarRow label={row.country} value={row.count} max={allStocks.length} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-nordic-300">
            Norge er fraværende: VINX-familien dekker Nasdaqs Norden, men
            Oslo Børs (Euronext) er ikke inkludert. Tromsø-fondets mandat
            justerer for SPN-selskap og SPU-utelukkelser.
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-nordic-100">Fordeling per sektor</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {bySector.map((row) => (
              <li key={row.sector}>
                <BarRow label={row.sector} value={row.count} max={allStocks.length} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          title="VINX Small Cap, justert"
          body="VINXSCEURNI er Nasdaqs nordiske small-cap-indeks. Tromsø-mandatet bruker en variant utbyttejustert for FTFs skatteposisjon, og ekskluderer selskap som inngår i SPN samt SPUs utelukkelsesliste."
          href="/indeks"
        />
        <FeatureCard
          title="15 milliarder fra Tromsø"
          body="Et nytt statlig fond etablert med regionalpolitisk forankring i Tromsø. Mandat fra Finansdepartementet, forvaltet av en ny enhet under Folketrygdfondet."
          href="/fund"
        />
        <FeatureCard
          title="BANTHE → PhD"
          body="Masteroppgavens indekseffekt-modell på OSEBX kan utvides til VINX Small Cap. Nordisk small-cap har høyere illikviditet og tydeligere rebalanseringseffekter — godt PhD-grunnlag."
          href="/thesis"
        />
      </section>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-xs uppercase tracking-widest text-nordic-300">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-nordic-50">{value}</div>
      <div className="mt-1 text-xs text-nordic-300">{hint}</div>
    </div>
  );
}

function BarRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-nordic-100">
        <span>{label}</span>
        <span className="tabular-nums text-nordic-300">{value} <span className="text-nordic-400/70">({pct}%)</span></span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-nordic-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FeatureCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="glass rounded-xl p-6 card-hover block">
      <h3 className="text-lg font-semibold text-nordic-100">{title}</h3>
      <p className="mt-2 text-sm text-nordic-200">{body}</p>
      <p className="mt-4 text-xs text-nordic-400">Les mer →</p>
    </Link>
  );
}
