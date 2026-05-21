# Fem forvaltningsstrategier — hvor passer en PhD?

> Notat for andre intervjurunde, mai 2026. Kilder: Finansdepartementets
> utredning om mandatendringer for Statens fond i Tromsø (gjengitt i `pdfs/`),
> samt mandatet selv (FOR-2024-08-12-2096).

## Bakgrunn

Finansdepartementet ba Folketrygdfondet drøfte hva som vil være
hensiktsmessige risikorammer i mandatet for SFT — herunder ramme for
forventet relativ volatilitet. Vurderingen skulle ta hensyn til
**mulighetene for å oppnå fortrinn i lys av Folketrygdfondets
eksisterende kompetanse**. Fem strategier ble skissert, hver med ulike
risikorammer:

1. Indeksforvaltning
2. Indeks pluss («Enhanced Indexing»)
3. Faktorforvaltning
4. Fundamental forvaltning
5. Utvelgelse av eksterne forvaltere

Dette notatet går gjennom hver, hva PhD-prosjektet kan tilføre, og
hvordan min bakgrunn (BANTHE-thesis, DNB Asset Management, Finansdepartementets
aktivforvaltningsavdeling, Norges Bank, UiO matematikk) treffer hver av dem.
Hensikten er å gi intervjupanelet ærlig kartlegging, ikke salgsprat.

---

## 1. Indeksforvaltning

**Hva det er.** Minimer tracking error mot SFTX. Ingen aktive bets, ingen
forsøk på å slå referanseindeksen.

**Risikoramme.** < 0,5 pp TE.

**Hva det krever operasjonelt.**
- Stratified sampling- eller full replication-motor.
- FX-hedging for SEK/DKK/EUR/ISK mot NOK.
- Effektiv rebalansering rundt halvårlig SFTX-rekonstitusjon.
- Lave kostnader; målet er TE og ikke alfa.

**FTFs eksisterende kompetanse.** SPNs indekssegment gir generell
replikeringserfaring. SFTX-universet er nytt; den islandske halen krever
spesialhåndtering.

**PhD-vinkler.**
- Stratified sampling-optimering: hvor mange selskaper kan utelates før TE
  eksploderer? Konveks optimering møter ML når kovariansestimater er ustabile
  i små n.
- Probabilistisk modellering av cash flow inn/ut av fondet.
- ML for likviditetsprognose: predikere når ISK-halen er handlbar.
- Mikrostruktur-analyse av nordiske small caps (Roll-spread, Amihud-illiquidity).

**Fit med min bakgrunn.** *Delvis.* UiO-matematikken og NHH-statistikken er
overførbare, men temaet er fjernere fra BANTHE og DNB Enhanced Index. Et
solid, men ikke åpenbart, PhD-tema.

---

## 2. Indeks pluss (Enhanced Indexing)

**Hva det er.** NBIM kaller dette «enhanced indexing» og bruker det selv.
Forvalter vekter relativ volatilitet, transaksjonskostnader og potensiell
meravkastning mot hverandre. Alfa hentes fra:

- aktiv deltakelse i indeksendringer (BANTHE-territorium),
- selskapshendelser (M&A, spinoffs, kapitalmarkeder, ECM),
- feilprising mellom aksjeklasser (Sverige har mange A/B-strukturer: Investor,
  Industrivärden, Volvo, ABB),
- holdingselskaper som handler med rabatt mot underliggende eierandeler
  (Industrivärden, Investor, Latour, Lundbergs),
- dual-listed equities-arbitrage.

**Risikoramme.** 0,5–2 pp TE. Innenfor SFTs 5 pp er det god plass.

**Hva det krever.**
- Index-event-database og prediksjonsmotorer for inn/uttak av SFTX.
- Corporate actions-pipeline.
- Statistisk arbitrage-modell for dual-class shares.
- Modell for holding-rabatt-konvergens.
- Lav-latens handelsfunksjon for event-dato.

**FTFs eksisterende kompetanse.** SPN-forvaltningen er per i dag mer
fundamental enn enhanced. Tromsø-avdelingen kan bygge dette opp fra start —
som er en del av SFT-mandatets eksplisitte motivasjon.

