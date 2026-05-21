import Link from "next/link";

export const metadata = {
  title: "Fem forvaltningsstrategier — Folkeindeks",
  description:
    "Finansdepartementets fem strategier for Statens fond i Tromsø — indeks, enhanced indexing, faktor, fundamental og ekstern forvalter. Hvor passer en PhD i AI/data-analyse, og hvor er min komparative fordel?",
};

type Fit = "Toppmatch" | "Sterk" | "Delvis" | "Svak";

const fitTone: Record<Fit, string> = {
  Toppmatch: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Sterk: "bg-accent-50 text-accent-800 border-accent-200",
  Delvis: "bg-amber-50 text-amber-800 border-amber-200",
  Svak: "bg-ink-50 text-ink-700 border-ink-200",
};

export default function StrategierPage() {
  return (
    <article className="space-y-14 prose-soft">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Forvaltning · 5 strategier
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          Fem mulige strategier for SFT
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Finansdepartementet ba Folketrygdfondet drøfte hva som vil være
          hensiktsmessige risikorammer i SFT-mandatet — og koblet eksplisitt
          spørsmålet om aktiv forvaltning til hvilken strategi som velges.
          Fem strategier er på bordet, hver med ulike systemkrav, ulike
          risikorammer og ulike implikasjoner for et ph.d.-prosjekt. Denne
          siden går gjennom alle fem, ærlig om hvor min komparative fordel
          ligger.
        </p>
      </header>

      <section className="card p-6 max-w-prose">
        <h2 className="text-sm font-semibold text-ink-900">
          Mandatet sier dette
        </h2>
        <blockquote className="mt-3 text-[14px] text-ink-900 leading-relaxed">
          «Finansdepartementet ber videre om at Folketrygdfondet drøfter hva
          som vil være hensiktsmessige risikorammer i mandatet for SFT, herunder
          ramme for forventet relativ volatilitet. Vurderingen av hva som anses
          å være en hensiktsmessig grad av aktiv forvaltning bør begrunnes, og
          det skal tas hensyn til mulighetene for å oppnå fortrinn i lys av
          Folketrygdfondets eksisterende kompetanse.»
        </blockquote>
        <p className="mt-3 text-[12px] text-ink-500">
          Fra utredning av mandatendringer for Statens pensjonsfond Norge og
          opprettelsen av SFT.
        </p>
      </section>

      <Strategy
        number={1}
        title="Indeksforvaltning"
        subtitle="Passiv replikering av referanseindeksen"
        te="< 0,5 pp"
        risikoramme="Veldig lav. Ingen aktivt element ut over rebalanseringsstøy."
        hvaDetEr="Forvaltningen minimerer relativ volatilitet til SFTX og forsøker ikke å slå referanseindeksen. Alle valg dreier seg om hvor effektivt man kan replikere et univers på ~344 illikvide nordiske small-caps i fire valutaer."
        krever={[
          "Stratified sampling eller full replication-motor; valg avhenger av hvor mye man kan handle uten å bevege markedet.",
          "FX-hedging for SEK/DKK/EUR/ISK mot NOK.",
          "Effektiv rebalansering rundt halvårlig SFTX-rekonstitusjon (juni/desember).",
          "Lave kostnader; målet er TE og ikke alfa.",
        ]}
        ftfHar="SPN-indekssegmentet gir generell replikeringserfaring. SFTX som univers er nytt, og den islandske halen krever spesialhåndtering."
        phdAngler={[
          "Stratified sampling-optimering: hvor mange (og hvilke) selskaper kan utelates før TE eksploderer? Klassisk konveks optimering møter ML når kovariansestimater er ustabile i små n.",
          "Probabilistisk modellering av cash-flow inn/ut av fondet — Bayesiansk prediksjon av rebalanseringsbehov.",
          "ML for likviditetsprognose: predikere når den islandske ISK-halen er handlbar, og time tilstedeværelsen i markedet.",
          "Mikrostruktur-analyse av nordiske small caps (Roll-spread, Amihud-illiquidity) for å minimere implementation shortfall.",
        ]}
        fit="Delvis"
        fitBegrunnelse="Min matematikk- og statistikkbakgrunn (UiO BSc, NHH MSc) er overførbar, men temaet er fjernere fra BANTHE og DNB Enhanced Index. Et solid, men ikke åpenbart, PhD-tema."
      />

      <Strategy
        number={2}
        title="Indeks pluss"
        subtitle="Enhanced Indexing — NBIMs modell"
        te="0,5–2 pp"
        risikoramme="Moderat. Aktiv alfa hentes fra strukturelle ineffektiviteter; ingen retningsbets."
        hvaDetEr="NBIM kaller dette «enhanced indexing» og bruker det selv. Forvalteren vekter relativ volatilitet, transaksjonskostnader og potensiell meravkastning mot hverandre. Alfa hentes fra aktiv deltakelse i indeksendringer (BANTHE-territorium), selskapshendelser (M&A, spinoffs, kapitalmarkeder), ECM, og feilprising mellom aksjeklasser, dually listed equities, og holdingselskaper som handler med rabatt mot underliggende eierandeler."
        krever={[
          "Index-event-database og prediksjonsmotorer for inn/uttak av SFTX.",
          "Corporate actions-pipeline (M&A, tilbakekjøp, spinoffs, kapitalreduksjoner).",
          "Statistisk arbitrage-modell for dual-class shares (Sverige har mange A/B-strukturer: Investor, Industrivärden, Volvo, ABB).",
          "Modell for holding-rabatt-konvergens — Industrivärden, Investor, Latour, Lundbergs.",
          "Lav-latens handelsfunksjon for å hente effekter rundt event-dato.",
        ]}
        ftfHar="SPN-forvaltningen er per i dag mer fundamental enn enhanced. Tromsø-avdelingen kan bygge dette opp fra start — som er en del av SFT-mandatets eksplisitte motivasjon: vise at man kan tilføre en kvantitativ teknologistakk i FTFs portefølje av kapabiliteter."
        phdAngler={[
          "Direkte BANTHE-utvidelse: ML-modeller for SFTX inn/ut. Hypotese: nordisk small-cap har sterkere og langsommere avtagende effekt enn OSEBX (Biktimirov & Li 2014).",
          "Pre-positioning rundt corporate actions ved hjelp av LLMs på selskapsmeldinger, prospekt og innsidehandel-data.",
          "Statistisk arbitrage på dual-listed-rabatter — direkte forlengelse av mitt DNB-prosjekt.",
          "A/B-aksjeklasse-rabatter i nordiske family firms — modellere når rabatten konvergerer og når den holder seg.",
          "Holding-discount-strategier: probabilistisk regime-modell for når rabatten bryter ut av sitt historiske bånd.",
          "Kapasitetsanalyse: hvor mye av effekten kan en SFT-størrelse investor faktisk fange?",
        ]}
        fit="Toppmatch"
        fitBegrunnelse="Direkte sammenfall. «DNB Global Enhanced Index» var fondsteamet jeg jobbet med ved DNB AM. Min «quantitative monitor for dually listed equities» er kanonisk enhanced-indexing-alfa. BANTHEs 11,4 % over OSEBX er direkte demonstrasjon. Hvis man måler ren komparativ fordel, ligger den her."
      />

      <Strategy
        number={3}
        title="Faktorforvaltning"
        subtitle="Systematisk eksponering mot kvalitet, momentum, low vol, verdi, størrelse"
        te="1–3 pp"
        risikoramme="Moderat–høy. Risikofaktorer kan ha lange drawdowns før de leverer."
        hvaDetEr="Identifisere egenskaper ved aksjer (risikofaktorer) som over tid leverer høyere avkastning enn det brede markedet, og overvekte dem. SFTs lange horisont og forbud mot shortsalg gjør at «den langsiktige investoren som tåler fluktuasjoner» beskrevet i mandatet passer godt til faktoreksponering. Kvalitetsfaktoren brukes allerede i SPN-forvaltningen; momentum, low vol og verdi er naturlige tillegg."
        krever={[
          "Data-pipeline for selskapsspesifikke metrikker (ROE, gjeldsgrad, marginutvikling, prisutvikling).",
          "Optimeringsverktøy som balanserer eksponering mot ulike faktorer mot transaksjonskostnader.",
          "Mer aktiv handel enn fundamental forvaltning, fordi rebalansering skjer hyppigere.",
          "Robust risikomodell og tracking-error-styring.",
        ]}
        ftfHar="Kvalitetsfaktor er allerede operasjonalisert i SPN. En faktormodell for SFTX vil være en utvidelse, men ikke et helt nytt grep."
        phdAngler={[
          "ML-baserte ikke-lineære faktorinteraksjoner — gradient-boosted modeller som fanger samspill quality × momentum × likviditet i nordiske small caps.",
          "Tidsvarierende faktorpremier — Bayesianske hierarkiske modeller for regime-skift på land- og sektor-nivå.",
          "Faktor-konstruksjon i small-cap-universer der klassiske Fama-French-definisjoner svikter (illikviditet, få datapunkter, ISK-hale).",
          "Adversarial / generative modeller — syntetiske scenarier for å stress-teste faktor-allokeringer.",
          "Kausal-inferens på faktor-eksponering vs sektor-eksponering — er kvalitetsfaktoren i SFTX bare en helse-sektorbet?",
        ]}
        fit="Sterk"
        fitBegrunnelse="Min ML-bakgrunn og UiO matematikk-spesialisering (statistikk + stokastisk analyse) treffer rett inn. Mer akademisk distanse til BANTHE enn strategi 2, men en naturlig nabodisiplin. Stillingsutlysningens «probabilistisk modellering» peker rett hit."
      />

      <Strategy
        number={4}
        title="Fundamental forvaltning"
        subtitle="Stock-picking — men kvantitativ og automatisert"
        te="2–5 pp"
        risikoramme="Høyest av de fem. Selskaps-spesifikke bets, men innenfor mandatets eierskapsgrenser."
        hvaDetEr="Klassisk fundamental analyse — kjøp gode selskaper, salg av dårlige, eieroppfølging, dialog. SPN-mandatet drives slik i dag. Men 344 selskaper er for mange for en klassisk analytiker-modell, så SFT-versjonen må være «mer kvantitativ og datadrevet» (mandatets egne ord). Det er nettopp det generativ AI og agent-baserte systemer kan tilføre."
        krever={[
          "LLM-pipeline for kvartalsrapporter, earnings calls og prospekt på norsk/svensk/dansk/finsk.",
          "Agentbaserte due-diligence-systemer — en agent per selskap som vurderer ledelse, regnskap, ESG.",
          "Sentiment- og narrativ-modeller for nordiske aviser, presseslipp og sosiale medier.",
          "Eieroppfølgings-rammeverk med datadrevet selskapsdialog.",
        ]}
        ftfHar="SPN er FTFs hjertespråk — fundamental analyse i over 50 år. Men automatisert dekning av 344 nordiske small caps er nytt. Stillingen er nesten skreddersydd for å bygge dette."
        phdAngler={[
          "LLM-pipelines for nordiske kvartalsrapporter (norsk/svensk/dansk/finsk + islandsk hvor mulig). Fine-tuning på finansielt korpus, multilingual embedding-strategi.",
          "Agent-baserte due-diligence-systemer: én autonom agent per selskap som leser rapporter, sammenligner med peers, flagger anomalier.",
          "Probabilistiske selskapsmodeller med Bayesiansk skrumpning over små n (mange nordiske small caps har <10 års offentlig regnskap).",
          "Sentiment- og narrativ-detektering — hvor mye av småselskapenes ekspresjons-flyt kan predikere fremtidig kursutvikling?",
          "Causal inference: skille selskaps-spesifikke effekter fra makro-/sektor-effekter i resultater.",
          "Skalerbar AI-arkitektur — direkte i stillingsutlysningens kjerne.",
        ]}
        fit="Delvis"
        fitBegrunnelse="ML-ferdighetene mine er overførbare, men direkte erfaring med generativ AI og agent-rammeverk er begrenset. Min Mandarin og kultur-erfaring fra Kina/Taiwan kan være relevant for global benchmarking av AI-i-finans-litteratur (Kina ligger an på dette området), men ikke i kjernen. Et bevisst vekst-område som PhD-en skal fylle."
      />

      <Strategy
        number={5}
        title="Utvelgelse av eksterne forvaltere"
        subtitle="Allokere til spesialiserte eksterne managere"
        te="Variabel"
        risikoramme="Avhenger av valgt forvaltermiks. Teoretisk hele 5 pp."
        hvaDetEr="Lar eksterne forvaltere stå for det aktive arbeidet, mens SFT velger og kvalitetssikrer dem. NBIM bruker denne modellen i emerging markets. Fordelen er tilgang til spesialiserte strategier og dypere markedsforståelse hos eksterne forvaltere; ulempen er kostnader, kapasitetsrisiko og manglende kontroll."
        krever={[
          "Lite, men erfarent team med dyp kunnskap om nordiske forvaltere.",
          "Robuste rammer for due diligence og operasjonell risikovurdering.",
          "Performance-attribution-systemer (holdings-based og returns-based).",
          "Stryke for å monitorere style drift og avtale-betingelser.",
        ]}
        ftfHar="Begrenset. SPN forvaltes in-house. Manager-utvelgelse vil være et nytt institusjonelt rammeverk for FTF Tromsø."
        phdAngler={[
          "Performance-attribution med ML: kan man skille genuint dyktige forvaltere fra «risk-on»-flaks via ikke-lineære modeller?",
          "Holdings-based vs returns-based-analyse for nordiske small-cap-fond.",
          "Optimization av forvaltermiks under TE- og avgifts-restriksjoner.",
          "Style drift-deteksjon med ML — sammenligning av deklarert vs realisert strategi.",
          "ESG-attribusjon: er fondets ESG-profil drevet av aktive valg eller markedseksponering?",
        ]}
        fit="Svak"
        fitBegrunnelse="Spennende, men ikke der min komparative styrke ligger. Mer portfolio management enn ML-forskning. PhD-vinkelen er smal — interessant som side-prosjekt eller for én senere case-studie, men ikke som ramme for hele avhandlingen."
      />

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Sammenfatning
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Hvis dette skulle vært en ren prediksjon: <strong className="text-ink-900">strategi
          2 (Enhanced Indexing) er sterkest match med min eksisterende bakgrunn</strong>,
          men <strong className="text-ink-900">strategi 4 (datadrevet fundamental)
          er der stillingsutlysningens AI/agent-fokus peker</strong>. En ærlig
          posisjon å bringe inn i intervjuet:
        </p>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>Min komparative fordel ligger i strategi 2 — BANTHE, DNB Enhanced Index, dual-listed monitor er konkrete bevis.</li>
          <li>Strategi 4 er det jeg ville brukt PhD-en til å lære meg. Generativ AI på finansielle dokumenter er en av tidens raskeste forskningsfronter.</li>
          <li>Et godt PhD-prosjekt bygger bro mellom 2 og 4: bruke ML/LLM til å automatisere enhanced-indexing-signaler i et 344-selskapsunivers. Et «agent-per-selskap»-rammeverk for å fange BANTHE-stil-alfa i SFTX.</li>
          <li>Strategi 3 (faktor) er en hyggelig venstresving som jeg ville lest meg opp på.</li>
          <li>Strategi 5 (manager selection) tar jeg som «interessert, ikke kjernekompetanse».</li>
        </ul>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Det viktigste budskapet til intervjupanelet er: jeg har konkrete
          ferdigheter i strategi 2, men jeg er ikke en single-track-kandidat.
          Prosjektet er ment å bygge ut til 3 og 4, og forblir i kontakt med 1
          og 5.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest max-w-prose">
          Sammenligningsmatrise
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-ink-500 border-b hairline">
                <th className="p-4 font-medium">Strategi</th>
                <th className="p-4 font-medium">TE-ramme</th>
                <th className="p-4 font-medium">FTF-styrke</th>
                <th className="p-4 font-medium">PhD-relevans</th>
                <th className="p-4 font-medium">Min fit</th>
              </tr>
            </thead>
            <tbody className="text-ink-700">
              <Row strategi="1. Indeksforvaltning" te="< 0,5 pp" ftf="Middels" phd="Lav–Middels" fit="Delvis" />
              <Row strategi="2. Indeks pluss" te="0,5–2 pp" ftf="Begrenset (kan bygges)" phd="Høy" fit="Toppmatch" />
              <Row strategi="3. Faktorforvaltning" te="1–3 pp" ftf="God (kvalitet)" phd="Høy" fit="Sterk" />
              <Row strategi="4. Fundamental datadrevet" te="2–5 pp" ftf="Sterk fundamental, ny datadrevet vri" phd="Veldig høy (stillingens kjerne)" fit="Delvis" />
              <Row strategi="5. Ekstern forvalter" te="Variabel" ftf="Begrenset" phd="Smal" fit="Svak" />
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Lese videre
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-1.5 list-disc pl-5 leading-relaxed">
          <li><Link href="/bakgrunn" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">Bakgrunn — hvordan CV-en treffer hver strategi</Link></li>
          <li><Link href="/thesis" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">PhD-prosjektutkastet — konkret bro mellom strategi 2 og 4</Link></li>
          <li><Link href="/fund" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">Tromsø-fondets mandat og forvaltningsrammer</Link></li>
        </ul>
      </section>
    </article>
  );
}

