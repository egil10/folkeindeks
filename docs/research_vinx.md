# VINX Small Cap EUR NI (VINXSCEURNI) - Forberedelsesnotat

*Sammendrag av VINX-indeksfamilien, konstruksjonsmetodikk for VINX Small Cap, og forskjellen mot referanseindeksen for Statens fond i Tromsø (SFT).*

---

## 1. VINX-familien: oversikt

VINX (Värdepapperscentralen Index Nordic) er Nasdaq Nordics felles indeksfamilie for nordiske aksjer, utviklet i samarbeid med Oslo Børs. Den dekker selskaper notert paa Nasdaq Copenhagen, Nasdaq Helsinki, Nasdaq Iceland, Nasdaq Stockholm og Oslo Børs. Hovedfamilien bestaar av flere delindekser med ulike formaal:

| Indeks | Beskrivelse |
|---|---|
| **VINX All-Share** | Hele det noterte nordiske aksjeuniverset. Basisdato 29.12.2000 = 100. |
| **VINX Benchmark (VINXB)** | Utvalg av de største og mest omsatte selskapene, ment som "investerbar" referanse, sektorbalansert. |
| **VINX Benchmark Cap (VINXBCAP)** | Som over, men med vektgrense per utsteder (typisk 10 %) - "capped"-versjon. |
| **VINX 30 (VINX30)** | De 30 største og mest omsatte selskapene; flaggskip-indeks, prisvektet/justert. Rebalanseres halvaarlig. |
| **VINX Tradable** | Optimalisert for replikasjon og derivater. |
| **VINX Large/Mid/Small Cap** | Segmenterte delindekser etter markedskapitalisering. Small Cap bestaar av de minste selskapene som passerer omsetnings- og kapitalkriteriene. |

Alle versjonene publiseres i fem valutaer (**DKK, EUR, ISK, NOK, SEK**) og tre avkastningstyper:
- **PI** – Price Index (kun kursavkastning, ingen utbytter)
- **GI** – Gross Total Return (utbytter reinvestert brutto)
- **NI** – Net Total Return (utbytter reinvestert *etter* kildeskatt for ikke-hjemmehørende investorer uten skatteavtalefordeler)

**VINXSCEURNI** = VINX Small Cap, denominert i EUR, net total return.

---

## 2. Konstruksjonsmetodikk for VINX Small Cap (VINXSC-)

Kilde: Nasdaq Index Methodology *VINX Small Cap Index* (2021).

### Landdekning og børser
Verdipapirer notert paa **Nasdaq Copenhagen, Nasdaq Helsinki, Nasdaq Iceland, Nasdaq Stockholm og Oslo Børs** er kvalifiserte. Selskapenes nasjonalitet bestemmes via FTSE-klassifisering (Norge, Sverige, Danmark, Finland, Island).

### Tillatte verdipapirer
- Ordinære aksjer og depotbevis.
- Ved dobbeltnotering velges noteringen med høyest EUR-omsetning.
- Ved flere aksjeklasser per utsteder velges klassen med høyest omsetning.

### Eksklusjoner
- ICB-undersektorene "Closed End Investments" og "Open End and Miscellaneous Investment Vehicles" er ekskludert.
- Verdipapirer der én eier kontrollerer ≥ 90 % av aksjekapitalen er ikke kvalifisert (lav free float).
- Verdipapirer med null omsetning ekskluderes.
- Selskaper med kjent forestaaende konkurs, avnotering eller M&A kan fjernes diskresjonært ved rekonstitusjon.

### Utvelgelsesregler (Small Cap-screen)
Tre dimensjoner brukes: indeksinklusjon paa referansedato, fri flyt-justert markedsverdi (issuer free float market cap) og 12 maaneders aggregert omsetning i EUR.

- Eksisterende indeksverdipapirer som ligger lavere enn **bunn 22,5 %** av markedsverdi-rankingen er kvalifisert.
- Nye verdipapirer maa ligge under **bunn 17,5 %** (strengere - "buffer" for aa redusere turnover).
- Eksisterende verdipapirer i nedre **25 %** av omsetningsrankingen er ikke kvalifisert.
- Nye verdipapirer i nedre **35 %** av omsetningsrankingen er ikke kvalifisert.

Filteret skaper en likviditetsbuffer som unngaar mikro-cap-selskaper uten reell omsetning.

### Vekting
Indeksen er **free float-markedsverdivektet**: vekt = (TSI × free float-faktor × kurs) / sum av samme for alle indeksverdipapirer. Det er **ingen capping** paa enkeltselskap i Small Cap-metodikken (i motsetning til Benchmark Cap).

