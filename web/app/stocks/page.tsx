"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allStocks, countryOrder, sectorOrder } from "@/lib/stocks";

const SECTORS = ["Alle sektorer", ...sectorOrder.filter((s) => allStocks.some((x) => x.sector === s))];
const COUNTRIES = ["Alle land", ...countryOrder.filter((c) => allStocks.some((x) => x.country === c))];

export default function StocksPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("Alle land");
  const [sector, setSector] = useState("Alle sektorer");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allStocks
      .filter((s) => (country === "Alle land" ? true : s.country === country))
      .filter((s) => (sector === "Alle sektorer" ? true : s.sector === sector))
      .filter((s) => (needle ? s.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "nb"));
  }, [q, country, sector]);

  return (
    <div className="space-y-8">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">Aksjer · VINX Small Cap</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          Alle {allStocks.length} konstituenter
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Søk og filtrér i hele small-cap-universet. Hver linje viser pris,
          dagens utvikling og en kuratert beskrivelse. Klikk for detalj og
          eksterne kilder.
        </p>
      </header>

      <div className="card p-4 grid grid-cols-1 md:grid-cols-[1fr_180px_220px] gap-2">
        <input
          type="search"
          placeholder="Søk etter selskap (Embracer, Jyske Bank, Avanza…)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="bg-white border hairline rounded-md px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent-500"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-white border hairline rounded-md px-3 py-2 text-[13px] text-ink-900 focus:outline-none focus:border-accent-500"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="bg-white border hairline rounded-md px-3 py-2 text-[13px] text-ink-900 focus:outline-none focus:border-accent-500"
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="text-[12px] text-ink-500">{filtered.length} treff</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => {
          const pct = s.changePct;
          const sign = pct === null ? "" : pct > 0 ? "+" : "";
          const color =
            pct === null
              ? "text-ink-400"
              : pct > 0
              ? "text-emerald-700"
              : pct < 0
              ? "text-rose-700"
              : "text-ink-500";
          return (
            <li key={s.slug}>
              <Link
                href={`/stocks/${s.slug}`}
                className="card card-hover p-4 block h-full"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-ink-900 truncate">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-ink-500 mt-1">
                      <span className="mr-1">{s.flag}</span>
                      {s.country} · {s.exchange}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] tabular-nums text-ink-900">
                      {s.last !== null ? s.last.toLocaleString("nb-NO") : "—"}
                      <span className="ml-1 text-[10px] text-ink-500">
                        {s.ccy}
                      </span>
                    </div>
                    <div className={`text-[11px] tabular-nums ${color}`}>
                      {pct !== null ? `${sign}${pct.toFixed(2)}%` : "—"}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[12px] text-ink-600 leading-relaxed line-clamp-3">
                  {s.description}
                </p>
                <div className="mt-3 inline-flex items-center text-[10px] uppercase tracking-[0.15em] text-ink-500">
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
