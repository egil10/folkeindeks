import Link from "next/link";

export const metadata = {
  title: "BANTHE → PhD-prosjekt — Folkeindeks",
  description: "Hvordan BANTHEs indekseffekt-arbeid kan utvides til Tromsø-fondets justerte VINX Small Cap-univers.",
};

export default function ThesisPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-nordic-400">PhD-prosjektutkast</p>
        <h1 className="text-3xl font-semibold text-nordic-50">
          Fra BANTHE til Tromsø
        </h1>
        <p className="text-nordic-200 max-w-3xl">
          Et utkast til 3-årig nærings-ph.d. som bygger på masteroppgavens
          ML-modellering av indekseffekten på OSEBX, og utvider den til
          referanseindeksen for Statens fond i Tromsø.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Hva BANTHE viste</h2>
        <p className="text-sm text-nordic-200">
          Masteroppgaven «BANTHE — Exploiting the Index Effect on OSEBX using
          Machine Learning» predikerer OSEBX-inn-/uttak med GLM + XGBoost og en
          betinget posterior-sannsynlighetsterskel. Hovedfunn:
        </p>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li>Indekseffekt på ~10 % på tillegg og ~60 % på sletting i de 100 handelsdagene før effective date (ED).</li>
          <li>En long-short-strategi gir signifikant alfa innenfor 2 % TE-ramme i utvalget 2002–2024.</li>
          <li>Funksjonsbidragene følger Shleifer (1986) og Chen/Noronha/Singal — likviditets-effekt + investor recognition.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Tre føringer som endrer problemet</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li><strong>Forbud mot shortsalg</strong> i SFT-mandatet — long-short-varianten av BANTHE faller ut. Effekten må fanges via undervekting og pre-trade-tilpasning av rebalanseringer.</li>
          <li><strong>5 pp tracking error</strong> mot ~2 % på SPN — 2,5× mer aktiv plass for å plassere prediksjonene.</li>
          <li><strong>Univers 5×</strong> så stort: ~344 selskaper i fem land og fire valutaer, med en ekstremt illikvid islandsk hale (ISK).</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-nordic-100">Prosjektplan (3 år)</h2>

        <div className="glass rounded-xl p-6 space-y-3">
          <h3 className="text-base font-semibold text-nordic-50">År 1 — Datafundament + replikering</h3>
          <ul className="text-sm text-nordic-200 space-y-1 list-disc pl-5">
            <li>Rekonstruer rebalanseringshistorikken til VINX Small Cap (juni/desember-snapshots) 2002–2026.</li>
            <li>Bygg event-database med <em>inclusion/exclusion</em>, justert for SPN-eksklusjon og SPU-utelukkelser (det er <em>det</em> universet SFT faktisk handler i).</li>
            <li>Land- og valutafikse effekter; Amihud-ill likviditet og Roll-spread som proxy for transaksjonskost.</li>
            <li>Replikér BANTHE per nordisk submarked. Hypotese (Biktimirov & Li): effekten er sterkere og avtar langsommere i nordiske small caps enn på OSEBX.</li>
          </ul>
        </div>

        <div className="glass rounded-xl p-6 space-y-3">
          <h3 className="text-base font-semibold text-nordic-50">År 2 — Generalisering + kostnadsbevissthet</h3>
          <ul className="text-sm text-nordic-200 space-y-1 list-disc pl-5">
            <li>Multinomial classifier (Large↔Mid↔Small transitions) — fanger flere typer indekseffekt.</li>
            <li>Probabilistisk vektingsmodell: erstatt BANTHEs harde terskel med sannsynlighetsvektet sizing (en av oppgavens egne stretch-anbefalinger).</li>
            <li>Bayesian hierarchical model per land + sektor for å håndtere små n.</li>
            <li>Integrer transaksjonskostnadsmodell (Almgren-Chriss) for å unngå at en stor SFT-handel <em>spiser</em> hele effekten.</li>
          </ul>
        </div>

        <div className="glass rounded-xl p-6 space-y-3">
          <h3 className="text-base font-semibold text-nordic-50">År 3 — Produksjon + velferdsspørsmål</h3>
          <ul className="text-sm text-nordic-200 space-y-1 list-disc pl-5">
            <li>Implementer som en <em>long-only enhanced-index sleeve</em> i SFTX-rammen, ≤1 pp av TE-budsjettet.</li>
            <li>Shadow-trading mot SFTs handelsdesk: registrer signal vs faktisk eksekvering, mål realisert alfa.</li>
            <li>Velferdsspørsmål: hvor mye av effekten kan en mandatert investor i SFT-størrelse fange før selve fangsten ødelegger den? (rev. for Game Theory-litteraturen om predatory trading).</li>
            <li>Etisk vurdering: utnyttelse av indekseffekt vs Folketrygdfondets rolle som «long-only, transparent» eier.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Leveranser</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li>3 fagfellevurderte arbeidsdokumenter (et per år).</li>
          <li>Åpen R/Python-kodebase med reproduserbare backtests.</li>
          <li>Internt SFT-eksekveringsoverlay og en metode-rapport til FTFs styre.</li>
          <li>Avhandling: «Index-Effect Capture in Constrained Mandates — Evidence from VINX Small Cap».</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Hvorfor dette passer SFT</h2>
        <p className="text-sm text-nordic-200">
          Mandatet etterspør «aktiv forvaltning innenfor en 5 pp TE-ramme i et univers
          der semi-passive investorer dominerer». BANTHE-rammeverket gir et konkret
          eksempel på at ML kan flytte alpha innenfor en transparent, regelbasert
          ramme — uten å bryte forbudet mot shortsalg eller eieransvar.
        </p>
        <p className="text-sm text-nordic-200">
          Det knytter også Tromsø-miljøet til UiTs eksisterende styrke i
          probabilistisk modellering (Sommerseth-gruppen) og maskinlæring
          for finansielle tidsserier.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Videre lesning</h2>
        <ul className="text-sm text-nordic-200 space-y-1 list-disc pl-5">
          <li><Link href="/research" className="text-nordic-300 hover:text-white">Research-notater</Link> — utvidet BANTHE-utvidelse + kilder.</li>
          <li>Shleifer, A. (1986). Do demand curves for stocks slope down? <em>Journal of Finance</em>.</li>
          <li>Chen, Noronha & Singal (2004). The price response to S&P 500 index additions and deletions.</li>
          <li>Biktimirov & Li (2014). The role of investor attention in the index effect.</li>
        </ul>
      </section>
    </article>
  );
}