### Kalender / rebalansering
- **Rekonstitusjon** (utvalg av medlemmer): halvaarlig, effektiv første handelsdag i **juni og desember**. Referansedatoer: 30. april og 31. oktober.
- **Rebalansering** (vekter): samtidig med rekonstitusjonen. Endringer annonseres ≥ 5 handelsdager før effektiv dato.
- Selskaper legges normalt **ikke** til mellom rebalanseringene (unntak ved fusjoner).

### "EUR NI"-suffikset
- **EUR**: indeksverdier konverteres til euro fra opprinnelig handelsvaluta (SEK, DKK, NOK, ISK).
- **NI** (Net Total Return): kontantutbytter reinvesteres i indeksen *etter* fradrag for kildeskatt for utenlandske investorer uten skatteavtalefordeler. Skattesatsen er basert paa utstederens hjemland (typisk 27 % DK, 30 % SE, 25 % NO, 20 % FI, 22 % IS). Dette gir et konservativt anslag for en utenlandsk passiv investor.

---

## 3. VINXSCEURNI - snapshot (per 20.05.2026, Nasdaq.com)

| Maaling | Verdi |
|---|---|
| Indeksverdi | 2 499,91 EUR |
| Valuta | EUR |
| Antall instrumenter | **361** (basert paa konstituentliste) |
| Daglig endring | +1,65 % (+40,60) |
| 1 maaned | +0,23 % |
| 3 maaneder | +5,03 % |
| 6 maaneder | +11,92 % |
| YTD | +5,73 % |
| 1 aar | +12,22 % |
| 52-ukers laav/høy | 2 156,93 / 2 509,56 |
| Indeks-termometer | 241 risers / 67 nøytrale / 53 decliners |

### Landfordeling (estimat fra noteringsvaluta i instrumentlisten)

| Marked | Antall | Andel |
|---|---|---|
| Sverige (SEK) | 236 | 65 % |
| Finland (EUR) | 58 | 16 % |
| Danmark (DKK) | 41 | 11 % |
| Island (ISK) | 26 | 7 % |
| Norge (NOK) | 0* | 0 % |

\* Den lastede listen viser ingen NOK-noterte selskaper - paafallende, siden metodikken nevner Oslo Børs eksplisitt. Mulige forklaringer: (i) konstituentlisten paa Nasdaq.com viser bare instrumenter notert paa Nasdaq Nordic-børsene; (ii) Oslo Børs-noterte selskaper kan vises i SEK (dual-listing-regelen velger børsen med høyest omsetning) - flere "Lundin"-selskaper er SEK-notert. **Dette bør verifiseres i intervjuet/forberedelsene.**

Sektormessig domineres listen av industri, eiendom, finans, helse/biotek og forbruksvarer - typisk for nordiske small cap-univers. (Eksakt sektorbrekk var ikke tilgjengelig paa Nasdaq-siden ved datauthenting.)

---

## 4. Forskjell mellom VINXSCEURNI og SFTs referanseindeks

SFT er gitt mandat av Finansdepartementet (FOR-2024-08-12-2096) og forvaltes av Folketrygdfondet. **§ 2-1** definerer referanseindeksen som **"VINX Small Cap utbyttejustert for Folketrygdfondets skatteposisjon"**. Det er altsaa en *skreddersydd* variant av VINXSC, ikke VINXSCEURNI rett av hyllen. Viktige forskjeller:

| Aspekt | VINXSCEURNI | SFTs referanseindeks |
|---|---|---|
| Valuta | EUR | NOK (avkastning maales i kroner, jf. mandatets § 1-3) |
| Utbytte | Net of withholding tax for utenlandsk investor | **Justert for Folketrygdfondets skatteposisjon** (norsk statlig enhet - i praksis brutto / gunstig sats) |
| Univers | Hele VINX Small Cap | **Eksklusjon av selskaper som inngaar i SPN-indeksen** (= OSEBX-hovedselskaper). Alle aksjeklasser av samme utsteder ekskluderes. |
| Etiske eksklusjoner | Ingen | **Selskaper som er utelukket av SPU/NBIM-retningslinjene** tas ut (kullkriteriet, vaapen, tobakk, etc.) |
| Land | Sverige, Danmark, Finland, Island, Norge | Samme - **men SPN-selskaper ekskluderes**, slik at Norge i praksis blir tynt representert (kun small cap som ikke ligger i SPN) |
| Capping / vekter | Free float-mcap, ingen cap | Arves fra VINX Small Cap, justert for eksklusjoner |
| Eierandelsbegrensning | n/a | SFT maa ikke eie > 5 % av aksjekapital i ett enkeltselskap (mandat § 2-3 (4)) |

