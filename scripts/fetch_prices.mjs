// scripts/fetch_prices.mjs
// Resolve a Yahoo Finance ticker for each stock in data/stocks.json,
// fetch ~5y of daily history, convert closing prices to NOK using
// SEK/DKK/EUR/ISK -> NOK FX series, and emit one JSON per stock to
// web/public/prices/{slug}.json plus a ticker map at data/tickers.json.
//
// Usage:
//   node scripts/fetch_prices.mjs            (full run)
//   node scripts/fetch_prices.mjs --limit 5  (test first N stocks)
//   node scripts/fetch_prices.mjs --skip     (skip slugs that already have a file)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith("--limit"));
const limit = limitArg ? parseInt(limitArg.split("=")[1] || args[args.indexOf(limitArg) + 1], 10) : Infinity;
const skipExisting = args.includes("--skip");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
};

const exchangeSuffix = {
  Sweden: ".ST",
  Denmark: ".CO",
  Finland: ".HE",
  Iceland: ".IC",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers });
      if (res.ok) return await res.json();
      if (res.status === 404) return null;
      // 429 or 500: back off and retry
      await sleep(800 * (i + 1));
    } catch (e) {
      if (i === attempts - 1) throw e;
      await sleep(400 * (i + 1));
    }
  }
  return null;
}

