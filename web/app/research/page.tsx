import Link from "next/link";

export const metadata = {
  title: "Research-notater — Folkeindeks",
  description:
    "Synteser fra PDF-grunnlaget og webresearch: VINX, Statens fond i Tromsø, Folketrygdfondet, forvaltningsstrategier og BANTHE-utvidelse.",
};

const notes = [
  {
    slug: "vinx",
    title: "VINX-indeksfamilien og VINXSCEURNI",
    blurb:
      "Hva «VINX», «SC», «EUR» og «NI» faktisk betyr. Konstruksjon, rebalansering, valuta og hvorfor Norge er fraværende.",
    file: "docs/research_vinx.md",
  },
  {
    slug: "tromso",
    title: "Statens fond i Tromsø — det formelle mandatet",
    blurb:
      "15 mrd. kr, åpnet 2. juni 2025, forvaltet av en ny enhet under Folketrygdfondet. Referanseindeks SFTX, 5 pp TE-ramme.",
    file: "docs/research_tromso.md",
  },
  {
    slug: "folketrygdfondet",
    title: "Folketrygdfondet — institusjon, mandat og Tromsø-koblingen",
    blurb:
      "Lovgrunnlag, SPN-mandatet (60/40 aksjer/renter, 85/15 Norge/Norden), ph.d.-stillingen og strategien 2026–2029.",
    file: "docs/research_folketrygdfondet.md",
  },
  {
    slug: "strategier",
    title: "Fem forvaltningsstrategier — hvor passer en PhD?",
    blurb:
      "Indeks, indeks pluss, faktor, fundamental og ekstern forvalter. Risikorammer, FTFs eksisterende kompetanse, ML/AI-vinkler.",
    file: "docs/research_strategier.md",
  },
  {
    slug: "banthe",
    title: "BANTHE → PhD-utvidelse",
    blurb:
      "Replikering av indekseffekt-modellen på nordisk small cap, restriksjoner fra SFT-mandatet og et 3-års prosjektutkast.",
    file: "docs/research_banthe_extension.md",
  },
];

export default function ResearchPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Research
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          Underlagsnotater
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Fem dyptpløyende notater syntetisert fra mandater, lovverk,
          forvaltningsrapporter, Nasdaq-metodikk og masteroppgaven. Bruk dem
          som rask innledning før intervjuet — full tekst ligger i{" "}
          <code className="text-ink-700">docs/</code> i repoet.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((n) => (
          <li key={n.slug} className="card card-hover p-6 space-y-2">
            <h2 className="text-sm font-semibold text-ink-900">{n.title}</h2>
            <p className="text-[13px] text-ink-600 leading-relaxed">{n.blurb}</p>
            <p className="text-[11px] text-ink-500">
              <code>{n.file}</code>
            </p>
          </li>
        ))}
      </ul>

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Sentrale faktasprek
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong className="text-ink-900">Referanseindeksen er ikke off-the-shelf VINXSCEURNI</strong> — den er utbyttejustert for FTFs skatteposisjon og ekskluderer SPN-selskap + SPU-utelukkelser.
          </li>
          <li>
            <strong className="text-ink-900">VINX-familien drives av Nasdaq Nordic</strong> — Oslo Børs er ute siden Euronext-overtagelsen i 2019, men Tromsø-mandatets justering legger norske small-caps tilbake inn via SPN-eksklusjonen.
          </li>
          <li>
            SFTX-universet er ca. 344 selskaper og ~NOK 1 500 mrd free-float MV (FTF Q1 2026).
          </li>
          <li>
            Aktiv forvaltning innenfor <strong className="text-ink-900">5 pp TE</strong> — en stor ramme målt mot SPN-mandatets 3 pp.
          </li>
          <li>
            SFT passerte 5-mrd-grensen 9. oktober 2025 og er nå GIPS-rapporterende. Q1 2026: −10,4 % med +20 bp alfa.
          </li>
          <li>
            SPN 2025: +12,7 % med +76 bp brutto alfa. Siden 2007: +0,99 pp/år, ~69 mrd. kumulativ meravkastning.
          </li>
          <li>
            Ph.d.-stillingen er en nærings-ph.d., 3 år, betinget av NFR-finansiering og UiT-opptak. Minst ett år i Tromsø. Arbeidsspråk norsk.
          </li>
        </ul>
      </section>

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Spørsmål du sannsynlig får
        </h2>
        <ol className="text-[14px] text-ink-600 space-y-2 list-decimal pl-5 leading-relaxed">
          <li>
            «Hvilken av de fem forvaltningsstrategiene tror du SFT bør lene seg mest på?» —{" "}
            <Link href="/strategier" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">vurder enhanced indexing og datadrevet fundamental</Link>.
          </li>
          <li>
            «Hvordan vil du skille indekseffekt fra alminnelig small-cap-momentum?» — Event-windows + placebo-tests + cross-sectional momentum-kontroll (Fama-French).
          </li>
          <li>
            «Hvorfor passer BANTHE for et fond som ikke kan shortsalge?» — Undervekting og rebalanseringstiming alene fanger ~halvparten av long-short-alfaen.
          </li>
          <li>
            «Hva er datatilgangen for islandsk del av indeksen?» — Anerkjenn at den er tynn, foreslå robust-validation og Bayesiansk hierarkisk skrumpning.
          </li>
          <li>
            «Hvordan måler du om strategien er bærekraftig — at den ikke ødelegger seg selv?» — Capacity-analyse + adversarial-execution-modell.
          </li>
          <li>
            «Hvordan vil du publisere uten å gi bort SFTs alfa?» — Open-source metodikk, lukket dataversjon, etterskuddsvis publisering.
          </li>
        </ol>
      </section>
    </article>
  );
}
