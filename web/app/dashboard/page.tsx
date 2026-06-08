"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allStocks, countryOrder, sectorOrder } from "@/lib/stocks";

type Point = [string, number | null, number | null]; // [date, local, nok]
type Item = {
  slug: string;
  name: string;
  flag: string;
  country: string;
  sector: string;
  ccy: string;
  hasNok: boolean;
  series: Point[];
};

const RANGES = [
  { key: "1M", days: 30 },
  { key: "3M", days: 90 },
  { key: "6M", days: 180 },
  { key: "1Y", days: 365 },
  { key: "3Y", days: 365 * 3 },
  { key: "5Y", days: 365 * 5 },
];

const SECTORS = ["Alle sektorer", ...sectorOrder.filter((s) => allStocks.some((x) => x.sector === s))];
const COUNTRIES = ["Alle land", ...countryOrder.filter((c) => allStocks.some((x) => x.country === c))];

export default function DashboardPage() {
  const [data, setData] = useState<Item[] | null>(null);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("Alle land");
  const [sector, setSector] = useState("Alle sektorer");
  const [range, setRange] = useState("1Y");
  const [ccy, setCcy] = useState<"local" | "nok">("local");

  useEffect(() => {
    fetch("/dashboard.json")
      .then((r) => r.json())
      .then((d: { stocks: Item[] }) => setData(d.stocks))
      .catch(() => setData([]));
  }, []);

  const cutoffISO = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)!.days;
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  }, [range]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    return data
      .filter((s) => (country === "Alle land" ? true : s.country === country))
      .filter((s) => (sector === "Alle sektorer" ? true : s.sector === sector))
      .filter((s) => (needle ? s.name.toLowerCase().includes(needle) : true));
  }, [data, q, country, sector]);

  return (
    <div className="space-y-8">
      <header className="space-y-3 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">
          Dashboard · VINX Small Cap
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-ink-900 tracking-tightest">
          Hele universet på én skjerm
        </h1>
        <p className="text-ink-600 text-[15px] leading-relaxed">
          Justerte sluttkurser for alle konstituenter. Velg periode og valuta én
          gang — det gjelder hver graf. Filtrér på land, sektor eller navn.
        </p>
      </header>

      <div className="card p-4 space-y-3 sticky top-14 z-30">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_220px] gap-2">
          <input
            type="search"
            placeholder="Søk etter selskap…"
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
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex border hairline rounded-md overflow-hidden text-[12px]">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-2.5 py-1 ${
                  range === r.key ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100"
                }`}
              >
                {r.key}
              </button>
            ))}
          </div>
          <div className="inline-flex border hairline rounded-md overflow-hidden text-[12px]">
            <button
              onClick={() => setCcy("local")}
              className={`px-2.5 py-1 ${
                ccy === "local" ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100"
              }`}
            >
              Lokal
            </button>
            <button
              onClick={() => setCcy("nok")}
              className={`px-2.5 py-1 ${
                ccy === "nok" ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100"
              }`}
            >
              NOK
            </button>
          </div>
          <span className="text-[12px] text-ink-500 ml-auto">
            {data ? `${filtered.length} selskaper` : "Laster…"}
          </span>
        </div>
      </div>

      {!data ? (
        <div className="text-[13px] text-ink-400 py-16 text-center">Henter prishistorikk…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((s) => (
            <DashCard key={s.slug} item={s} cutoffISO={cutoffISO} ccy={ccy} />
          ))}
        </div>
      )}
    </div>
  );
}

function DashCard({
  item,
  cutoffISO,
  ccy,
}: {
  item: Item;
  cutoffISO: string;
  ccy: "local" | "nok";
}) {
  const useNok = ccy === "nok" && item.hasNok;
  const vals: number[] = [];
  for (const p of item.series) {
    if (p[0] < cutoffISO) continue;
    const v = useNok ? p[2] ?? p[1] : p[1];
    if (v != null) vals.push(v);
  }
  const first = vals[0];
  const last = vals[vals.length - 1];
  const ret =
    first != null && last != null && first > 0 ? (last / first - 1) * 100 : null;

  const color =
    ret == null ? "#737373" : ret > 0 ? "#047857" : ret < 0 ? "#be123c" : "#737373";
  const retColor =
    ret == null
      ? "text-ink-400"
      : ret > 0
      ? "text-emerald-700"
      : ret < 0
      ? "text-rose-700"
      : "text-ink-500";

  return (
    <Link href={`/stocks/${item.slug}`} className="card card-hover p-4 block">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-ink-900 truncate">{item.name}</div>
          <div className="text-[11px] text-ink-500 mt-0.5">
            <span className="mr-1">{item.flag}</span>
            {item.country} · {item.sector}
          </div>
        </div>
        <div className={`text-[13px] tabular-nums font-medium shrink-0 ${retColor}`}>
          {ret != null ? `${ret > 0 ? "+" : ""}${ret.toFixed(1)}%` : "—"}
        </div>
      </div>
      <Sparkline vals={vals} color={color} />
      <div className="text-[10px] text-ink-400 tabular-nums">
        {useNok ? "NOK" : item.ccy}
      </div>
    </Link>
  );
}

function Sparkline({ vals, color }: { vals: number[]; color: string }) {
  const W = 100;
  const H = 32;
  if (vals.length < 2) {
    return <div className="h-[44px] mt-3 mb-1 flex items-center text-[11px] text-ink-400">Ingen data</div>;
  }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const stepX = W / (vals.length - 1);
  const pts = vals.map((v, i) => [i * stepX, H - ((v - min) / span) * H]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  const gid = `g${Math.round(min)}-${vals.length}-${color.slice(1)}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full h-[44px] mt-3 mb-1 block"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} stroke="none" />
      <path d={line} fill="none" stroke={color} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
