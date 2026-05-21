# folkeindeks

Interview-prep workspace for the Folketrygdfondet PhD position in Tromsø,
focused on **Statens fond i Tromsø** and the **adjusted VINX Small Cap** universe.

## What's in here

| Folder | What |
| --- | --- |
| `web/` | Next.js 15 site (Vercel-ready) that browses all 361 constituents with sector + description, plus pages on the index, the fund, and a 3-year PhD project outline |
| `data/` | `vinxsceurni.txt` (raw Nasdaq snapshot, May 2026) and `stocks.json` (parsed + enriched) |
| `docs/` | Long-form research notes synthesised from the PDFs + web sources |
| `scripts/` | `parse_stocks.mjs` and `enrich_stocks.mjs` — reproducible pipeline |
| `pdfs/` | Source PDFs: mandate, Q1 2026 portfolio update, BANTHE thesis, methodology, etc. |

## Run the site locally

```sh
cd web
npm install
npm run dev
# http://localhost:3000
```

## Deploy to Vercel

The `web/` folder is a standard Next.js 15 app — point Vercel at it and
set the root directory to `web`. No env vars needed.

## Rebuild stock data

If `data/vinxsceurni.txt` is refreshed from Nasdaq:

```sh
node scripts/parse_stocks.mjs
node scripts/enrich_stocks.mjs
```

## Headlines for the interview

- **The reference index is not off-the-shelf VINXSCEURNI.** The Tromsø mandate
  uses VINX Small Cap *dividend-adjusted for FTF's tax position*, with SPN
  constituents and SPU-excluded names stripped out. Folketrygdfondet refers to
  it internally as **SFTX** (~344 names, ~NOK 1,506 bn free-float MV).
- **Norway is absent from the raw VINX list** because Nasdaq Nordic no longer
  includes Oslo Børs (Euronext took it over in 2019). The SPN exclusion bakes
  Norway back in indirectly.
- **Active room is generous** by FTF standards: 5 pp tracking error vs the
  ~2 pp room on SPN. Max 5% per name, no shorting.
- **SFT opened 2 June 2025**, fully invested by year-end. Q1 2026 was −10.4%
  in a volatile Nordic small-cap market.
- **The PhD is a Nærings-ph.d.** in collaboration with UiT, 3 years, focus on
  generative AI, agent-based systems and probabilistic modelling for asset
  management.

See [`docs/`](docs/) for the full notes and [`web/app/thesis/page.tsx`](web/app/thesis/page.tsx)
for a 3-year project outline that extends the BANTHE methodology to SFTX.

## Status

Snapshot generated 21 May 2026. Stock prices in `vinxsceurni.txt` are a single
intraday cut from Nasdaq; treat numerics as illustrative, not tradeable.
