import stocks from "../../data/stocks.json";
import historicals from "../../data/historicals.json";

export type CapTier = "Large" | "Mid" | "Small";

export type Multiples = {
  marketCapMNOK: number | null;
  peRatio: number | null;
  evEbitda: number | null;
  pbRatio: number | null;
  dividendYield: number | null;
  netDebtEbitda: number | null;
  roe: number | null;
  beta: number | null;
};

export type Historicals = {
  asOf: string;
  bars: number;
  return1M: number | null;
  return3M: number | null;
  return6M: number | null;
  returnYTD: number | null;
  return1Y: number | null;
  return3Y: number | null;
  return5Y: number | null;
  high52w: number | null;
  low52w: number | null;
  volatility1Y: number | null;
  maxDrawdown1Y: number | null;
  avgVolume3M: number | null;
};

const historicalsMap = historicals as Record<string, Historicals>;

export function getHistoricals(slug: string): Historicals | null {
  return historicalsMap[slug] ?? null;
}

export type Stock = {
  slug: string;
  name: string;
  ccy: string;
  country: string;
  flag: string;
  exchange: string;
  last: number | null;
  change: number | null;
  changePct: number | null;
  bid: number | null;
  ask: number | null;
  volume: number | null;
  turnover: number | null;
  updated: string;
  sector: string;
  description: string;
  long: string | null;
  tier: CapTier | null;
  multiples: Multiples;
};

export const allStocks = stocks as Stock[];

export function getStock(slug: string): Stock | undefined {
  return allStocks.find((s) => s.slug === slug);
}

export const countryOrder = ["Sweden", "Denmark", "Finland", "Iceland", "Norway"];

export const sectorOrder = [
  "Industrials",
  "Health Care",
  "Consumer Discretionary",
  "Real Estate",
  "Financials",
  "Technology",
  "Communication Services",
  "Consumer Staples",
  "Materials",
  "Energy",
  "Utilities",
  "Consumer Services",
  "Other",
];

export function statsByCountry() {
  const map = new Map<string, number>();
  for (const s of allStocks) map.set(s.country, (map.get(s.country) || 0) + 1);
  return countryOrder
    .filter((c) => map.has(c))
    .map((country) => ({ country, count: map.get(country) || 0 }));
}

export function statsBySector() {
  const map = new Map<string, number>();
  for (const s of allStocks) map.set(s.sector, (map.get(s.sector) || 0) + 1);
  return sectorOrder
    .filter((s) => map.has(s))
    .map((sector) => ({ sector, count: map.get(sector) || 0 }));
}