**PhD-vinkler.**
- Direkte BANTHE-utvidelse: ML-modeller for SFTX inn/ut.
- Hypotese: nordisk small-cap har sterkere og langsommere avtagende effekt enn
  OSEBX (Biktimirov & Li 2014).
- Pre-positioning rundt corporate actions med LLMs på selskapsmeldinger.
- Statistisk arbitrage på dual-listed-rabatter — direkte forlengelse av mitt
  DNB-prosjekt.
- A/B-aksjeklasse-rabatter i nordiske family firms.
- Holding-discount-strategier — probabilistisk regime-modell.
- Kapasitetsanalyse: hvor mye av effekten kan en SFT-størrelse investor fange?

**Fit med min bakgrunn.** *Toppmatch.* DNB Global Enhanced Index var akkurat
denne strategien. Quantitative monitor for dually listed equities er kanonisk
enhanced-indexing-alfa. BANTHEs 11,4 % over OSEBX er direkte demonstrasjon.

---

## 3. Faktorforvaltning

**Hva det er.** Identifisere risikofaktorer (kvalitet, momentum, low vol, verdi,
størrelse) og overvekte dem. Kvalitetsfaktoren brukes allerede i
SPN-forvaltningen; momentum, low vol og verdi er naturlige tillegg.

**Risikoramme.** 1–3 pp TE.

**Hva det krever.**
- Data-pipeline for selskapsspesifikke metrikker.
- Optimeringsverktøy som balanserer faktor-eksponering mot transaksjonskost.
- Mer aktiv handel enn fundamental forvaltning.
- Robust risikomodell og TE-styring.

**FTFs eksisterende kompetanse.** Kvalitetsfaktor allerede operasjonalisert
i SPN. Faktormodell for SFTX vil være utvidelse, ikke nytt grep.

**PhD-vinkler.**
- ML-baserte ikke-lineære faktorinteraksjoner — gradient-boosted modeller for
  quality × momentum × likviditet i nordiske small caps.
- Tidsvarierende faktorpremier — Bayesianske hierarkiske modeller for
  regime-skift på land- og sektor-nivå.
- Faktor-konstruksjon der klassiske Fama-French-definisjoner svikter
  (illikviditet, små n, ISK-hale).
- Adversarial / generative modeller — syntetiske scenarier for stress-test.
- Kausal-inferens på faktor- vs sektor-eksponering: er kvalitetsfaktoren i
  SFTX bare en helse-sektorbet?

**Fit med min bakgrunn.** *Sterk.* UiO matematikk-spesialisering (statistikk +
stokastisk analyse) treffer rett inn. Mer akademisk distanse til BANTHE enn
strategi 2, men en naturlig nabodisiplin. Stillingsutlysningens
«probabilistisk modellering» peker rett hit.

---

## 4. Fundamental forvaltning (datadrevet)

**Hva det er.** Klassisk fundamental analyse — kjøp gode selskaper, salg av
dårlige, eieroppfølging, dialog. SPN-mandatet drives slik i dag. Men 344
selskaper er for mange for klassisk analytiker-modell; SFT-versjonen må
være «mer kvantitativ og datadrevet» (mandatets egne ord).

**Risikoramme.** 2–5 pp TE.

**Hva det krever.**
- LLM-pipeline for kvartalsrapporter, earnings calls og prospekt på
  norsk/svensk/dansk/finsk.
- Agentbaserte due-diligence-systemer.
- Sentiment- og narrativ-modeller for nordiske aviser og presseslipp.
- Eieroppfølgings-rammeverk med datadrevet selskapsdialog.

**FTFs eksisterende kompetanse.** SPN er FTFs hjertespråk — fundamental
analyse i over 50 år. Men automatisert dekning av 344 nordiske small caps
er nytt. Stillingen er nesten skreddersydd for å bygge dette.

**PhD-vinkler.**
- LLM-pipelines for nordiske kvartalsrapporter (norsk/svensk/dansk/finsk +
  islandsk der mulig). Fine-tuning på finansielt korpus, multilingual
  embedding-strategi.
- Agent-baserte due-diligence-systemer: én autonom agent per selskap.
- Probabilistiske selskapsmodeller med Bayesiansk skrumpning over små n.
- Sentiment- og narrativ-detektering.
- Causal inference: skille selskaps-spesifikke fra makro-/sektor-effekter.
- Skalerbar AI-arkitektur — direkte i stillingsutlysningens kjerne.

