"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Bar = {
  date: string;
  close: number | null;
  adjClose: number | null;
  closeNOK: number | null;
  adjCloseNOK: number | null;
  volume: number | null;
};

type Series = {
  slug: string;
  name: string;
  ticker: string;
  ccy: string;
  country: string;
  sector: string;
  history: Bar[];
};

const RANGES = [
  { key: "1M", days: 30 },
  { key: "3M", days: 90 },
  { key: "6M", days: 180 },
  { key: "1Y", days: 365 },
  { key: "3Y", days: 365 * 3 },
  { key: "5Y", days: 365 * 5 },
];

export default function PriceChart({ slug }: { slug: string }) {
  const [data, setData] = useState<Series | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"native" | "nok">("native");
  const [range, setRange] = useState<string>("1Y");

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);
    fetch(`/prices/${slug}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("Ingen prishistorikk for denne aksjen.");
        return r.json();
      })
      .then((d: Series) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sliced = useMemo(() => {
    if (!data) return [];
    const rangeObj = RANGES.find((r) => r.key === range)!;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeObj.days);
    const cutoffISO = cutoff.toISOString().slice(0, 10);
    return data.history.filter((b) => b.date >= cutoffISO);
  }, [data, range]);

  const startVal = sliced[0]?.adjClose ?? sliced[0]?.close ?? null;
  const endVal =
    sliced[sliced.length - 1]?.adjClose ?? sliced[sliced.length - 1]?.close ?? null;
  const ret =
    startVal !== null && endVal !== null && startVal > 0
      ? ((endVal / startVal - 1) * 100).toFixed(2)
      : null;

  const valueKey = mode === "nok" ? "adjCloseNOK" : "adjClose";
  const ccyLabel = mode === "nok" ? "NOK" : data?.ccy ?? "";
  const hasNok = sliced.some((b) => b[valueKey as keyof Bar] !== null && b.closeNOK !== null);

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[13px] text-ink-500">{error}</p>
        <p className="text-[11px] text-ink-400 mt-2">
          Ticker-oppslag på Yahoo Finance ga ingen treff. Vi viser kun
          intradagdata fra Nasdaq for denne aksjen.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-8">
        <div className="h-[320px] flex items-center justify-center text-[13px] text-ink-400">
          Henter prishistorikk…
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.15em] text-ink-500">
            {data.ticker} · {sliced.length} handelsdager
          </div>
          {ret !== null && (
            <div className="mt-1 text-[13px]">
              <span className="text-ink-500">Periodeavkastning</span>{" "}
              <span
                className={`tabular-nums font-medium ${
                  Number(ret) > 0
                    ? "text-emerald-700"
                    : Number(ret) < 0
                    ? "text-rose-700"
                    : "text-ink-700"
                }`}
              >
                {Number(ret) > 0 ? "+" : ""}
                {ret}%
              </span>{" "}
              <span className="text-ink-400">({ccyLabel})</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
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
          {hasNok && data.ccy !== "NOK" && (
            <div className="inline-flex border hairline rounded-md overflow-hidden text-[12px]">
              <button
                onClick={() => setMode("native")}
                className={`px-2.5 py-1 ${
                  mode === "native"
                    ? "bg-ink-900 text-white"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                {data.ccy}
              </button>
              <button
                onClick={() => setMode("nok")}
                className={`px-2.5 py-1 ${
                  mode === "nok"
                    ? "bg-ink-900 text-white"
                    : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                NOK
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={sliced} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#314a6c" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#314a6c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#737373" }}
              tickMargin={8}
              minTickGap={36}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "#737373" }}
              tickMargin={6}
              width={56}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) =>
                v.toLocaleString("nb-NO", { maximumFractionDigits: 0 })
              }
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const v = payload[0]?.value as number | undefined;
                return (
                  <div className="bg-white border hairline rounded-md px-3 py-2 text-[12px] shadow-sm">
                    <div className="text-ink-500">{label}</div>
                    <div className="text-ink-900 tabular-nums">
                      {v !== undefined
                        ? `${v.toLocaleString("nb-NO", {
                            maximumFractionDigits: 2,
                          })} ${ccyLabel}`
                        : "—"}
                    </div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey={valueKey}
              stroke="#314a6c"
              strokeWidth={1.5}
              fill="url(#priceFill)"
              isAnimationActive={false}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-3 text-[11px] text-ink-400">
        Kilde: Yahoo Finance · justerte sluttkurser. NOK-konvertering bruker
        Yahoos daglige valutakursserier (SEK/DKK/EUR-NOK). ISK-konvertering er
        ikke tilgjengelig.
      </p>
    </div>
  );
}
