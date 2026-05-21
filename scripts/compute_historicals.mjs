// Compute historical returns + risk numbers from cached Yahoo price files in
// web/public/prices/<slug>.json and write a slim data/historicals.json that
// the Next.js page imports.
//
// All values are derived from adjusted closes in the native currency. Returns
// are point-to-point (last close vs close N trading days ago). Volatility is
// the annualised stdev of daily log returns over the last 252 trading days.
// Max drawdown is the largest peak-to-trough fall over the last 252 days.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const priceDir = path.join(root, "web", "public", "prices");
const stocksFile = path.join(root, "data", "stocks.json");
const outFile = path.join(root, "data", "historicals.json");

const stocks = JSON.parse(fs.readFileSync(stocksFile, "utf8"));

function valueAt(history, idx) {
  if (idx < 0 || idx >= history.length) return null;
  const bar = history[idx];
  return bar.adjClose ?? bar.close ?? null;
}

function returnPct(history, days) {
  if (history.length < 2) return null;
  const endIdx = history.length - 1;
  const endVal = valueAt(history, endIdx);
  if (endVal === null || endVal <= 0) return null;

  const startIdx = endIdx - days;
  if (startIdx < 0) return null;
  const startVal = valueAt(history, startIdx);
  if (startVal === null || startVal <= 0) return null;

  return (endVal / startVal - 1) * 100;
}

function annualisedReturnPct(history, days) {
  const total = returnPct(history, days);
  if (total === null) return null;
  const years = days / 252;
  if (years <= 0) return null;
  const factor = 1 + total / 100;
  if (factor <= 0) return null;
  return (Math.pow(factor, 1 / years) - 1) * 100;
}

function ytdReturnPct(history) {
  if (history.length < 2) return null;
  const last = history[history.length - 1];
  const year = last.date.slice(0, 4);
  const firstOfYear = history.find((b) => b.date.slice(0, 4) === year);
  if (!firstOfYear) return null;
  const startVal = firstOfYear.adjClose ?? firstOfYear.close ?? null;
  const endVal = last.adjClose ?? last.close ?? null;
  if (!startVal || !endVal || startVal <= 0) return null;
  return (endVal / startVal - 1) * 100;
}

function fiftyTwoWeek(history) {
  const slice = history.slice(-252);
  let high = -Infinity;
  let low = Infinity;
  for (const b of slice) {
    const v = b.adjClose ?? b.close ?? null;
    if (v === null) continue;
    if (v > high) high = v;
    if (v < low) low = v;
  }
  if (high === -Infinity || low === Infinity) return { high: null, low: null };
  return { high, low };
}

function volatility1Y(history) {
  const slice = history.slice(-252);
  const logRets = [];
  for (let i = 1; i < slice.length; i++) {
    const prev = slice[i - 1].adjClose ?? slice[i - 1].close ?? null;
    const cur = slice[i].adjClose ?? slice[i].close ?? null;
    if (prev === null || cur === null || prev <= 0 || cur <= 0) continue;
    logRets.push(Math.log(cur / prev));
  }
  if (logRets.length < 30) return null;
  const mean = logRets.reduce((a, b) => a + b, 0) / logRets.length;
  const variance =
    logRets.reduce((a, b) => a + (b - mean) ** 2, 0) / (logRets.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

function maxDrawdown1Y(history) {
  const slice = history.slice(-252);
  let peak = -Infinity;
  let worst = 0;
  for (const b of slice) {
    const v = b.adjClose ?? b.close ?? null;
    if (v === null) continue;
    if (v > peak) peak = v;
    if (peak > 0) {
      const dd = v / peak - 1;
      if (dd < worst) worst = dd;
    }
  }
  return worst === 0 ? null : worst * 100;
}

function avgVolume3M(history) {
  const slice = history.slice(-63);
  const vols = slice.map((b) => b.volume).filter((v) => v !== null && v > 0);
  if (vols.length < 10) return null;
  return Math.round(vols.reduce((a, b) => a + b, 0) / vols.length);
}

const out = {};
let computed = 0;
let missing = 0;

for (const s of stocks) {
  const file = path.join(priceDir, `${s.slug}.json`);
  if (!fs.existsSync(file)) {
    missing++;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const history = (data.history || []).filter(
    (b) => (b.adjClose ?? b.close) !== null
  );
  if (history.length < 5) {
    missing++;
    continue;
  }
  const last = history[history.length - 1];
  const { high, low } = fiftyTwoWeek(history);

  out[s.slug] = {
    asOf: last.date,
    bars: history.length,
    return1M: returnPct(history, 21),
    return3M: returnPct(history, 63),
    return6M: returnPct(history, 126),
    returnYTD: ytdReturnPct(history),
    return1Y: returnPct(history, 252),
    return3Y: annualisedReturnPct(history, 252 * 3),
    return5Y: annualisedReturnPct(history, 252 * 5),
    high52w: high,
    low52w: low,
    volatility1Y: volatility1Y(history),
    maxDrawdown1Y: maxDrawdown1Y(history),
    avgVolume3M: avgVolume3M(history),
  };
  computed++;
}

fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log(`historicals: computed=${computed} missing=${missing} → ${outFile}`);
