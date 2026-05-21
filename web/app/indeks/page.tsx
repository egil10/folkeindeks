import Link from "next/link";
import { allStocks, statsByCountry, statsBySector } from "@/lib/stocks";

export const metadata = {
  title: "VINX Small Cap EUR NI — Folkeindeks",
  description:
    "VINX Small Cap EUR NI (VINXSCEURNI) — Nasdaq Nordic small-cap referanseindeks som danner utgangspunktet for SFTX, Tromsø-fondets justerte referanse.",
};

export default function IndexPage() {
  const byCountry = statsByCountry();
  const bySector = statsBySector();

  return (
    <article className="space-y-14 prose-soft">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Indeks · Nasdaq Nordic
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          VINX Small Cap EUR NI <span className="text-ink-400">(VINXSCEURNI)</span>
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Den nordiske small-cap-indeksen som ligger til grunn for SFTX —
          Tromsø-fondets referanseindeks. Konstruert av Nasdaq Nordic, vektet
          på free-float-markedsverdi, rekonstituert halvårlig.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card title="Konstituenter, snapshot">{allStocks.length}</Card>
        <Card title="Vekting">Free-float justert mcap</Card>
        <Card title="Rebalansering">Halvårlig (juni / desember)</Card>
        <Card title="Valuta / return">EUR · Net Return (NI)</Card>
        <Card title="Universfilter">Bunn ~22,5 % av mcap-rangering</Card>
        <Card title="Likviditetsbuffer">Krav om handelsvolum</Card>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hva betyr suffiksene?
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong className="text-ink-900">VINX</strong> — Nasdaq Nordics
            felles indeksfamilie. Inkluderte tidligere Oslo Børs, men Euronexts
            overtagelse i 2019 koblet av norske data fra de aktive
            small-cap-segmentene.
          </li>
          <li>
            <strong className="text-ink-900">SC</strong> — Small Cap. Det
            laveste mcap-segmentet i Nasdaq Nordics indeksstruktur.
          </li>
          <li>
            <strong className="text-ink-900">EUR</strong> — Indeksen rapporteres
            i euro. DKK/SEK/ISK-varianter eksisterer parallelt med identiske
            konstituenter; bare valutaomregningen skiller seg.
          </li>
          <li>
            <strong className="text-ink-900">NI</strong> — Net Return Index.
            Utbytter reinvesteres etter kildeskatt. PI (price) og GI (gross
            dividends) finnes parallelt.
          </li>
        </ul>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink-900">Land i universet</h3>
          <ul className="mt-4 space-y-2 text-[13px]">
            {byCountry.map((row) => (
              <li
                key={row.country}
                className="flex justify-between text-ink-700"
              >
                <span>{row.country}</span>
                <span className="tabular-nums text-ink-900">{row.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] text-ink-500 leading-relaxed">
            Norge er fraværende i nåværende sammensetning. Tromsø-mandatet
            legger Oslo Børs-selskaper tilbake indirekte via SPN-eksklusjonen.
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink-900">Sektorfordeling</h3>
          <ul className="mt-4 space-y-2 text-[13px]">
            {bySector.map((row) => (
              <li
                key={row.sector}
                className="flex justify-between text-ink-700"
              >
                <span>{row.sector}</span>
                <span className="tabular-nums text-ink-900">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Justeringen Tromsø-fondet gjør
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Mandatet for Statens fond i Tromsø (FOR-2024-08-12-2096) bruker en
          avledet indeks, ikke off-the-shelf VINXSCEURNI:
        </p>
        <blockquote className="text-[14px] text-ink-900 leading-relaxed">
          «VINX Small Cap utbyttejustert for Folketrygdfondets skatteposisjon,
          eksklusive selskaper som inngår i Statens pensjonsfond Norge sin
          referanseindeks, og selskaper utelukket av Statens pensjonsfond utland.»
        </blockquote>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Folketrygdfondet refererer internt til indeksen som{" "}
          <strong className="text-ink-900">SFTX</strong>: ca. 344 selskaper og{" "}
          <span className="tabular-nums">~NOK 1 500 mrd</span> i free-float-justert
          markedsverdi. Geografisk fordeling: Sverige 50 % · Danmark 22 % ·
          Finland 13 % · Norge 9 % · Island 6 %. Sektorvekter: Industri 28 % ·
          Helse 25 % · Finans 21 %.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hva forsvinner i justeringen?
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong className="text-ink-900">SPN-selskaper</strong> — store
            norske/nordiske selskaper Folketrygdfondet allerede eier via SPN.
            Tas ut for å unngå dobbeltdekning av eierskap.
          </li>
          <li>
            <strong className="text-ink-900">SPU-utelukkelser</strong> — selskaper
            utelukket av Norges Banks etiske råd og SPUs observasjonsliste
            (tobakk, kontroversielle våpen, alvorlige miljøforhold, m.fl.).
          </li>
          <li>
            <strong className="text-ink-900">Skatteposisjon</strong> — utbyttene
            justeres for FTFs egen kildeskattposisjon, som er forskjellig fra
            EUR NI-instrumentets antakelse.
          </li>
        </ul>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Aktiv ramme
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Mandatet tillater en forventet relativ volatilitet på inntil{" "}
          <strong className="text-ink-900">5 prosentpoeng</strong>, maks 5 % i
          ett enkelt selskap, og forbyr shortsalg. Det er omtrent 67 % mer
          aktiv plass enn på SPN — der grensen er 3 pp.
        </p>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Innenfor denne rammen kan flere strategier kombineres — se{" "}
          <Link
            href="/strategier"
            className="text-accent-700 hover:text-accent-900 underline underline-offset-4"
          >
            de fem mulige forvaltningsstrategiene
          </Link>{" "}
          som FTF og Finansdepartementet diskuterer i mandatutformingen.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Kilder
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-1.5 list-disc pl-5">
          <li>
            <a
              href="https://www.nasdaq.com/european-market-activity/indexes/vinxsceurni?id=IX9168"
              target="_blank"
              rel="noreferrer"
              className="text-accent-700 hover:text-accent-900 underline underline-offset-4"
            >
              Nasdaq — VINXSCEURNI Summary
            </a>
          </li>
          <li>
            <code className="text-ink-700">pdfs/Methodology_VINX.pdf</code>
          </li>
          <li>
            <code className="text-ink-700">
              pdfs/Mandat for forvaltningen av Statens fond i Tromsø — Lovdata.pdf
            </code>
          </li>
        </ul>
      </section>
    </article>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">{title}</div>
      <div className="mt-2 text-base text-ink-900">{children}</div>
    </div>
  );
}
