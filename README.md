# folkeindeks

Interview-prep workspace for the Folketrygdfondet PhD position in Tromsø,
built around **Statens fond i Tromsø (SFT)** and the **adjusted VINX Small
Cap** universe (SFTX).

## What's in here

| Folder | What |
| --- | --- |
| `web/` | Next.js 15 site (Vercel-ready) — clean light theme, eight pages from the 361 stocks to the five management strategies |
| `data/` | `vinxsceurni.txt` (raw Nasdaq snapshot, May 2026) and `stocks.json` (361 parsed + curated) |
| `docs/` | Five long-form research notes synthesised from the PDFs + web sources |
| `scripts/` | `parse_stocks.mjs` and `enrich_stocks.mjs` — reproducible pipeline |
| `pdfs/` | 21 source PDFs: mandates, Q1 2026 portfolio, BANTHE thesis, VINX methodology |
| `cv.txt` | Egil's CV (LaTeX source) |

## Site map (`web/app/`)

- `/` — overview, country/sector charts, call-outs to the new pages
- `/strategier` — **the five forvaltningsstrategier** (indeks, indeks pluss, faktor, fundamental, ekstern), each with operational requirements, PhD angles and CV fit
- `/bakgrunn` — every CV experience (DNB Enhanced Index, BANTHE, Finansdepartementet, Norges Bank, UiO, NHH) mapped to the five strategies
- `/thesis` — 3-year PhD project outline bridging strategies 2 and 4
- `/fund` — Statens fond i Tromsø: mandate, governance, current status
- `/indeks` — VINX Small Cap EUR NI methodology and the SFTX adjustment
- `/stocks` — searchable browser of all 361 constituents
- `/research` — index of the five research notes

## Run the site locally

```sh
cd web
npm install
npm run dev
# http://localhost:3000
```

## Deploy to Vercel

The `web/` folder is a standard Next.js 15 app. Point Vercel at the repo and
set the root directory to `web`. No env vars needed.

## Rebuild stock data

If `data/vinxsceurni.txt` is refreshed from Nasdaq:

```sh
node scripts/parse_stocks.mjs
node scripts/enrich_stocks.mjs
```

## Headlines for the interview

- **The reference index is not off-the-shelf VINXSCEURNI.** SFT's mandate uses
  VINX Small Cap *dividend-adjusted for FTF's tax position*, with SPN
  constituents and SPU-excluded names stripped out. Folketrygdfondet refers
  to it internally as **SFTX** (~344 names, ~NOK 1 500 bn free-float MV).
- **Raw VINX has zero NOK constituents** because Nasdaq Nordic no longer
  includes Oslo Børs (Euronext took it over in 2019). The SPN exclusion
  folds Norway back in indirectly.
- **Active room is generous.** 5 pp tracking error vs the 3 pp room on SPN —
  67 % more active space. Max 5 % per name, no shorting.
- **SPN is 60 / 40 equity / bonds**, with 85 % Norway / 15 % Nordics inside
  each asset class. *Not* the same as the oil fund.
- **SFT opened 2 June 2025**, crossed the GIPS-reporting threshold (NOK 5 bn
  invested) on 9 October 2025, NAV ~NOK 13.9 bn at Q1 2026 with −10.4 %
  return and **+20 bp alpha**.
- **Five strategies are on the table** for SFT (see `/strategier`):
  indeks · indeks pluss · faktor · fundamental · ekstern.
- **The PhD is a Nærings-ph.d.** 3 years, conditional on NFR funding and UiT
  admission. Min 1 year on-site in Tromsø, working language Norwegian.
- **The candidate's natural fit is strategy 2 (Enhanced Indexing)** — DNB
  Global Enhanced Index, dual-listed-monitor, BANTHE thesis. The project
  bridges into strategy 4 (data-driven fundamental) via generative AI.

## Status

Snapshot generated 21 May 2026. Stock prices in `vinxsceurni.txt` are a
single intraday cut from Nasdaq; treat numerics as illustrative.