function deAccent(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function nameVariants(name) {
  const variants = new Set();
  const asciiName = deAccent(name);
  variants.add(name);
  if (asciiName !== name) variants.add(asciiName);
  // Strip trailing share-class / vehicle-type tokens that confuse Yahoo search.
  const strip = (s) =>
    s
      .replace(/\b(SDB|SDR|ADR)\b\s*$/i, "")
      .replace(/\s+(A|B|C)\b\s*$/i, "")
      .replace(/\s+(Oyj|Oy|Abp|Holding|Group|Plc|AB|A\/S|ASA)\s*$/i, "")
      .replace(/\s+\d+$/i, "")
      .trim();
  const cleaned = strip(name);
  if (cleaned && cleaned !== name) variants.add(cleaned);
  const asciiCleaned = strip(asciiName);
  if (asciiCleaned && asciiCleaned !== asciiName) variants.add(asciiCleaned);
  // Strip parentheses
  const noParens = name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  if (noParens && noParens !== name) variants.add(noParens);
  // First two words only (catches "BTS Group B" → "BTS Group")
  const firstTwo = asciiName.split(/\s+/).slice(0, 2).join(" ");
  if (firstTwo && firstTwo !== name) variants.add(firstTwo);
  return [...variants];
}

const manualTickers = {
  // --- Mismatched-exchange overrides (Yahoo's auto-search returned wrong listings) ---
  "AFRY": "AFRY.ST",
  "Axfood": "AXFO.ST",
  "Billerud": "BILL.ST",
  "BioArctic B": "BIOA-B.ST",
  "Boozt": "BOOZT.ST",
  "Bravida Holding": "BRAV.ST",
  "BTS Group B": "BTS-B.ST",
  "Catella B": "CAT-B.ST",
  "Elanders B": "ELAN-B.ST",
  "Electrolux B": "ELUX-B.ST",
  "Elekta B": "EKTA-B.ST",
  "HEBA B": "HEBA-B.ST",
  "HEXPOL B": "HPOL-B.ST",
  "Humana": "HUM.ST",
  "JM": "JM.ST",
  "Latour B": "LATO-B.ST",
  "Loomis": "LOOMIS.ST",
  "Medicover B": "MCOV-B.ST",
  "Momentum Group B": "MMGR-B.ST",
  "NCC B": "NCC-B.ST",
  "Net Insight B": "NETI-B.ST",
  "Nolato B": "NOLA-B.ST",
  "NOTE": "NOTE.ST",
  "Peab B": "PEAB-B.ST",
  "Prevas B": "PREV-B.ST",
  "Pricer B": "PRIC-B.ST",
  "Ratos B": "RATO-B.ST",
  "Rejlers B": "REJL-B.ST",
  "Röko B": "ROKO-B.ST",
  "SWECO B": "SWEC-B.ST",
  "VBG GROUP B": "VBG-B.ST",
  "Vitrolife": "VITR.ST",
  "Volati": "VOLO.ST",
  "Wallenstam B": "WALL-B.ST",
  "Xvivo Perfusion": "XVIVO.ST",
  "FLSmidth & Co.": "FLS.CO",
  "ISS": "ISS.CO",
  "Jyske Bank": "JYSK.CO",
  "Matas": "MATAS.CO",
  "Royal UNIBREW": "RBREW.CO",
  "SP Group": "SPG.CO",
  "Raisio Oyj Vaihto-osake": "RAIVV.HE",
  "Alvotech": "ALVO.IC",
  "Sýn": "SYN.IC",
  // --- Diacritic / non-ASCII names ---
  "Diös Fastigheter": "DIOS.ST",
  "Gränges": "GRNG.ST",
  "Lundbergföretagen B": "LUND-B.ST",
  "Nilörngruppen B": "NIL-B.ST",
  "Orrön Energy": "ORRON.ST",
  "Samhällsbyggnadsbo. i Norden B": "SBB-B.ST",
  "Solid Försäkringsaktiebolag": "SFAB.ST",
  "Stendörren Fastigheter B": "STEF-B.ST",
  "Öresund": "ORES.ST",
  "Føroya Banki": "FOROYA.CO",
  "MT Højgaard Holding": "MTHH.CO",
  "Huhtamäki Oyj": "HUH1V.HE",
  "Oma Säästöpankki Oyj": "OMASP.HE",
  "Eik fasteignafélag": "EIK.IC",
  "Eimskipafélag Íslands": "EIM.IC",
  "Hampiðjan": "HAMP.IC",
  "Kaldalón": "KALD.IC",
  "Nova Klúbburinn": "NOVA.IC",
  "Reitir fasteignafélag": "REITIR.IC",
  "Sjóvá-Almennar tryggingar": "SJOVA.IC",
  "Skel fjárfestingafélag": "SKEL.IC",
  "Síldarvinnslan": "SVN.IC",
  "Síminn": "SIMINN.IC",
  "Ísfélag": "ISFI.IC",
  "Íslandsbanki": "ISB.IC",
};

function pickBestQuote(quotes, country, originalName) {
  if (!quotes || quotes.length === 0) return null;
  const suffix = exchangeSuffix[country];
  const wantClass = (originalName.match(/\s+(A|B|C)\s*$/i) || [, null])[1]?.toUpperCase();
  // 1. Same-country equity, share class hinted in symbol matches
  for (const q of quotes) {
    if (q.quoteType !== "EQUITY" || !q.symbol?.endsWith(suffix)) continue;
    if (wantClass && new RegExp(`-${wantClass}\\.`, "i").test(q.symbol)) return q.symbol;
  }
  // 2. Same-country equity, any class
  for (const q of quotes) {
    if (q.quoteType === "EQUITY" && q.symbol?.endsWith(suffix)) return q.symbol;
  }
  // 3. Any Nordic equity
  for (const q of quotes) {
    if (q.quoteType === "EQUITY" && /\.(ST|CO|HE|IC|OL)$/i.test(q.symbol || "")) return q.symbol;
  }
  // 4. Any equity
  for (const q of quotes) {
    if (q.quoteType === "EQUITY") return q.symbol;
  }
  return quotes[0]?.symbol || null;
}

async function searchTicker(name, country) {
  for (const variant of nameVariants(name)) {
    const data = await fetchWithRetry(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
        variant
      )}&quotesCount=10&newsCount=0`
    );
    if (!data || !data.quotes || data.quotes.length === 0) continue;
    const symbol = pickBestQuote(data.quotes, country, name);
    if (symbol) return symbol;
    await sleep(80);
  }
  return null;
}

async function fetchHistory(ticker) {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 5 * 365 * 24 * 3600 - 14 * 24 * 3600; // ~5y + small buffer
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    ticker
  )}?period1=${start}&period2=${now}&interval=1d`;
  const data = await fetchWithRetry(url);
  if (!data || !data.chart?.result?.[0]) return null;
  const r = data.chart.result[0];
  const timestamps = r.timestamp || [];
  const q = r.indicators?.quote?.[0] || {};
  const adj = r.indicators?.adjclose?.[0]?.adjclose || q.close || [];
  return timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      close: q.close?.[i] ?? null,
      adjClose: adj[i] ?? null,
      volume: q.volume?.[i] ?? null,
    }))
    .filter((p) => p.close !== null);
}

