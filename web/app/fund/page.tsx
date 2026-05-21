import Link from "next/link";

export const metadata = {
  title: "Statens fond i Tromsø — Folkeindeks",
  description:
    "Statens fond i Tromsø — 15 mrd. kr forvaltet av Folketrygdfondet fra Tromsø. Mandat, referanseindeks SFTX, forvaltningsrammer, og status mai 2026.",
};

export default function FundPage() {
  return (
    <article className="space-y-14 prose-soft">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Statens fond
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          Statens fond i Tromsø
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Et nytt statlig kapitalinnskudd forvaltet av Folketrygdfondet,
          plassert i Tromsø som regionalpolitisk grep. Investerer i nordiske
          small-caps med en justert VINX Small Cap som referanse.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Startkapital" value="15 mrd. kr" />
        <Stat label="Opptrapping" value="opp til 30 mrd." />
        <Stat label="Investert YE 2025" value="~NOK 11,3 mrd" />
        <Stat label="NAV Q1 2026" value="~NOK 13,9 mrd" />
        <Stat label="Åpnet" value="2. juni 2025" />
        <Stat label="GIPS-rapporterende" value="9. okt 2025" />
        <Stat label="Q1 2026 avkastning" value="−10,4 %" />
        <Stat label="Q1 2026 alfa" value="+20 bp" />
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Hvorfor Tromsø?
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Stortinget besluttet i 2024 å etablere et nytt statlig fond{" "}
          <strong className="text-ink-900">forvaltet fra Tromsø</strong>.
          Begrunnelsen er regionalpolitisk — å bygge opp et finansielt
          kompetansemiljø i nord, koblet til UiT (Norges arktiske universitet)
          og det voksende AI- og datamiljøet i regionen.
        </p>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Operasjonelt er fondet en egen enhet under Folketrygdfondet, men
          har eget mandat fra Finansdepartementet, eget regnskap, og egen
          referanseindeks (SFTX — se{" "}
          <Link href="/indeks" className="text-accent-700 hover:text-accent-900 underline underline-offset-4">
            indeksdetaljer
          </Link>
          ). Kontoret ligger i Mack-kvartalet; FTF har totalt 63 ansatte ved
          utgangen av 2025, med fortsatt opptrapping på SFT-siden.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Referanseindeks (mandatets ord)
        </h2>
        <blockquote className="text-[14px] text-ink-900 leading-relaxed">
          «VINX Small Cap utbyttejustert for Folketrygdfondets skatteposisjon,
          eksklusive selskaper som inngår i Statens pensjonsfond Norge sin
          referanseindeks, og selskaper utelukket av Statens pensjonsfond utland.»
        </blockquote>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Internt: <strong className="text-ink-900">SFTX</strong>. Ca. 344
          selskaper, ~NOK 1 500 mrd free-float-justert markedsverdi. Geografisk
          fordeling Sverige 50 % · Danmark 22 % · Finland 13 % · Norge 9 % ·
          Island 6 %. Sektor: Industri 28 % · Helse 25 % · Finans 21 %.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Forvaltningsrammer
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li><strong className="text-ink-900">Forventet relativ volatilitet:</strong> inntil 5 pp. Til sammenligning: 3 pp på SPN — 67 % mer aktiv plass.</li>
          <li><strong className="text-ink-900">Maks eierandel per selskap:</strong> 5 % av aksjekapitalen.</li>
          <li><strong className="text-ink-900">Shortsalg:</strong> ikke tillatt. Aksjeutlån tillatt for likviditetsstyring.</li>
          <li><strong className="text-ink-900">Innfasingsregel (§ 7-5):</strong> mens &lt; NOK 5 mrd. er investert, gjelder ikke TE-rammen. Terskelen ble passert 9. oktober 2025.</li>
          <li><strong className="text-ink-900">Ingen SPN-overlapp:</strong> kryss-handler skal skje «armlengdes».</li>
          <li><strong className="text-ink-900">ESG:</strong> NUES, UN Global Compact, OECD, Paris-aligned net-zero, samt SPU-utelukkelser.</li>
        </ul>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Topp posisjoner Q1 2026
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          Jyske Bank · Avanza · Loomis · Sydbank · Mandatum · Huhtamäki ·
          Kalmar · Hiab · Latour · Asker Healthcare. Tydelig nordisk
          finans-vekt, kombinert med industri- og helseselskaper.
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Status mai 2026
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>Investeringsterskelen for full TE-ramme passert i oktober 2025; SFT er nå GIPS-rapporterende composite.</li>
          <li>Q1 2026: −10,4 % i et urolig nordisk small-cap-marked, med +20 bp differensiell avkastning.</li>
          <li>Rekrutteringsløp pågår — særlig kvant, dataanalyse, generativ AI.</li>
          <li>Nærings-ph.d. i samarbeid med UiT (utlyst, søknadsfrist 4. mai 2026 — intervjurunde nå).</li>
        </ul>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Ledelse
        </h2>
        <p className="text-[14px] text-ink-600 leading-relaxed">
          <strong className="text-ink-900">Adm. dir.:</strong> Kjetil Houg (siden 2018).{" "}
          <strong className="text-ink-900">Styreleder:</strong> Siri Birgit Teigum.
          HQ Oslo (Haakon VIIs gate 2), Tromsø-kontor i Mack-kvartalet (Muségata 1).
        </p>
      </section>

      <section className="space-y-3 max-w-prose">
        <h2 className="text-xl font-semibold text-ink-900 tracking-tightest">
          Kilder
        </h2>
        <ul className="text-[14px] text-ink-600 space-y-1.5 list-disc pl-5">
          <li><code className="text-ink-700">pdfs/Mandat for forvaltningen av Statens fond i Tromsø — Lovdata.pdf</code></li>
          <li><code className="text-ink-700">pdfs/Investeringsmandat Statens fond i Tromsø.pdf</code></li>
          <li><code className="text-ink-700">pdfs/Statens fond i Tromsø — Ascender.pdf</code></li>
          <li><code className="text-ink-700">pdfs/Porteføljeutvikling 1. KV 2026.pdf</code></li>
        </ul>
      </section>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500">{label}</div>
      <div className="mt-1.5 text-[15px] text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}
