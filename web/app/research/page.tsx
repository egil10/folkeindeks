import Link from "next/link";

export const metadata = {
  title: "Research-notater — Folkeindeks",
  description: "Synteser fra PDF-grunnlaget og webresearch: VINX, Statens fond i Tromsø, Folketrygdfondet og BANTHE-utvidelse.",
};

const notes = [
  {
    slug: "vinx",
    title: "VINX-indeksfamilien og VINXSCEURNI",
    blurb:
      "Hva 'VINX', 'SC', 'EUR' og 'NI' faktisk betyr. Konstruksjon, rebalansering, valuta og hvorfor Norge er fraværende.",
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
      "Lovgrunnlag, SPN-mandatet, ph.d.-stillingen i Tromsø og hvorfor den koples til UiT.",
    file: "docs/research_folketrygdfondet.md",
  },
  {
    slug: "banthe",
    title: "BANTHE → PhD-utvidelse",
    blurb:
      "Replikering av indekseffekt-modellen på nordisk small cap, restriksjoner fra SFT-mandatet, og et 3-års prosjektutkast.",
    file: "docs/research_banthe_extension.md",
  },
];

export default function ResearchPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-nordic-400">Research</p>
        <h1 className="text-3xl font-semibold text-nordic-50">Underlagsnotater</h1>
        <p className="text-nordic-200 max-w-3xl">
          Fire dyptpløyende notater syntetisert fra mandater, lovverk,
          forvaltningsrapporter, Nasdaq-metodikk og masteroppgaven. Bruk dem
          som rask innledning før intervjuet — full tekst ligger i{" "}
          <code className="text-nordic-300">docs/</code> i repoet.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map((n) => (
          <li key={n.slug} className="glass rounded-xl p-6 space-y-2 card-hover">
            <h2 className="text-lg font-semibold text-nordic-100">{n.title}</h2>
            <p className="text-sm text-nordic-200">{n.blurb}</p>
            <p className="text-xs text-nordic-400">
              <code>{n.file}</code>
            </p>
          </li>
        ))}
      </ul>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Sentrale faktasprek</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li>Referanseindeksen er <em>ikke</em> off-the-shelf VINXSCEURNI — den er utbyttejustert for FTFs skatteposisjon og ekskluderer SPN-selskap + SPU-utelukkelser.</li>
          <li>VINX-familien drives av Nasdaq Nordic — Oslo Børs er ute siden Euronext-overtagelsen, men Tromsø-mandatets justering legger norske small caps tilbake inn via SPN-eksklusjonen.</li>
          <li>SFTX-universet er ca. 344 selskaper og 1 506 mrd. kr (FTF Q1 2026).</li>
          <li>Aktiv forvaltning innenfor 5 pp TE — en stor ramme målt mot SPN-mandatets ~2 %.</li>
          <li>SFT Q1 2026: –10,4 %. Fullt investert ved utgangen av 2025.</li>
          <li>Ph.d.-stillingen er en nærings-ph.d., 3 år, i samarbeid med UiT — frist 4. mai 2026.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Spørsmål du sannsynlig får</h2>
        <ol className="text-sm text-nordic-200 space-y-2 list-decimal pl-5">
          <li>«Hvordan vil du skille indekseffekt fra alminnelig small-cap-momentum?» — Forslag: event-windows + placebo-tests + cross-sectional momentum-kontroll (Fama-French).</li>
          <li>«Hvorfor passer BANTHE for et fond som ikke kan shortsalge?» — Vis hvordan undervekting og rebalanseringstiming alene fanger ~halvparten av long-short-alfaen.</li>
          <li>«Hva er datatilgangen for islandsk del av indeksen?» — Anerkjenn at den er tynn, foreslå robust-validation og Bayesiansk hierarkisk skrumpning.</li>
          <li>«Hvordan måler du om strategien er bærekraftig — at den ikke ødelegger seg selv?» — Capacity-analyse + adversarial-execution-modell.</li>
          <li>«Hvordan vil du publisere forskningen uten å gi bort SFTs alfa?» — Open-source metodikk, lukket dataversjon, etterskuddsvis publisering.</li>
        </ol>
      </section>
    </article>
  );
}