**Hva ville maatte justeres for en "ren" SFT-indeks?**
1. **Valutakonvertering** til NOK.
2. **Utbyttebehandling**: bruke effektiv norsk skattesats / Folketrygdfondets skatteposisjon i stedet for NI-satsen.
3. **SPN-overlapp fjernes** for aa unngaa dobbeltforvaltning mot Statens pensjonsfond Norge.
4. **SPU-eksklusjonslisten paalegges** (etisk konsistens med NBIM).
5. **Free float-faktor** kan eventuelt re-vektes etter eksklusjoner.

Iceland er *ikke* eksplisitt ekskludert fra mandatet - § 2-2 lister Norge, Danmark, Finland, Island og Sverige som tillatte markedsplasser. Saa landdekningen er identisk med VINX Small Cap.

---

## 5. Risiko- og forvaltningsrammer (mandatets § 2-3)

- **Forventet relativ volatilitet (ex ante tracking error)**: ≤ **5 prosentenheter** annualisert.
- Minimum sammenfall mellom portefølje og referanseindeks: **50 %** (styrets internramme).
- Maks kontantbeholdning: **10 %**.
- Maks belaaning: **5 %** av investeringsporteføljen; brutto belaaning ≤ 30 %.
- Verdipapirutlaan tillatt, ≤ 30 % av porteføljen.
- Shortsalg **ikke tillatt**.
- Innfasing: § 2-3 (1) gjelder først naar > 5 mrd kr er investert.

Disse rammene gjør at SFT ikke kan replikere indeksen passivt 1:1 - det er forutsatt **aktiv** forvaltning med betydelig fleksibilitet. Tracking error paa 5 pp er romslig (sammenlign SPN: 3 pp), noe som reflekterer small cap-segmentets lavere likviditet.

---

## 6. Implikasjoner for PhD-prosjektet

- **VINX Small Cap er en relativt likvid, men konsentrert universe** - 361 papirer, men sterk svensk skjevhet (≈ 65 %). Faktormodeller bør kontrollere for landeffekt og SEK-eksponering.
- **NI-vs-GI-vs-PI** er en ren utbytte/skattejustering; for forskning paa norsk forvalters totalavkastning er en *bruttojustering tilpasset Folketrygdfondets skatteposisjon* riktig referansenivaa.
- **Halvaarlig rekonstitusjon** skaper et kjent "index effect" / "small cap reconstitution premium" - kan utnyttes med ML (jf. BANTHE-paperet om OSEBX).
- **Eksklusjon av SPN-selskaper** betyr at SFT i praksis er en *small cap-only* nordisk portefølje uten Equinor/DNB/Telenor-eksponering - svært relevant for AI/dataanalyse-PhDen siden universet er rikt paa volatile, lite-dekkede selskaper der prediktive modeller kan ha størst marginal verdi.

---

## Kilder

- Nasdaq Inc. (2021). *VINX Small Cap Index Methodology*. PDF (lokal kopi: `Methodology_VINX.pdf`). Tilsvarer https://indexes.nasdaqomx.com/docs/Methodology_VINX.pdf
- Nasdaq Inc. (2026). *VINX Small Cap EUR NI (VINXSCEURNI) Summary*. https://www.nasdaq.com/european-market-activity/indexes/vinxsceurni?id=IX9168 (lokal PDF: `VINX Small Cap EUR NI (VINXSCEURNI) Summary _ Nasdaq.pdf`).
- Nasdaq Inc. *VINX Equity Indexes Solutions*. https://www.nasdaq.com/solutions/global-indexes/beta/vinx-equity-indexes
- Nasdaq Inc. *Calculation Manual – Equities & Commodities* (NI/GI/PI-definisjoner). https://indexes.nasdaqomx.com/docs/Calculation_Manual_Equities_and_Commodities.pdf
- Nasdaq Inc. *VINX30 Overview*. https://indexes.nasdaqomx.com/Index/Overview/VINX30
- Finansdepartementet (2024). *Mandat for forvaltningen av Statens fond i Tromsø*, FOR-2024-08-12-2096. https://lovdata.no/dokument/INS/forskrift/2024-08-12-2096
- Folketrygdfondet (12.12.2024). *Investeringsmandat Statens fond i Tromsø (SFT)*. Lokal kopi.
- Konstituentliste: `vinxsceurni.txt` (n = 361 instrumenter, snapshot mai 2026).
