"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Neighbour = { slug: string; name: string };

export default function StockPager({
  prev,
  next,
  position,
}: {
  prev: Neighbour;
  next: Neighbour;
  position: string;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") router.push(`/stocks/${prev.slug}`);
      if (e.key === "ArrowRight") router.push(`/stocks/${next.slug}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev.slug, next.slug, router]);

  return (
    <div className="inline-flex items-center border hairline rounded-md overflow-hidden text-[12px]">
      <Link
        href={`/stocks/${prev.slug}`}
        aria-label={`Forrige aksje: ${prev.name}`}
        title={prev.name}
        className="px-2 py-1 text-ink-700 hover:bg-ink-100 inline-flex items-center"
      >
        <ChevronLeft size={14} />
      </Link>
      <span className="px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-ink-500 border-l border-r hairline tabular-nums">
        {position}
      </span>
      <Link
        href={`/stocks/${next.slug}`}
        aria-label={`Neste aksje: ${next.name}`}
        title={next.name}
        className="px-2 py-1 text-ink-700 hover:bg-ink-100 inline-flex items-center"
      >
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
