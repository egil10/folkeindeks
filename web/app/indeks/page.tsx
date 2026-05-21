import Link from "next/link";
import { allStocks, statsByCountry, statsBySector } from "@/lib/stocks";

export const metadata = {
  title: "VINX Small Cap EUR NI — Folkeindeks",
  description: "VINX Small Cap EUR NI (VINXSCEURNI) — Nasdaq Nordic small-cap referanseindeks brukt som utgangspunkt for Statens fond i Tromsø.",
};

export default function IndexPage() {
  const byCountry = statsByCountry();
  const bySector = statsBySector();

  return (
    <article className="space-y-10 prose-invert">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-nordic-400">Indeks · Nasdaq Nordic</p>
        <h1 className="text-3xl font-semibold text-nordic-50">VINX Small Cap EUR NI (VINXSCEURNI)</h1>
        <p className="text-nordic-200 max-w-3xl">
          Den nordiske small-cap-indeksen som danner ryggraden i Tromsø-mandatet.
          Konstruert av Nasdaq Nordic, vektet på free-float-markedsverdi,
          rekonstituert halvårlig (juni og desember).
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Konstituenter (snapshot)">{allStocks.length}</Card>
        <Card title="Vekting">Free-float justert mcap</Card>
        <Card title="Rebalansering">Halvårlig (juni / desember)</Card>
        <Card title="Currency / return">EUR · Net Return (NI)</Card>
        <Card title="Universfilter">Bunn ~22,5 % av mcap-rangering</Card>
        <Card title="Likviditetsbuffer">Krav om handelsvolum</Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Hva betyr suffiksene?</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li><strong>VINX</strong> — Nasdaq Nordic + Oslo Børs felles indeksfamilie (sammenslått 2006). I praksis viser VINX Small Cap-instrumentene per i dag null NOK-papirer fordi Oslo Børs ble overtatt av Euronext i 2019 og koblet av som datakilde for de aktive small cap-segmentene.</li>
          <li><strong>SC</strong> — Small Cap. Det laveste mcap-segmentet.</li>
          <li><strong>EUR</strong> — Indeksen kalkuleres i euro. Det finnes også DKK/SEK/ISK/NOK-varianter med samme konstituenter, kun valutaomregning skiller seg.</li>
          <li><strong>NI</strong> — Net Return Index. Utbytter reinvesteres etter kildeskatt. PI (price index) og GI (gross dividends reinvested) finnes parallelt.</li>
        </ul>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-nordic-100">Land i universet</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {byCountry.map((row) => (
              <li key={row.country} className="flex justify-between text-nordic-200">
                <span>{row.country}</span>
                <span className="tabular-nums text-nordic-100">{row.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-nordic-300">
            Norge er fraværende i nåværende sammensetning av VINXSCEURNI.
            Tromsø-mandatets justering legger Oslo Børs-univers <em>tilbake inn</em>
            indirekte via «utbyttejustert for FTFs skatteposisjon» og SPN-eksklusjon.
          </p>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-nordic-100">Sektorfordeling</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {bySector.map((row) => (
              <li key={row.sector} className="flex justify-between text-nordic-200">
                <span>{row.sector}</span>
                <span className="tabular-nums text-nordic-100">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Justeringen Tromsø-fondet gjør</h2>
        <p className="text-sm text-nordic-200">
          Mandatet for Statens fond i Tromsø (§ 2-1) refererer ikke direkte til
          VINXSCEURNI, men til en avledet indeks:
        </p>
        <blockquote className="border-l-2 border-nordic-500 pl-4 italic text-nordic-100">
          «VINX Small Cap utbyttejustert for Folketrygdfondets skatteposisjon,
          eksklusive selskaper som inngår i Statens pensjonsfond Norge sin
          referanseindeks, og selskaper utelukket av Statens pensjonsfond utland.»
        </blockquote>
        <p className="text-sm text-nordic-200">
          Folketrygdfondet refererer internt til indeksen som <strong>SFTX</strong>:
          344 selskaper, ca. 1 506 mrd. kr i free-float-justert markedsverdi
          (kilde: FTF Q1 2026), med en geografisk vekt på rundt 50 % Sverige,
          22 % Danmark, 13 % Finland, 9 % Norge og 6 % Island. Sektorvekter:
          industri ~28 %, helse ~25 %, finans ~21 %.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Hva forsvinner i justeringen?</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li><strong>SPN-selskaper</strong> — store norske selskaper Folketrygdfondet allerede eier via SPN (Statens pensjonsfond Norge). Disse trekkes ut for å unngå dobbeltdekning.</li>
          <li><strong>SPU-utelukkelser</strong> — selskaper utelukket av Norges Banks etiske råd / SPU sin observasjonsliste (tobakk, kontroversielle våpen, alvorlige miljøforhold m.fl.).</li>
          <li><strong>Skatteposisjon</strong> — utbyttene justeres for at FTF har en annen kildeskattposisjon enn EUR-NI-instrumentet forutsetter.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Aktiv ramme</h2>
        <p className="text-sm text-nordic-200">
          Mandatet tillater en forventet relativ volatilitet (tracking error)
          på inntil <strong>5 prosentpoeng</strong>, maks 5 % i ett enkelt selskap,
          og forbyr shortsalg. Det er omtrent 2,5× rammen FTF har på SPN —
          plass for en aktiv ML-drevet strategi.
        </p>
        <p className="text-sm text-nordic-200">
          Se også <Link href="/thesis" className="text-nordic-300 hover:text-white">PhD-prosjektutkastet</Link> for hvordan denne rammen utnyttes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Kilder</h2>
        <ul className="text-sm text-nordic-200 space-y-1 list-disc pl-5">
          <li><a href="https://www.nasdaq.com/european-market-activity/indexes/vinxsceurni?id=IX9168" target="_blank" rel="noreferrer" className="text-nordic-300 hover:text-white underline">Nasdaq — VINXSCEURNI Summary</a></li>
          <li>Methodology_VINX.pdf (lagret i <code>pdfs/</code>)</li>
          <li>Mandat for forvaltningen av Statens fond i Tromsø — Lovdata</li>
        </ul>
      </section>
    </article>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-[10px] uppercase tracking-widest text-nordic-400">{title}</div>
      <div className="mt-2 text-lg text-nordic-50">{children}</div>
    </div>
  );
}
