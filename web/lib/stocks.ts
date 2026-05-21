import stocks from "../../data/stocks.json";

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
