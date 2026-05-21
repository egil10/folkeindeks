// Make stock descriptions more comprehensive without inventing facts.
//
// We expand the short `description` to 2–3 sentences and, where `long` is
// missing, synthesise a paragraph from sector + country + tier templates plus
// the curated short description. The goal is informational density — not
// novelty — so the extra sentences come from a small bank of economically-
// honest sector blurbs.
//
// Idempotent: a `_baseDescription` field stores the original one-liner so the
// script can be re-run without piling sentences on top of each other.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const file = path.join(root, "data", "stocks.json");
const stocks = JSON.parse(fs.readFileSync(file, "utf8"));

const sectorBlurb = {
  Industrials:
    "Order intake and operating leverage track the broader European industrial cycle.",
  "Health Care":
    "Demand has a defensive demographic floor, but pricing is shaped by public reimbursement and regulatory approval.",
  "Real Estate":
    "Net asset value and earnings are sensitive to interest rates, rental indexation and the local property cycle.",
  Financials:
    "Profitability is driven by net interest margin, fee income and credit quality through the cycle.",
  Technology:
    "Growth is tied to enterprise IT spend, product release cycles and the recurring share of revenue.",
  "Communication Services":
    "Revenue sits between subscription telecoms and ad-funded media, with capex intensity varying by segment.",
  "Consumer Discretionary":
    "Volumes are procyclical and sensitive to household real income and consumer confidence.",
  "Consumer Staples":
    "Predictable everyday demand limits downside but also caps organic growth.",
  Materials:
    "Cash flows track commodity prices, energy input costs and global trade flows.",
  Energy:
    "Earnings move with crude, gas and refining margins and the pace of the energy transition.",
  Utilities:
    "Largely regulated cash flows with rate-base growth and inflation pass-through.",
  "Consumer Services":
    "Labour-intensive operations with limited pricing power and exposure to public-sector funding cycles.",
  Other:
    "A mixed business mix means top-line and margin drivers vary by segment.",
};

const countryBackdrop = {
  Sweden:
    "Sweden's mid- and small-cap segment dominates the Nordic listed universe and is where Folketrygdfondet's regional mandate finds most of its breadth.",
  Denmark:
    "Danish listings tilt toward health-care, shipping and pension-linked financials, with deep institutional ownership.",
  Finland:
    "Finnish industrials and forestry dominate Helsinki's main board, with euro-denominated reporting easing comparison to continental peers.",
  Iceland:
    "Iceland's listed market is small and concentrated, with banks, salmon and tourism among the main themes.",
  Norway:
    "Oslo Børs is shaped by energy, shipping and seafood; this name sits inside Folketrygdfondet's home turf.",
};

function endPunct(s) {
  return /[.!?]$/.test(s) ? "" : ".";
}

function listingSentence(s) {
  const tier = s.tier ? `${s.tier.toLowerCase()}-cap` : "listed";
  return `Trades on ${s.exchange} in ${s.ccy} as a ${tier} ${s.country} name.`;
}

function expandShort(s, base) {
  if (!base) return base;
  const sector = sectorBlurb[s.sector] || "";
  const listing = listingSentence(s);
  return [base + endPunct(base), sector, listing].filter(Boolean).join(" ");
}

function synthLong(s, base) {
  const sector = sectorBlurb[s.sector] || "";
  const backdrop = countryBackdrop[s.country] || "";
  const ccyNote =
    s.ccy === "NOK"
      ? "Reporting is in Norwegian kroner, so NOK-based investors have no FX overlay."
      : `Reporting is in ${s.ccy}, which adds a currency overlay for NOK-based investors.`;
  const tier = s.tier ? `${s.tier.toLowerCase()}-cap` : "listed";

  const para1 = `${base + endPunct(base)} ${sector}`.trim();
  const para2 = `Listed on ${s.exchange} as a ${tier} ${s.country} name, ${s.name} sits inside the Nordic single-stock universe that Folketrygdfondet's mandate now reaches. ${ccyNote}`;
  const para3 = backdrop
    ? `${backdrop} For valuation, earnings cadence and ownership detail, consult the company's investor-relations materials — Folkeindeks keeps the narrative short and routes users out to primary sources for the rest.`
    : `For valuation, earnings cadence and ownership detail, consult the company's investor-relations materials — Folkeindeks keeps the narrative short and routes users out to primary sources for the rest.`;

  return [para1, para2, para3].join(" ");
}

let updatedShort = 0;
let updatedLong = 0;
let synthesisedLong = 0;

for (const s of stocks) {
  // Capture the original one-liner exactly once so re-runs are idempotent.
  if (!s._baseDescription) {
    s._baseDescription = s.description || "";
  }
  const base = s._baseDescription;

  // Same trick for `long`: remember whether it was author-curated.
  const hadOriginalLong = s._hasCuratedLong === true || (s._hasCuratedLong === undefined && !!s.long);
  if (s._hasCuratedLong === undefined) {
    s._hasCuratedLong = !!s.long;
  }

  const newShort = expandShort(s, base);
  if (newShort !== s.description) {
    s.description = newShort;
    updatedShort++;
  }

  if (!hadOriginalLong) {
    const newLong = synthLong(s, base);
    if (newLong !== s.long) {
      s.long = newLong;
      updatedLong++;
      synthesisedLong++;
    }
  }
}

fs.writeFileSync(file, JSON.stringify(stocks, null, 2));
console.log(
  `descriptions: shortUpdated=${updatedShort} longSynthesised=${synthesisedLong} of ${stocks.length}`
);
