import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Folkeindeks — Statens fond i Tromsø + VINX Small Cap",
  description:
    "Interview prep dashboard: Folketrygdfondet, Statens fond i Tromsø, and the VINX Small Cap EUR NI (VINXSCEURNI) index universe — 361 Nordic small-cap constituents with research notes.",
};

const nav = [
  { href: "/", label: "Oversikt" },
  { href: "/stocks", label: "Aksjer" },
  { href: "/indeks", label: "Indeks" },
  { href: "/fund", label: "Tromsø-fondet" },
  { href: "/research", label: "Research" },
  { href: "/thesis", label: "PhD-prosjekt" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="min-h-screen font-sans antialiased">
        <header className="sticky top-0 z-30 glass border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight text-nordic-100">
              folkeindeks<span className="text-nordic-400">.no</span>
            </Link>
            <nav className="ml-auto flex flex-wrap gap-1 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md text-nordic-200 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-10 text-xs text-nordic-300/70">
          <p>
            Built as interview prep for Folketrygdfondet's PhD position in Tromsø.
            Data: Nasdaq Nordic VINX Small Cap EUR NI (May 2026 snapshot). Not investment advice.
          </p>
        </footer>
      </body>
    </html>
  );
}
