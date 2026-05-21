"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allStocks, countryOrder, sectorOrder } from "@/lib/stocks";

const SECTORS = ["All", ...sectorOrder.filter((s) => allStocks.some((x) => x.sector === s))];
const COUNTRIES = ["All", ...countryOrder.filter((c) => allStocks.some((x) => x.country === c))];

export default function StocksPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const [sector, setSector] = useState("All");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allStocks
      .filter((s) => (country === "All" ? true : s.country === country))
      .filter((s) => (sector === "All" ? true : s.sector === sector))
      .filter((s) => (needle ? s.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "nb"));
  }, [q, country, sector]);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-nordic-50">Aksjer i VINX Small Cap</h1>
        <p className="text-nordic-200 max-w-3xl">
          Alle {allStocks.length} konstituenter i VINXSCEURNI per snapshot mai 2026.
          Bruk søkefelt og filter for å zoome inn på land, sektor, eller spesifikke
          selskaper. Klikk et kort for detaljer.
        </p>
      </header>

      <div className="glass rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="search"
          placeholder="Søk etter selskap (f.eks. Embracer, Bavarian)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-nordic-50 placeholder:text-nordic-300/60 focus:outline-none focus:border-nordic-400"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-nordic-50 focus:outline-none focus:border-nordic-400"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c} className="bg-nordic-950 text-nordic-50">
              {c === "All" ? "Alle land" : c}
            </option>
          ))}
        </select>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-nordic-50 focus:outline-none focus:border-nordic-400"
        >
          {SECTORS.map((s) => (
            <option key={s} value={s} className="bg-nordic-950 text-nordic-50">
              {s === "All" ? "Alle sektorer" : s}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-nordic-300">{filtered.length} treff</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => {
          const pct = s.changePct;
          const sign = pct === null ? "" : pct > 0 ? "+" : pct < 0 ? "" : "";
          const color = pct === null ? "text-nordic-300" : pct > 0 ? "text-emerald-300" : pct < 0 ? "text-rose-300" : "text-nordic-200";
          return (
            <li key={s.slug}>
              <Link
                href={`/stocks/${s.slug}`}
                className="glass card-hover rounded-xl p-4 block h-full"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-nordic-50 truncate">{s.name}</div>
                    <div className="text-xs text-nordic-300 mt-0.5">
                      <span className="mr-1">{s.flag}</span>
                      {s.country} · {s.exchange}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm tabular-nums text-nordic-100">
                      {s.last !== null ? s.last.toLocaleString("nb-NO") : "—"}{" "}
                      <span className="text-xs text-nordic-400">{s.ccy}</span>
                    </div>
                    <div className={`text-xs tabular-nums ${color}`}>
                      {pct !== null ? `${sign}${pct.toFixed(2)}%` : "—"}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-nordic-200/90 line-clamp-3">{s.description}</p>
                <div className="mt-3 inline-flex items-center text-[10px] uppercase tracking-widest text-nordic-400">
                  {s.sector}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
