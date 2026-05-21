import Link from "next/link";

export const metadata = {
  title: "Bakgrunn — Folkeindeks",
  description:
    "Hvordan CV-en (BANTHE, DNB Asset Management, Finansdepartementets aktivforvaltningsavdeling, Norges Bank, UiO matematikk) treffer hver av de fem forvaltningsstrategiene for SFT.",
};

const experiences = [
  {
    title: "DNB Asset Management",
    role: "Asset Management Intern · DNB Global Enhanced Index + DNB Future Waves",
    when: "Juni 2023 – januar 2024",
    where: "Oslo",
    points: [
      "Bygde en kvantitativ monitor for «dually listed equities» — prototypet i Python, implementert i Bloomberg.",
      "Direkte praktisk eksponering for «Indeks pluss»-forvaltning: dual-listing-arbitrage er en av NBIMs uttalte meravkastningskilder.",
      "Lærte teoretisk og operasjonell forskjell mellom passiv indeks og enhanced indexing.",
    ],
    fit: { 2: "Direkte", 3: "Indirekte" },
  },
  {
    title: "Norwegian School of Economics (NHH) — Master thesis",
    role: "BANTHE — Exploiting the Index Effect on OSEBX using Machine Learning",
    when: "Levert juni 2024",
    where: "Bergen",
    points: [
      "Predikerte OSEBX-indeksendringer med GLM + XGBoost.",
      "Slo benchmarken med +11,4 % årlig innenfor 2 % TE-ramme i 2002–2024.",
      "Indekseffekt på ~10 % på tillegg og ~60 % på sletting i de 100 handelsdagene før effective date.",
      "MSc GPA 4,50/5,00 (A), top 21 %. Coursework i statistisk læring og forecasting.",
    ],
    fit: { 2: "Direkte", 3: "Delvis (faktor-features)" },
  },
  {
    title: "Finansdepartementet — Aktivforvaltningsavdelingen",
    role: "Asset Management Intern (100 %)",
    when: "August – oktober 2025",
    where: "Oslo",
    points: [
      "Direkte oversikt over investeringsmandatet for Statens pensjonsfond utland (SPU / Oljefondet).",
      "Forstod mandatutforming fra Finansdepartementets side — hvordan TE-rammer, faktor-tilt og aktiv forvaltning vurderes politisk og operasjonelt.",
      "Sjelden komplementær perspektiv: jeg har sett mandatet fra både Finansdepartementets utformingsside og fra forvaltersiden (DNB).",
    ],
    fit: { 1: "Indirekte", 2: "Indirekte", 3: "Indirekte", 4: "Indirekte", 5: "Indirekte" },
  },
  {
    title: "Norges Bank — NBA Finance",
    role: "Finance Intern (40 %)",
    when: "September 2024 – august 2025",
    where: "Oslo",
    points: [
      "Bygde kvantitative Power BI-dashboards med SQL for strategi, budsjettering og finansiell rapportering.",
      "Operasjonell quant og dataingeniør-erfaring — relevant for systemstack i strategi 1, 3, 4.",
    ],
    fit: { 1: "Indirekte", 3: "Indirekte", 4: "Indirekte" },
  },
  {
    title: "Wellvector AI",
    role: "Investment Intern (20 %)",
    when: "Februar – mars 2025",
    where: "Stavanger",
    points: [
      "Sikret USD 100 000 i finansiering fra Innovasjon Norge til en AI-startup for petroleumsindustrien.",
      "Direkte berøring med generativ AI-modellutvikling i kommersiell setting.",
    ],
    fit: { 4: "Indirekte" },
  },
  {
    title: "Kukula Capital",
    role: "Visiting Associate (100 %) — Asset Management & Private Equity",
    when: "Januar – juni 2026 (nå)",
    where: "Lusaka, Zambia",
    points: [
      "Pågående 100 %-engasjement i et afrikansk impact-/PE-fond.",
      "Frontier-marked-eksponering; kompetanse i due diligence av eksterne aktører.",
      "Teoretisk relevant for «utvelgelse av eksterne forvaltere»-strategien.",
    ],
    fit: { 5: "Delvis" },
  },
  {
    title: "Universitetet i Oslo — BSc Matematikk",
    role: "Pågående, spesialiserer i statistikk og stokastisk analyse",
    when: "August 2024 – pågående",
    where: "Oslo",
    points: [
      "Mål: master i mathematical finance og energi.",
      "Bygger matematisk dybde — direkte relevant for probabilistisk modellering og stokastisk kontroll.",
    ],
    fit: { 3: "Direkte", 4: "Direkte" },
  },
  {
    title: "Norwegian School of Economics (NHH)",
    role: "MSc Economics & Business Administration | GPA 4,50/5,00 (top 21 %)",
    when: "August 2019 – juni 2024",
    where: "Bergen",
    points: [
      "Coursework i statistisk læring og forecasting.",
      "Internship in Asset Management (20/130 plasser).",
      "TA Mikroøkonomi, RA Behavioural Economics.",
      "Utveksling: Peking University Guanghua (Top 1 i Kina), GPA 83/100.",
    ],
    fit: { 2: "Indirekte", 3: "Indirekte" },
  },
  {
    title: "Royal Norwegian Embassy in Beijing",
    role: "Diplomatic Intern (100 %)",
    when: "Januar – august 2024",
    where: "Beijing",
    points: [
      "Økonomi- og klima/miljø-porteføljer; valuta, FDI og markedstrender-analyse.",
      "Internasjonal og kulturell breddekompetanse; mandarin-evne (HSK 4/5).",
    ],
    fit: {},
  },
];

