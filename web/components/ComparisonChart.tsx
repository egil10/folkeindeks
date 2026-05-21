"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { allStocks, type Stock } from "@/lib/stocks";

type Bar = {
  date: string;
  close: number | null;
  adjClose: number | null;
  closeNOK: number | null;
  adjCloseNOK: number | null;
};

type Series = {
  slug: string;
  name: string;
  ticker: string;
  ccy: string;
  country: string;
  history: Bar[];
};

const PALETTE = [
  "#314a6c", // accent blue
  "#b91c1c", // rose
  "#15803d", // emerald
  "#a16207", // amber
  "#7c3aed", // violet
  "#0e7490", // cyan
  "#be185d", // pink
  "#525252", // ink
];

const RANGES = [
  { key: "1M", days: 30 },
  { key: "3M", days: 90 },
  { key: "6M", days: 180 },
  { key: "1Y", days: 365 },
  { key: "3Y", days: 365 * 3 },
  { key: "5Y", days: 365 * 5 },
];

const DEFAULTS = ["jyske-bank", "avanza-bank-holding", "loomis", "mandatum", "huhtamaki-oyj"];

export default function ComparisonChart() {
  const [picked, setPicked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [seriesMap, setSeriesMap] = useState<Record<string, Series>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"native" | "nok">("nok");
  const [range, setRange] = useState<string>("1Y");

  // Initialise from localStorage on first mount, fall back to defaults
  useEffect(() => {
    if (hydrated) return;
    try {
      const raw = window.localStorage.getItem("compare:picked");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) {
          setPicked(arr);
          setHydrated(true);
          return;
        }
      }
    } catch {}
    setPicked(DEFAULTS);
    setHydrated(true);
  }, [hydrated]);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem("compare:picked", JSON.stringify(picked));
    } catch {}
  }, [picked, hydrated]);

  // Lazy-load series for each picked slug
  useEffect(() => {
    let cancelled = false;
    picked.forEach((slug) => {
      if (seriesMap[slug] || loading[slug]) return;
      setLoading((l) => ({ ...l, [slug]: true }));
      fetch(`/prices/${slug}.json`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (cancelled || !d) return;
          setSeriesMap((m) => ({ ...m, [slug]: d as Series }));
        })
        .finally(() => {
          if (!cancelled) setLoading((l) => ({ ...l, [slug]: false }));
        });
    });
    return () => {
      cancelled = true;
    };
  }, [picked, seriesMap, loading]);

  const stocksByName = useMemo(
    () => [...allStocks].sort((a, b) => a.name.localeCompare(b.name, "nb")),
    []
  );

  const searchHits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [] as Stock[];
    return stocksByName
      .filter((s) => s.name.toLowerCase().includes(needle))
      .filter((s) => !picked.includes(s.slug))
      .slice(0, 8);
  }, [q, picked, stocksByName]);

  const merged = useMemo(() => {
    if (picked.length === 0) return [];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RANGES.find((r) => r.key === range)!.days);
    const cutoffISO = cutoff.toISOString().slice(0, 10);

    const slicedSeries = picked
      .map((slug) => seriesMap[slug])
      .filter(Boolean)
      .map((s) => {
        const valueKey = mode === "nok" ? "adjCloseNOK" : "adjClose";
        const series = s.history
          .filter((b) => b.date >= cutoffISO && b[valueKey as keyof Bar] !== null)
          .map((b) => ({
            date: b.date,
            value: b[valueKey as keyof Bar] as number,
          }));
        const base = series[0]?.value;
        if (!base || base <= 0)
          return { slug: s.slug, normalised: [] as { date: string; value: number }[] };
        return {
          slug: s.slug,
          normalised: series.map((b) => ({
            date: b.date,
            value: (b.value / base) * 100,
          })),
        };
      });

    if (slicedSeries.length === 0) return [];

    const allDates = Array.from(
      new Set(slicedSeries.flatMap((s) => s.normalised.map((b) => b.date)))
    ).sort();

    const lastValue: Record<string, number | null> = {};
    return allDates.map((date) => {
      const row: Record<string, string | number> = { date };
      for (const s of slicedSeries) {
        const found = s.normalised.find((b) => b.date === date)?.value;
        if (found != null) lastValue[s.slug] = found;
        if (lastValue[s.slug] != null) row[s.slug] = lastValue[s.slug] as number;
      }
      return row;
    });
  }, [picked, seriesMap, range, mode]);

  const summary = useMemo(() => {
    return picked
      .map((slug) => seriesMap[slug])
      .filter(Boolean)
      .map((s) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - RANGES.find((r) => r.key === range)!.days);
        const cutoffISO = cutoff.toISOString().slice(0, 10);
        const valueKey = mode === "nok" ? "adjCloseNOK" : "adjClose";
        const bars = s.history.filter(
          (b) => b.date >= cutoffISO && b[valueKey as keyof Bar] !== null
        );
        if (bars.length < 2) return { slug: s.slug, name: s.name, ret: null, vol: null };
        const start = bars[0][valueKey as keyof Bar] as number;
        const end = bars[bars.length - 1][valueKey as keyof Bar] as number;
        const ret = (end / start - 1) * 100;
        const logReturns: number[] = [];
        for (let i = 1; i < bars.length; i++) {
          const a = bars[i - 1][valueKey as keyof Bar] as number;
          const b = bars[i][valueKey as keyof Bar] as number;
          if (a > 0 && b > 0) logReturns.push(Math.log(b / a));
        }
        const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
        const variance =
          logReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, logReturns.length - 1);
        const annualVol = Math.sqrt(variance) * Math.sqrt(252) * 100;
        return { slug: s.slug, name: s.name, ret, vol: annualVol };
      });
  }, [picked, seriesMap, range, mode]);

  function colorFor(slug: string) {
    const idx = picked.indexOf(slug);
    return PALETTE[idx % PALETTE.length];
  }

  return (
    <div className="space-y-5">
      <div className="card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-[12px] uppercase tracking-[0.15em] text-ink-500 mr-2">
            Aksjer
          </div>
          {picked.length === 0 && (
            <span className="text-[12px] text-ink-400">
              Ingen valgt — søk etter selskap nedenfor.
            </span>
          )}
          {picked.map((slug) => {
            const s = allStocks.find((x) => x.slug === slug);
            if (!s) return null;
            return (
              <button
                key={slug}
                onClick={() => setPicked((p) => p.filter((x) => x !== slug))}
                className="inline-flex items-center gap-2 border hairline rounded-full px-2.5 py-1 text-[12px] text-ink-800 hover:border-ink-300"
                title="Fjern"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: colorFor(slug) }}
                />
                {s.name}
                <span className="text-ink-400">·</span>
                <span className="text-ink-500 text-[11px]">{s.ccy}</span>
                <span className="text-ink-400 hover:text-rose-700">✕</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <input
            type="search"
            placeholder="Legg til selskap (Embracer, Bavarian, Avanza…)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-white border hairline rounded-md px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent-500"
          />
          {searchHits.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border hairline rounded-md shadow-sm max-h-64 overflow-y-auto">
              {searchHits.map((s) => (
                <li key={s.slug}>
                  <button
                    onClick={() => {
                      setPicked((p) => (p.includes(s.slug) ? p : [...p, s.slug]));
                      setQ("");
                    }}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-ink-800 hover:bg-ink-100 flex justify-between"
                  >
                    <span>{s.name}</span>
                    <span className="text-[11px] text-ink-500">
                      {s.country} · {s.ccy}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex border hairline rounded-md overflow-hidden text-[12px]">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-2.5 py-1 ${
                  range === r.key
                    ? "bg-ink-900 text-white"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                {r.key}
              </button>
            ))}
          </div>
          <div className="inline-flex border hairline rounded-md overflow-hidden text-[12px]">
            <button
              onClick={() => setMode("nok")}
              className={`px-2.5 py-1 ${
                mode === "nok"
                  ? "bg-ink-900 text-white"
                  : "text-ink-700 hover:bg-ink-100"
              }`}
            >
              NOK-basert
            </button>
            <button
              onClick={() => setMode("native")}
              className={`px-2.5 py-1 ${
                mode === "native"
                  ? "bg-ink-900 text-white"
                  : "text-ink-700 hover:bg-ink-100"
              }`}
            >
              Lokal valuta
            </button>
          </div>
          <button
            onClick={() => setPicked([])}
            className="ml-auto text-[12px] text-ink-500 hover:text-rose-700"
          >
            Tøm
          </button>
          <button
            onClick={() => setPicked(DEFAULTS)}
            className="text-[12px] text-ink-500 hover:text-ink-900"
          >
            SFT topp 5 (default)
          </button>
        </div>
      </div>

      <div className="card p-4 md:p-6">
        <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500 mb-2">
          Normalisert til 100 ved start av perioden
        </div>
        <div style={{ width: "100%", height: 400 }}>
          {merged.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[13px] text-ink-400">
              Legg til en eller flere aksjer for å se sammenligning.
            </div>
          ) : (
            <ResponsiveContainer>
              <LineChart data={merged} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  tickMargin={8}
                  minTickGap={48}
                  axisLine={{ stroke: "#e5e5e5" }}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11, fill: "#737373" }}
                  tickMargin={6}
                  width={48}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) =>
                    v.toLocaleString("nb-NO", { maximumFractionDigits: 0 })
                  }
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-white border hairline rounded-md px-3 py-2 text-[12px] shadow-sm">
                        <div className="text-ink-500">{label}</div>
                        <ul className="mt-1 space-y-0.5">
                          {payload.map((p) => {
                            const slug = p.dataKey as string;
                            const s = allStocks.find((x) => x.slug === slug);
                            const v = p.value as number;
                            return (
                              <li key={slug} className="flex justify-between gap-3">
                                <span style={{ color: p.color as string }}>{s?.name ?? slug}</span>
                                <span className="text-ink-900 tabular-nums">
                                  {v?.toFixed(1)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  iconType="plainline"
                  height={28}
                  formatter={(value: string) =>
                    allStocks.find((x) => x.slug === value)?.name ?? value
                  }
                  wrapperStyle={{ fontSize: 12 }}
                />
                {picked.map((slug) => (
                  <Line
                    key={slug}
                    type="monotone"
                    dataKey={slug}
                    stroke={colorFor(slug)}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <p className="mt-3 text-[11px] text-ink-400">
          Kilde: Yahoo Finance · justerte sluttkurser. NOK-konvertering bruker
          Yahoos daglige valutakursserier. Tidsserier som starter etter perioden
          (nylig børsnoterte) er rebasert til sin egen første handelsdag.
        </p>
      </div>

      {summary.length > 0 && (
        <div className="card overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.15em] text-ink-500 border-b hairline">
                <th className="p-3 font-medium">Selskap</th>
                <th className="p-3 font-medium text-right">Avk. ({range})</th>
                <th className="p-3 font-medium text-right">Annualisert vol.</th>
                <th className="p-3 font-medium text-right">Sharpe (uten rf)</th>
              </tr>
            </thead>
            <tbody className="text-ink-800">
              {summary.map((row) => {
                const sharpe =
                  row.ret !== null && row.vol !== null && row.vol > 0
                    ? row.ret / row.vol
                    : null;
                return (
                  <tr key={row.slug} className="border-b hairline last:border-0">
                    <td className="p-3">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: colorFor(row.slug) }}
                        />
                        {row.name}
                      </div>
                    </td>
                    <td
                      className={`p-3 text-right tabular-nums ${
                        row.ret == null
                          ? "text-ink-400"
                          : row.ret > 0
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {row.ret == null ? "—" : `${row.ret > 0 ? "+" : ""}${row.ret.toFixed(2)}%`}
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {row.vol == null ? "—" : `${row.vol.toFixed(1)}%`}
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {sharpe == null ? "—" : sharpe.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
