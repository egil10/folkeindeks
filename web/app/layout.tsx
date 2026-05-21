import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Folkeindeks — Statens fond i Tromsø + VINX Small Cap",
  description:
    "Interview prep workspace: Folketrygdfondet, Statens fond i Tromsø, the VINX Small Cap (SFTX) universe — 361 Nordic small-caps, five management strategies, and a PhD project rooted in the BANTHE methodology.",
};

const nav = [
  { href: "/", label: "Oversikt" },
  { href: "/strategier", label: "Strategier" },
  { href: "/bakgrunn", label: "Bakgrunn" },
  { href: "/thesis", label: "PhD" },
  { href: "/fund", label: "Tromsø-fondet" },
  { href: "/indeks", label: "Indeks" },
  { href: "/stocks", label: "Aksjer" },
  { href: "/research", label: "Research" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="min-h-screen font-sans antialiased text-ink-900">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b hairline">
          <div className="mx-auto max-w-6xl px-5 h-14 flex items-center gap-6">
            <Link
              href="/"
              className="font-semibold tracking-tightest text-ink-900 text-[15px]"
            >
              folkeindeks
              <span className="text-accent-600">.</span>
            </Link>
            <nav className="ml-auto flex flex-wrap gap-x-1 gap-y-1 text-[13px]">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2.5 py-1.5 rounded-md text-ink-700 hover:text-ink-900 hover:bg-ink-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-12 md:py-16">{children}</main>
        <footer className="border-t hairline mt-16">
          <div className="mx-auto max-w-6xl px-5 py-10 text-xs text-ink-500 flex flex-wrap gap-x-6 gap-y-2">
            <span>
              Interview-prep workspace for Folketrygdfondets PhD-stilling i Tromsø.
            </span>
            <span>
              Data: Nasdaq Nordic VINX Small Cap EUR NI · snapshot mai 2026.
            </span>
            <span>Ikke investeringsråd.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
