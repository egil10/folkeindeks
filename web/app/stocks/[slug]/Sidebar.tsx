"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { allStocks } from "@/lib/stocks";

export default function Sidebar() {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allStocks
      .filter((s) => (needle ? s.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "nb"));
  }, [q]);

  return (
    <aside className="hidden md:block md:sticky md:top-16 md:self-start">
      <div className="card p-3">
        <input
          type="search"
          placeholder="Søk i 361 aksjer…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full bg-white border hairline rounded-md px-2.5 py-1.5 text-[12px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-accent-500"
        />
        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink-500 px-1">
          {list.length} treff
        </div>
        <ul className="mt-2 max-h-[70vh] overflow-y-auto text-[12px] -mx-1">
          {list.map((s) => {
            const active = s.slug === currentSlug;
            return (
              <li key={s.slug}>
                <Link
                  href={`/stocks/${s.slug}`}
                  className={`flex items-baseline justify-between gap-2 px-2 py-1 rounded ${
                    active
                      ? "bg-ink-900 text-white"
                      : "text-ink-700 hover:bg-ink-100"
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span
                    className={`text-[10px] tabular-nums shrink-0 ${
                      active ? "text-white/60" : "text-ink-400"
                    }`}
                  >
                    {s.ccy}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
