// Parse vinxsceurni.txt -> data/stocks.json
// Each row in the source is tab-separated; the first column is a 1-based row index.
// Source columns: idx, Fullname, CCY, Last, +/-, %, Bid, Ask, Volume, Turnover, Updated (CET)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const src = path.join(root, "data", "vinxsceurni.txt");
const out = path.join(root, "data", "stocks.json");

const ccyToCountry = {
  SEK: { country: "Sweden", flag: "🇸🇪", exchange: "Nasdaq Stockholm" },
  DKK: { country: "Denmark", flag: "🇩🇰", exchange: "Nasdaq Copenhagen" },
  EUR: { country: "Finland", flag: "🇫🇮", exchange: "Nasdaq Helsinki" },
  ISK: { country: "Iceland", flag: "🇮🇸", exchange: "Nasdaq Iceland" },
  NOK: { country: "Norway", flag: "🇳🇴", exchange: "Oslo Børs" },
};

function parseNum(s) {
  if (s === undefined || s === null) return null;
  const t = String(s).trim();
  if (t === "" || t === "—") return null;
  const n = Number(t.replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

const raw = fs.readFileSync(src, "utf8");
const lines = raw.split(/\r?\n/).filter(Boolean);

// First row is the header (with the leading row index)
const stocks = [];
for (const line of lines.slice(1)) {
  const cols = line.split("\t");
  if (cols.length < 3) continue;
  const [name, ccy, last, change, pct, bid, ask, volume, turnover, updated] = cols;
  const geo = ccyToCountry[ccy] ?? { country: ccy, flag: "🏳️", exchange: "" };
  const slug = slugify(name);
  stocks.push({
    slug,
    name: name.trim(),
    ccy: ccy?.trim() ?? "",
    country: geo.country,
    flag: geo.flag,
    exchange: geo.exchange,
    last: parseNum(last),
    change: parseNum(change),
    changePct: parseNum((pct ?? "").replace("%", "")),
    bid: parseNum(bid),
    ask: parseNum(ask),
    volume: parseNum(volume),
    turnover: parseNum(turnover),
    updated: (updated ?? "").trim(),
  });
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(stocks, null, 2) + "\n");

const byCountry = stocks.reduce((acc, s) => {
  acc[s.country] = (acc[s.country] || 0) + 1;
  return acc;
}, {});
console.log(`Wrote ${stocks.length} stocks -> ${path.relative(root, out)}`);
console.log("By country:", byCountry);