type Fit = "Direkte" | "Sterk" | "Delvis" | "Indirekte";

const fitTone: Record<Fit, string> = {
  Direkte: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Sterk: "bg-accent-50 text-accent-800 border-accent-200",
  Delvis: "bg-amber-50 text-amber-800 border-amber-200",
  Indirekte: "bg-ink-50 text-ink-700 border-ink-200",
};

const strategiMap = [
  { key: 1, label: "Indeks" },
  { key: 2, label: "Indeks pluss" },
  { key: 3, label: "Faktor" },
  { key: 4, label: "Fundamental" },
  { key: 5, label: "Ekstern" },
];

export default function BakgrunnPage() {
  return (
    <article className="space-y-14 prose-soft">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Bakgrunn · Egil Furnes
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          CV-en møter mandatet
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          En ærlig kartlegging av hvor min bakgrunn treffer hver av de fem
          forvaltningsstrategiene som Finansdepartementet og FTF diskuterer for
          SFT. Tendensen er klart enhanced indexing — men intervjuet skal vise
          reell interesse for hele spekteret, og være tydelig på hvor PhD-en
          skal bygge ny kompetanse.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card label="Mastergrad">
          MSc Economics &amp; Business, NHH (GPA 4,50 / 5,00 · top 21 %)
        </Card>
        <Card label="Master thesis">
          BANTHE — slo OSEBX med 11,4 % årlig
        </Card>
        <Card label="Pågående">
          BSc Matematikk, UiO — statistikk + stokastisk analyse
        </Card>
        <Card label="DNB-erfaring">
          DNB Global Enhanced Index + dual-listed monitor
        </Card>
        <Card label="Statlig perspektiv">
          Finansdepartementets aktivforvaltningsavdeling — SPU-mandatet
        </Card>
        <Card label="Quant-stack">
          Norges Bank · SQL + Power BI-dashboards
        </Card>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Tre uvanlige kombinasjoner
        </h2>
        <ol className="text-[14px] text-ink-700 space-y-3 list-decimal pl-5 leading-relaxed">
          <li>
            <strong className="text-ink-900">Sett mandatet fra innsiden</strong>{" "}
            (Finansdepartementets aktivforvaltningsavdeling)
            <strong className="text-ink-900"> og fra forvaltersiden</strong>{" "}
            (DNB Asset Management). Sjelden å ha begge perspektiver så tidlig i
            karrieren.
          </li>
          <li>
            <strong className="text-ink-900">Konkrete enhanced-indexing-leveranser</strong> — DNB Global Enhanced Index-teamets dual-listed-monitor og BANTHEs 11,4 % over OSEBX er to dokumenterte resultater i samme strategi-rute.
          </li>
          <li>
            <strong className="text-ink-900">Sterk matematisk profil</strong> — UiO BSc i matematikk med spesialisering i statistikk og stokastisk analyse, mot master i mathematical finance og energi. Åpner for de mer kvantitative strategiene 3 og 4 på lengre sikt.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest max-w-prose">
          Hver erfaring kartlagt mot de fem strategiene
        </h2>
        <ul className="space-y-4">
          {experiences.map((exp) => (
            <li key={exp.title} className="card p-6">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <h3 className="text-base font-semibold text-ink-900">
                    {exp.title}
                  </h3>
                  <p className="text-[13px] text-ink-600 mt-0.5">{exp.role}</p>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-ink-500 mt-1">
                    {exp.where} · {exp.when}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 max-w-[280px] justify-end">
                  {strategiMap.map((s) => {
                    const fitVal = (exp.fit as Record<number, string>)[s.key];
                    if (!fitVal) return null;
                    const tone = fitTone[fitVal as Fit] || fitTone.Indirekte;
                    return (
                      <span
                        key={s.key}
                        className={`inline-flex items-center px-2 py-0.5 border rounded text-[10px] uppercase tracking-[0.1em] ${tone}`}
                      >
                        {s.key}. {s.label}: {fitVal}
                      </span>
                    );
                  })}
                </div>
              </div>
              <ul className="mt-4 text-[13px] text-ink-700 space-y-1.5 list-disc pl-5 leading-relaxed">
                {exp.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hva jeg mangler — og hvordan PhD-en skal fylle det
        </h2>
        <ul className="text-[14px] text-ink-700 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong className="text-ink-900">Generativ AI / LLMs anvendt på finansielle dokumenter</strong> — sentralt i strategi 4. Begrenset hands-on-erfaring i dag, men noe eksponering via Wellvector AI.
          </li>
          <li>
            <strong className="text-ink-900">Agent-baserte systemer</strong> — kjenner teorien, har ikke bygget multi-agent-rammeverk i produksjon. Klar prioritert læringskurve.
          </li>
          <li>
            <strong className="text-ink-900">Skalerbar AI-arkitektur</strong> — Norges Bank-erfaringen gir dataingeniør-grunnlag, men ikke produksjonssetting av ML-signaler i en forvaltningsmiljø.
          </li>
          <li>
            <strong className="text-ink-900">Nordisk small-cap-spesifikk markedsforståelse</strong> — BANTHE er OSEBX. SFTX-universets norske halvdel kjenner jeg fra Finansdepartementet og DNB; svensk/dansk/finsk/islandsk del må læres.
          </li>
        </ul>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Min posisjonering inn i intervjuet
        </h2>
        <p className="text-[14px] text-ink-700 leading-relaxed">
          Jeg har konkrete, dokumenterte ferdigheter i{" "}
          <Link href="/strategier#strategi-2" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">strategi 2 (Enhanced Indexing)</Link>{" "}
          — BANTHE, dual-listed-monitor og DNB Global Enhanced Index-internship er tre uavhengige bevis. Men jeg er ikke en kandidat som låser seg til én strategi. PhD-en er ment å bygge ny dybde i{" "}
          <Link href="/strategier#strategi-4" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">strategi 4 (datadrevet fundamental)</Link>{" "}
          via generativ AI og agenter, mens jeg holder kontakt med 1, 3 og 5
          gjennom kontroll-eksperimenter og side-prosjekter. Det er den
          posisjonen jeg ønsker å formidle: en enhanced-index-grunnstein med
          AI-vekstambisjon, ikke et single-track-prosjekt.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Side ved siden av jobben
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li><strong className="text-ink-900">Mandarin</strong> — HSK 4/5 (B2/C1), 360-timer intensiv ved National Taiwan University, 3× norgesmester i Chinese Bridge (2017, 2019, 2023).</li>
          <li><strong className="text-ink-900">Running Club ved NHH</strong> — Head of Markets, USD 20 000 i sponsorater, Bergen–Oslo-stafett med 300 deltakere.</li>
          <li><strong className="text-ink-900">Diplomatisk praktikant</strong> i Beijing, Royal Norwegian Embassy (2024).</li>
        </ul>
      </section>
    </article>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">{label}</div>
      <div className="mt-2 text-[13px] text-ink-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
