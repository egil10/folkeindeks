import Link from "next/link";

export const metadata = {
  title: "Statens fond i Tromsø — Folkeindeks",
  description: "Et nytt statlig fond på 15 mrd. kr forvaltet av Folketrygdfondet fra Tromsø. Mandat, referanseindeks, forvaltningsrammer.",
};

export default function FundPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-nordic-400">Statens fond</p>
        <h1 className="text-3xl font-semibold text-nordic-50">Statens fond i Tromsø</h1>
        <p className="text-nordic-200 max-w-3xl">
          Et nytt statlig kapitalinnskudd forvaltet av en avdeling av
          Folketrygdfondet, etablert i Tromsø som regionalpolitisk grep.
          Investerer i nordiske small caps med justert VINX Small Cap som referanse.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Startkapital" value="15 mrd. kr" />
        <Stat label="Opptrapping" value="opp til 30 mrd." />
        <Stat label="Åpnet" value="2. juni 2025" />
        <Stat label="Forvalter" value="Folketrygdfondet" />
        <Stat label="Lokasjon" value="Mack-kvartalet, Tromsø" />
        <Stat label="Mandat fastsatt" value="12.08.2024" />
        <Stat label="Ikrafttredelse" value="20.12.2024" />
        <Stat label="Q1 2026 avkastning" value="–10,4 %" />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Hvorfor Tromsø?</h2>
        <p className="text-sm text-nordic-200">
          Stortinget besluttet i 2024 å etablere et nytt statlig fond
          <strong> forvaltet fra Tromsø</strong>. Begrunnelsen er regionalpolitisk —
          å bygge opp et finansielt kompetansemiljø i nord, koblet til
          UiT — Norges arktiske universitet og det voksende AI-/datamiljøet
          rundt UiT og lokal næringsliv.
        </p>
        <p className="text-sm text-nordic-200">
          Fondet er organisert som en egen enhet under Folketrygdfondet,
          men har eget mandat fra Finansdepartementet og egen referanseindeks
          (se <Link href="/indeks" className="text-nordic-300 hover:text-white">/index</Link>).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Referanseindeks (mandatets ord)</h2>
        <blockquote className="border-l-2 border-nordic-500 pl-4 italic text-nordic-100">
          «VINX Small Cap utbyttejustert for Folketrygdfondets skatteposisjon,
          eksklusive selskaper som inngår i Statens pensjonsfond Norge sin
          referanseindeks, og selskaper utelukket av Statens pensjonsfond utland.»
        </blockquote>
        <p className="text-sm text-nordic-200">
          Folketrygdfondet bruker det interne kortnavnet <strong>SFTX</strong>.
          Universet er ~344 selskaper, ca. 1 506 mrd. kr i free-float-justert
          markedsverdi, fordelt på rundt 50 % Sverige / 22 % Danmark / 13 %
          Finland / 9 % Norge / 6 % Island.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Forvaltningsrammer</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li><strong>Forventet relativ volatilitet:</strong> inntil 5 pp (tracking error). Ca. 2,5× rammen SPN har — gir aktiv plass.</li>
          <li><strong>Maks eierandel per selskap:</strong> 5 %.</li>
          <li><strong>Shortsalg:</strong> ikke tillatt. Aksjeutlån tillatt for likviditetsstyring.</li>
          <li><strong>Aktivaklasser:</strong> aksjer (renter senere mulig — sjekk siste mandatversjon).</li>
          <li><strong>ESG:</strong> følger NUES, UN Global Compact, OECD og SPUs utelukkelser.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Status mai 2026</h2>
        <ul className="text-sm text-nordic-200 space-y-2 list-disc pl-5">
          <li>Fullt investert ved utgangen av 2025.</li>
          <li>Q1 2026: –10,4 % i et urolig nordisk small-cap-marked.</li>
          <li>Aktivt rekrutteringsløp — særlig kvant, dataanalyse og porteføljeforvaltning.</li>
          <li>Nærings-ph.d. utlyst i samarbeid med UiT (frist 4. mai 2026).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Ledelse og kontakt</h2>
        <p className="text-sm text-nordic-200">
          <strong>Adm. dir. Folketrygdfondet:</strong> Kjetil Houg.<br/>
          Folketrygdfondet rapporterer til Finansdepartementet og forvalter også
          Statens pensjonsfond Norge (SPN).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-nordic-100">Kilder</h2>
        <ul className="text-sm text-nordic-200 space-y-1 list-disc pl-5">
          <li>Mandat for forvaltningen av Statens fond i Tromsø — Lovdata</li>
          <li>Investeringsmandat Statens fond i Tromsø.pdf</li>
          <li>Statens fond i Tromsø — Ascender.pdf</li>
          <li>Folketrygdfondet — Porteføljeutvikling 1. KV 2026.pdf</li>
        </ul>
      </section>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-nordic-400">{label}</div>
      <div className="mt-1 text-base text-nordic-50">{value}</div>
    </div>
  );
}