**Fit med min bakgrunn.** *Delvis.* ML-ferdighetene er overførbare, men
direkte erfaring med generativ AI og agent-rammeverk er begrenset.
Mandarin og Kina-eksponering kan være relevant for global benchmarking av
AI-i-finans-litteratur. Et bevisst vekst-område som PhD-en skal fylle.

---

## 5. Utvelgelse av eksterne forvaltere

**Hva det er.** Lar eksterne forvaltere stå for det aktive arbeidet, mens
SFT velger og kvalitetssikrer dem. NBIM bruker modellen i emerging markets.

**Risikoramme.** Variabel — avhenger av valgt forvaltermiks.

**Hva det krever.**
- Lite, men erfarent team med dyp kunnskap om nordiske forvaltere.
- Robuste rammer for due diligence og operasjonell risikovurdering.
- Performance-attribution-systemer (holdings-based og returns-based).
- Style drift-monitorering.

**FTFs eksisterende kompetanse.** Begrenset. SPN forvaltes in-house.
Manager-utvelgelse vil være nytt institusjonelt rammeverk for FTF Tromsø.

**PhD-vinkler.**
- Performance-attribution med ML — skille genuint dyktige forvaltere fra
  «risk-on»-flaks.
- Holdings-based vs returns-based-analyse for nordiske small-cap-fond.
- Optimization av forvaltermiks under TE- og avgifts-restriksjoner.
- Style drift-deteksjon med ML.

**Fit med min bakgrunn.** *Svak.* Spennende, men ikke der min komparative
styrke ligger. Kukula Capital-engasjementet gir et frontier-PE-perspektiv,
men temaet er smalere for et PhD.

---

## Sammenligning og posisjonering

| Strategi | TE-ramme | FTF-styrke | PhD-relevans | Min fit |
|---|---|---|---|---|
| 1. Indeksforvaltning | < 0,5 pp | Middels | Lav–Middels | Delvis |
| 2. Indeks pluss | 0,5–2 pp | Begrenset (kan bygges) | Høy | **Toppmatch** |
| 3. Faktorforvaltning | 1–3 pp | God (kvalitet) | Høy | Sterk |
| 4. Fundamental datadrevet | 2–5 pp | Sterk fundamental, ny datadrevet vri | Veldig høy (stillingens kjerne) | Delvis |
| 5. Ekstern forvalter | Variabel | Begrenset | Smal | Svak |

**Min posisjonering:** strategi 2 er der min komparative fordel ligger
(BANTHE, DNB Enhanced Index, dual-listed-monitor). Strategi 4 er der
stillingsutlysningens AI/agent-fokus peker. Et godt PhD-prosjekt bygger
bro mellom 2 og 4 — bruker ML/LLM til å automatisere
enhanced-indexing-signaler i et 344-selskapsunivers; et «agent-per-selskap»-
rammeverk for å fange BANTHE-stil-alfa i SFTX. Strategi 3 (faktor) er en
hyggelig venstresving jeg ville lest meg opp på. Strategi 5 er
«interessert, ikke kjernekompetanse».

Det viktigste budskapet til intervjupanelet: jeg har konkrete ferdigheter i
strategi 2, men er ikke en single-track-kandidat. Prosjektet bygger ut til
3 og 4 og holder kontakt med 1 og 5.

## Kilder

- Finansdepartementets utredning, gjengitt i `pdfs/statens-pensjonsfond-norge-oppfolging-av-forslag-om-enkelte-mandatendringer-samt-vurdering-av-egenkap2991106.pdf`
- `pdfs/Mandat for forvaltningen av Statens fond i Tromsø - Lovdata.pdf`
- `pdfs/Etablering av et nytt statlig fond forvaltet fra Tromsø.pdf`
- NBIMs egen omtale av Enhanced Indexing (årsrapport og strategiblogg)
- Biktimirov, E. & Li, B. (2014). *The role of investor attention in the index effect.* Journal of Behavioral Finance.
- Chen, Noronha & Singal (2004). *The price response to S&P 500 index additions and deletions.* Journal of Finance.