function toNok(fx, ccy, date, value) {
  if (value == null) return null;
  if (ccy === "NOK") return value;
  const rates = fx[ccy];
  if (!rates) return null;
  // Try this date, then walk back up to 7 days to find a valid rate.
  let d = date;
  for (let i = 0; i < 7; i++) {
    if (rates.has(d)) return value * rates.get(d);
    const dt = new Date(d);
    dt.setUTCDate(dt.getUTCDate() - 1);
    d = dt.toISOString().slice(0, 10);
  }
  return null;
}

// ---------- Main ----------

const stocks = JSON.parse(
  fs.readFileSync(path.join(root, "data/stocks.json"), "utf8")
);

const outDir = path.join(root, "web/public/prices");
fs.mkdirSync(outDir, { recursive: true });

console.log("Fetching FX series…");
const fx = {};
const fxPairs = [
  ["SEK", "SEKNOK=X"],
  ["DKK", "DKKNOK=X"],
  ["EUR", "EURNOK=X"],
  ["ISK", "ISKNOK=X"],
];
for (const [code, ticker] of fxPairs) {
  try {
    const h = await fetchHistory(ticker);
    if (h) {
      fx[code] = new Map(h.map((b) => [b.date, b.close]));
      // also persist
      fs.writeFileSync(
        path.join(outDir, `_fx_${code}.json`),
        JSON.stringify(
          {
            code,
            ticker,
            history: h.map((b) => ({ date: b.date, close: b.close })),
          },
          null,
          0
        )
      );
      console.log(`  ${code}: ${h.length} bars`);
    } else {
      console.log(`  ${code}: no history`);
    }
  } catch (e) {
    console.log(`  ${code}: failed - ${e.message}`);
  }
  await sleep(200);
}

const tickerMap = {};
const manifest = [];

async function processStock(stock, i) {
  const outPath = path.join(outDir, `${stock.slug}.json`);
  if (skipExisting && fs.existsSync(outPath)) {
    return { slug: stock.slug, status: "cached" };
  }
  try {
    const ticker =
      manualTickers[stock.name] ?? (await searchTicker(stock.name, stock.country));
    if (!ticker) return { slug: stock.slug, status: "no_ticker" };
    await sleep(120);
    const history = await fetchHistory(ticker);
    if (!history || history.length === 0)
      return { slug: stock.slug, ticker, status: "no_history" };

    const enriched = history.map((b) => ({
      date: b.date,
      close: b.close,
      adjClose: b.adjClose,
      volume: b.volume,
      closeNOK: toNok(fx, stock.ccy, b.date, b.close),
      adjCloseNOK: toNok(fx, stock.ccy, b.date, b.adjClose),
    }));

    fs.writeFileSync(
      outPath,
      JSON.stringify({
        slug: stock.slug,
        name: stock.name,
        ticker,
        ccy: stock.ccy,
        country: stock.country,
        sector: stock.sector,
        history: enriched,
      })
    );
    return { slug: stock.slug, ticker, status: "ok", bars: enriched.length };
  } catch (e) {
    return { slug: stock.slug, status: "error", error: e.message };
  }
}

const subset = stocks.slice(0, Math.min(limit, stocks.length));
console.log(`Processing ${subset.length}/${stocks.length} stocks…`);

const LIMIT = 4;
let idx = 0;
let okCount = 0;
let failCount = 0;
const t0 = Date.now();
const workers = Array.from({ length: LIMIT }, async () => {
  while (idx < subset.length) {
    const i = idx++;
    const stock = subset[i];
    const r = await processStock(stock, i);
    manifest.push(r);
    if (r.status === "ok" || r.status === "cached") okCount++;
    else failCount++;
    if (r.ticker) tickerMap[r.slug] = r.ticker;
    if ((i + 1) % 25 === 0 || i === subset.length - 1) {
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(
        `  ${i + 1}/${subset.length}  ok=${okCount} fail=${failCount}  (${dt}s)`
      );
    }
    await sleep(150);
  }
});
await Promise.all(workers);

fs.writeFileSync(
  path.join(root, "data/tickers.json"),
  JSON.stringify(tickerMap, null, 2)
);
fs.writeFileSync(
  path.join(root, "data/prices_manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log(
  `\nDone. ${okCount}/${subset.length} stocks with history saved to web/public/prices/`
);
console.log(`Ticker map: data/tickers.json`);
console.log(`Manifest:   data/prices_manifest.json`);
