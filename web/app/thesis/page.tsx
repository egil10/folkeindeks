import Link from "next/link";

export const metadata = {
  title: "BANTHE → PhD-prosjekt — Folkeindeks",
  description:
    "Et 3-årig nærings-ph.d.-utkast som forankrer BANTHE-rammeverket i SFTX-universet, åpent for å bygge bro mellom enhanced indexing, faktor og datadrevet fundamental forvaltning.",
};

export default function ThesisPage() {
  return (
    <article className="space-y-14 prose-soft">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          PhD-prosjektutkast
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          Fra BANTHE til Tromsø
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Et 3-årig nærings-ph.d. som bygger på masteroppgavens ML-modellering
          av indekseffekten på OSEBX, og utvider den til SFTX-universet. Prosjektet
          forankres i enhanced indexing — der min komparative fordel ligger — men
          er bevisst åpent for faktor- og datadrevet fundamentalretninger.
        </p>
      </header>

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hvor i strategiuniverset passer prosjektet?
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Finansdepartementet ba FTF drøfte fem mulige forvaltningsstrategier
          for SFT — se{" "}
          <Link href="/strategier" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">
            full gjennomgang
          </Link>
          . PhD-prosjektet sitter naturlig på snittet mellom strategi 2 og 4:
        </p>
        <div className="card p-5">
          <ul className="text-[14px] text-ink-700 space-y-3 leading-relaxed">
            <li>
              <strong className="text-ink-900">Strategi 2 — Indeks pluss (Enhanced Indexing).</strong>{" "}
              BANTHEs index-effect-fangst er per definisjon enhanced indexing.
              Min DNB Asset Management-erfaring fra «DNB Global Enhanced Index»
              og dual-listed-monitoren er kanonisk for denne strategien.
            </li>
            <li>
              <strong className="text-ink-900">Strategi 4 — Fundamental, datadrevet.</strong>{" "}
              Stillingsutlysningen krever generativ AI, agent-baserte systemer
              og probabilistisk modellering. Det peker mot å automatisere
              kvalitativ analyse over 344 selskaper.
            </li>
          </ul>
          <p className="mt-4 text-[13px] text-ink-500 leading-relaxed">
            Strategi 1, 3 og 5 er ikke utelukket — de fungerer som
            kontrollspeil for hvor mye av effekten som er priset inn,
            og som naturlige sidekvest-spørsmål.
          </p>
        </div>
      </section>

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hva BANTHE viste
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Masteroppgaven «BANTHE — Exploiting the Index Effect on OSEBX using
          Machine Learning» predikerer OSEBX-inn-/uttak med GLM + XGBoost og en
          betinget posterior-sannsynlighetsterskel. Hovedfunn:
        </p>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>Indekseffekt på ~10 % på tillegg og ~60 % på sletting i de 100 handelsdagene før ED.</li>
          <li>En long-short-strategi slo benchmarken med 11,4 % årlig innenfor en 2 % TE-ramme i 2002–2024.</li>
          <li>Funksjonsbidragene følger Shleifer (1986) og Chen/Noronha/Singal (2004) — likviditet + investor recognition.</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Tre føringer som endrer problemet for SFT
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong className="text-ink-900">Forbud mot shortsalg.</strong>{" "}
            BANTHEs long-short-variant kollapser. Effekten må fanges via
            undervekting og pre-trade-timing av rebalanseringer.
          </li>
          <li>
            <strong className="text-ink-900">5 pp tracking error</strong> mot
            ~2 % på OSEBX-mandatet — mer enn dobbelt så stor aktiv plass.
          </li>
          <li>
            <strong className="text-ink-900">Univers 5× så stort.</strong> ~344
            selskaper, fem land, fire valutaer, med en ekstremt illikvid
            islandsk hale.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Prosjektplan (3 år)
        </h2>

        <Phase
          year="År 1"
          title="Datafundament + replikering"
          bullets={[
            "Rekonstruer rebalanseringshistorikken til VINX Small Cap (juni/desember-snapshots) 2002–2026.",
            "Bygg event-database med inclusion/exclusion, justert for SPN-eksklusjon og SPU-utelukkelser — det er det universet SFT faktisk handler i.",
            "Land- og valutafikse effekter; Amihud-illikviditet og Roll-spread som proxy for transaksjonskost.",
            "Replikér BANTHE per nordisk submarked. Hypotese (Biktimirov & Li): effekten er sterkere og avtar langsommere i nordiske small caps enn på OSEBX.",
          ]}
        />

        <Phase
          year="År 2"
          title="Generalisering + kostnadsbevissthet"
          bullets={[
            "Multinomial klassifikator (Large↔Mid↔Small transitions) — fanger flere typer indekseffekt.",
            "Probabilistisk vektingsmodell: erstatt harde terskler med sannsynlighetsvektet sizing (BANTHEs egen stretch-anbefaling).",
            "Bayesiansk hierarkisk modell per land + sektor for å håndtere små n.",
            "Integrer transaksjonskostnadsmodell (Almgren-Chriss) for å unngå at en stor SFT-handel spiser hele effekten.",
            "LLM-pipeline for indekschanges-aktige selskapshendelser (M&A, spinoffs, kapitalmarkeder) — strategi-4-bro.",
          ]}
        />

        <Phase
          year="År 3"
          title="Produksjon + velferdsspørsmål"
          bullets={[
            "Implementer som en long-only enhanced-index sleeve i SFTX-rammen, ≤1 pp av TE-budsjettet.",
            "Shadow-trading mot SFTs handelsdesk: registrer signal vs faktisk eksekvering, mål realisert alfa.",
            "Capacity-analyse: hvor mye av effekten kan en mandatert investor i SFT-størrelse fange før selve fangsten ødelegger den?",
            "Etisk vurdering: utnyttelse av indekseffekt vs FTFs rolle som «long-only, transparent» eier.",
          ]}
        />
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Leveranser
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>3 fagfellevurderte arbeidsdokumenter (ett per år).</li>
          <li>Åpen R/Python-kodebase med reproduserbare backtests.</li>
          <li>Internt SFT-eksekveringsoverlay og metode-rapport til FTFs styre.</li>
          <li>Avhandling: «Index-Effect Capture in Constrained Mandates — Evidence from VINX Small Cap».</li>
        </ul>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hvorfor dette passer SFT
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Mandatet etterspør «aktiv forvaltning innenfor en 5 pp TE-ramme i et
          univers der semi-passive investorer dominerer». BANTHE-rammeverket
          gir et konkret eksempel på at ML kan flytte alfa innenfor en
          transparent, regelbasert ramme — uten å bryte forbudet mot shortsalg
          eller eieransvar.
        </p>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Det knytter også Tromsø-miljøet til UiTs eksisterende styrke i
          probabilistisk modellering og maskinlæring for finansielle tidsserier.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Videre lesning
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-1.5 list-disc pl-5 leading-relaxed">
          <li><Link href="/strategier" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">De fem strategiene</Link> — full gjennomgang.</li>
          <li><Link href="/bakgrunn" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">Min bakgrunn</Link> — hvordan CV-en treffer hver strategi.</li>
          <li>Shleifer, A. (1986). Do demand curves for stocks slope down? <em>Journal of Finance</em>.</li>
          <li>Chen, Noronha & Singal (2004). The price response to S&P 500 index additions and deletions.</li>
          <li>Biktimirov & Li (2014). The role of investor attention in the index effect.</li>
        </ul>
      </section>
    </article>
  );
}

function Phase({
  year,
  title,
  bullets,
}: {
  year: string;
  title: string;
  bullets: string[];
}) {
  return (
    <div className="card p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
          {year}
        </span>
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      </div>
      <ul className="mt-4 text-[14px] text-ink-700 space-y-2 list-disc pl-5 leading-relaxed">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