function Strategy({
  number,
  title,
  subtitle,
  te,
  risikoramme,
  hvaDetEr,
  krever,
  ftfHar,
  phdAngler,
  fit,
  fitBegrunnelse,
}: {
  number: number;
  title: string;
  subtitle: string;
  te: string;
  risikoramme: string;
  hvaDetEr: string;
  krever: string[];
  ftfHar: string;
  phdAngler: string[];
  fit: Fit;
  fitBegrunnelse: string;
}) {
  return (
    <section className="card p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
            Strategi {number}
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-ink-900 tracking-tightest">
            {title}
          </h2>
          <p className="mt-1 text-[14px] text-ink-600">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 border rounded-md text-[11px] uppercase tracking-[0.15em] font-medium ${fitTone[fit]}`}
          >
            Fit: {fit}
          </span>
          <span className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
            TE-ramme {te}
          </span>
        </div>
      </div>

      <div>
        <p className="text-[14px] text-ink-700 leading-relaxed">{hvaDetEr}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Block label="Risikoramme">{risikoramme}</Block>
        <Block label="Hva FTF har / mangler">{ftfHar}</Block>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <BlockList label="Hva det krever operasjonelt" items={krever} />
        <BlockList label="PhD-vinkler" items={phdAngler} />
      </div>

      <div className="border-t hairline pt-5">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
          Fit med min bakgrunn
        </div>
        <p className="mt-2 text-[14px] text-ink-700 leading-relaxed">
          {fitBegrunnelse}
        </p>
      </div>
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500">{label}</div>
      <p className="mt-2 text-[13px] text-ink-700 leading-relaxed">{children}</p>
    </div>
  );
}

function BlockList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500">{label}</div>
      <ul className="mt-2 text-[13px] text-ink-700 space-y-1.5 list-disc pl-5 leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function Row({
  strategi,
  te,
  ftf,
  phd,
  fit,
}: {
  strategi: string;
  te: string;
  ftf: string;
  phd: string;
  fit: Fit;
}) {
  return (
    <tr className="border-b hairline last:border-0">
      <td className="p-4 text-ink-900">{strategi}</td>
      <td className="p-4 tabular-nums">{te}</td>
      <td className="p-4">{ftf}</td>
      <td className="p-4">{phd}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 border rounded text-[11px] font-medium ${fitTone[fit]}`}
        >
          {fit}
        </span>
      </td>
    </tr>
  );
}
