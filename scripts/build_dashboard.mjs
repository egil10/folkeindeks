// Build one compact web/public/dashboard.json that the /dashboard page fetches
// in a single request, instead of pulling 356 per-stock price files. Each stock
// gets a weekly-downsampled series of adjusted closes in local currency and in
// NOK, so the dashboard can slice by period (1M…5Y) and toggle Lokal/NOK
// entirely on the client.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const priceDir = path.join(root, "web", "public", "prices");
const stocksFile = path.join(root, "data", "stocks.json");
const outFile = path.join(root, "web", "public", "dashboard.json");

const stocks = JSON.parse(fs.readFileSync(stocksFile, "utf8"));

const STEP = 5; // keep ~1 bar per trading week
const sig = (v) => (v == null ? null : Number(v.toPrecision(5)));

const out = [];
let missing = 0;

for (const s of stocks) {
  const file = path.join(priceDir, `${s.slug}.json`);
  if (!fs.existsSync(file)) {
    missing++;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const history = (data.history || []).filter(
    (b) => (b.adjClose ?? b.close) != null
  );
  if (history.length < 5) {
    missing++;
    continue;
  }

  const series = [];
  let hasNok = false;
  for (let i = 0; i < history.length; i++) {
    // Downsample to weekly, but always keep the final bar.
    if (i % STEP !== 0 && i !== history.length - 1) continue;
    const b = history[i];
    const local = b.adjClose ?? b.close ?? null;
    const nok = b.adjCloseNOK ?? b.closeNOK ?? null;
    if (nok != null) hasNok = true;
    series.push([b.date, sig(local), sig(nok)]);
  }

  out.push({
    slug: s.slug,
    name: s.name,
    flag: s.flag,
    country: s.country,
    sector: s.sector,
    ccy: s.ccy,
    hasNok,
    series,
  });
}

out.sort((a, b) => a.name.localeCompare(b.name, "nb"));

fs.writeFileSync(
  outFile,
  JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), stocks: out })
);

const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
console.log(`dashboard: ${out.length} stocks, missing=${missing}, ${kb} KB → ${outFile}`);
