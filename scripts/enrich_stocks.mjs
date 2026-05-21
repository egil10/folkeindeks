// Enrich data/stocks.json with sector, a short tagline, an optional longer
// narrative, an optional market-cap tier (Large / Mid / Small) and an optional
// multiples object. The multiples object follows a fixed schema; any field may
// be null when we don't have a defensible value.
//
// We never invent precise valuation multiples — the schema is wired so a live
// source (Yahoo, Borsdata, etc.) can be plugged in later. Tier and long
// descriptions, on the other hand, are author-curated based on widely
// documented company profiles.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const file = path.join(root, "data", "stocks.json");
const stocks = JSON.parse(fs.readFileSync(file, "utf8"));

const EMPTY_MULTIPLES = {
  marketCapMNOK: null,
  peRatio: null,
  evEbitda: null,
  pbRatio: null,
  dividendYield: null,
  netDebtEbitda: null,
  roe: null,
  beta: null,
};

// Hand-curated overrides for the prominent constituents. Each entry is an
// object so we can add fields incrementally without breaking the older
// short-only entries.
const overrides = {
  "AcadeMedia": {
    sector: "Consumer Services",
    short: "Sweden's largest private education provider, running pre-schools, upper-secondary and adult education.",
    long: "AcadeMedia runs more than 700 pre-schools, upper-secondary schools and adult-education programmes across Sweden, Norway, Germany and the Netherlands. The bulk of revenue comes from publicly funded school-voucher payments, making cash flows defensive but politically sensitive. Long-run demand is supported by demographics and a growing willingness among Nordic parents to pick private alternatives.",
    tier: "Mid",
  },
  "Actic Group": {
    sector: "Consumer Services",
    short: "Nordic gym and fitness club operator.",
    long: "Actic runs roughly 170 gyms across Sweden, Norway, Finland and Germany, mostly in mid-sized cities and outside the largest urban centres. The business model is subscription based, so visibility is high — but pricing power is limited by low-cost competitors and self-service chains.",
    tier: "Small",
  },
  "Active Biotech": {
    sector: "Health Care",
    short: "Swedish biotech developing immunomodulators for cancer and autoimmune disease.",
    tier: "Small",
  },
  "AddLife B": {
    sector: "Health Care",
    short: "Distributor of medical-technology and lab products across the Nordics.",
    long: "AddLife is a serial-acquirer in medtech and laboratory equipment, structured into two divisions: Medtech (surgical, monitoring, hospital consumables) and Labtech (life-science instruments and reagents). Growth comes mostly from bolt-on M&A, with organic growth tied to public-healthcare procurement cycles.",
    tier: "Mid",
  },
  "Addnode Group B": {
    sector: "Technology",
    short: "IT solutions group focused on design, product lifecycle and public-sector software.",
    long: "Addnode resells and develops software in three areas: Design Management (CAD/PLM, including Autodesk reseller business), Product Lifecycle Management, and Process Management (case-handling tools for Nordic municipalities). A meaningful share of revenue is recurring software, with the rest from services around it.",
    tier: "Mid",
  },
  "AFRY": {
    sector: "Industrials",
    short: "Nordic engineering and consultancy firm (energy, infrastructure, industry).",
    long: "AFRY (formerly ÅF Pöyry) is one of the largest Nordic engineering consultancies, with ~19,000 specialists across infrastructure, industry, energy and digital solutions. Project mix is shifting toward energy transition (transmission grids, hydrogen, nuclear) which underpins the long-term growth thesis.",
    tier: "Mid",
  },
  "Aktia Pankki": {
    sector: "Financials",
    short: "Finnish retail and private bank.",
    tier: "Small",
  },
  "AL Sydbank": {
    sector: "Financials",
    short: "Danish full-service bank.",
  },
  "Alimak Group": {
    sector: "Industrials",
    short: "Vertical-access solutions (industrial lifts, hoists, BMUs).",
    long: "Alimak is the global market leader in industrial rack-and-pinion elevators, with aftermarket service on a large installed base across construction, wind power, oil & gas and façade access. Recurring service revenue typically delivers higher margins than the equipment sales themselves.",
    tier: "Mid",
  },
  "ALK-Abelló B": {
    sector: "Health Care",
    short: "Danish global leader in allergy immunotherapy.",
    long: "ALK-Abelló develops, makes and sells allergy immunotherapy products — tablets, drops and injections that treat the underlying cause of allergic disease rather than the symptoms. The tablet portfolio (grass, ragweed, house dust mite, tree, Japanese cedar) is the growth engine; the legacy injection and drops business is a steady cash generator.",
    tier: "Mid",
  },
  "Alleima": {
    sector: "Materials",
    short: "Advanced stainless steel and special-alloy producer (former Sandvik Materials).",
    long: "Alleima, spun out of Sandvik in 2022, makes high-end stainless tubes, strips and wires for oil & gas, medical devices, chemical processing and nuclear. The product mix skews toward specialty grades where lead times are long and Asian competition is thinner.",
    tier: "Mid",
  },
  "Alligator Bioscience": {
    sector: "Health Care",
    short: "Swedish immuno-oncology biotech.",
    tier: "Small",
  },
  "Alligo B": {
    sector: "Industrials",
    short: "Workwear, tools and consumables distributor for professionals.",
    long: "Alligo (Swedol + Grolls + TOOLS, demerged from Momentum Group) supplies workwear, hand tools and consumables to professional tradespeople in the Nordics. The customer base is fragmented small-and-medium contractors, so churn is low and ticket sizes manageable.",
    tier: "Small",
  },
  "Alm. Brand": {
    sector: "Financials",
    short: "Danish non-life insurer.",
    long: "Alm. Brand is Denmark's third-largest non-life insurer after Codan (Tryg) and Topdanmark, with a stronger weighting toward private customers and SMEs than corporate fleets. The Codan-Privat acquisition (2022) lifted scale meaningfully and synergies are still rolling through the combined ratio.",
    tier: "Mid",
  },
  "Alma Media Oyj": {
    sector: "Communication Services",
    short: "Finnish digital media and online marketplace group.",
    long: "Alma Media is a digital-first media group: classifieds and marketplaces (cars, jobs, real estate in Finland and the Baltics), business-information services, and a smaller news/journalism arm. Marketplaces drive most of the profitability.",
    tier: "Mid",
  },
  "Altra Fastigheter": {
    sector: "Real Estate",
    short: "Swedish commercial real-estate company.",
  },
  "Alvotech": {
    sector: "Health Care",
    short: "Iceland-based biosimilars developer.",
    long: "Alvotech is a vertically integrated biosimilars developer headquartered in Reykjavík, focused on complex molecules (Humira, Stelara, Eylea, Prolia/Xgeva biosimilars). Commercial partners include Teva, STADA and Advanz, with the US Humira biosimilar (AVT02 / Simlandi) the flagship product.",
    tier: "Mid",
  },
  "Amaroq Ltd.": {
    sector: "Materials",
    short: "Greenland-focused gold and strategic-metals explorer.",
    tier: "Small",
  },
  "Ambea": {
    sector: "Health Care",
    short: "Care services for elderly and people with disabilities across the Nordics.",
    long: "Ambea operates ~900 care units across Sweden, Norway, Denmark and Finland, focused on elderly care, disabled care (LSS) and individual & family care. Revenue is almost entirely from municipal contracts, so political risk around private welfare profits is the main investor concern.",
    tier: "Mid",
  },
  "Ambu": {
    sector: "Health Care",
    short: "Danish maker of single-use endoscopes and anaesthesia equipment.",
    long: "Ambu pioneered single-use flexible endoscopes (aScope), with the long-term thesis being conversion of the reusable-endoscope market on infection-control grounds. The bronchoscopy segment is established; urology, ENT and gastroenterology are the growth verticals where adoption is still early.",
    tier: "Mid",
  },
  "Anora Group Oyj": {
    sector: "Consumer Staples",
    short: "Nordic wine and spirits group (Koskenkorva, Linie aquavit).",
    long: "Anora was formed by the merger of Finland's Altia and Norway's Arcus in 2021, creating the largest Nordic wine and spirits player. Brand portfolio includes Koskenkorva vodka, Linie aquavit, Larsen cognac and a long list of regional spirits. Sales to state monopolies (Systembolaget, Vinmonopolet, Alko) make demand stable but pricing power limited.",
    tier: "Small",
  },
  "Apotea": {
    sector: "Consumer Staples",
    short: "Sweden's largest online pharmacy.",
    long: "Apotea is the dominant e-commerce pharmacy in Sweden with ~40% online market share, offering prescription drugs (Rx), OTC and personal-care products via one large automated warehouse outside Stockholm. The competitive moat is logistics density and a wide assortment rather than store footprint.",
    tier: "Mid",
  },
  "AQ Group": {
    sector: "Industrials",
    short: "Component manufacturer for industrial customers (transformers, wiring, mechanics).",
    tier: "Mid",
  },
  "Arctic Paper": {
    sector: "Materials",
    short: "Specialty graphical paper producer.",
    tier: "Small",
  },
  "Arion banki": {
    sector: "Financials",
    short: "Icelandic universal bank.",
    long: "Arion is one of three Icelandic systemic banks (with Íslandsbanki and Landsbankinn), offering retail, corporate, asset management and insurance services. The Icelandic banking market is small and concentrated, so loan-book growth is largely a function of nominal GDP and housing prices.",
    tier: "Small",
  },
  "Arjo B": {
    sector: "Health Care",
    short: "Medical devices for patient handling, hygiene and DVT prevention.",
    long: "Arjo, spun out of Getinge in 2017, makes patient-handling lifts, medical beds, hygiene aids and DVT-prevention devices for hospitals and long-term care. The business is split between capital sales (equipment) and rental/service, with rental in the US a meaningful share of profits.",
    tier: "Mid",
  },
  "Ascelia Pharma": {
    sector: "Health Care",
    short: "Swedish biotech focused on oncology imaging.",
    tier: "Small",
  },
  "Asker Healthcare Group": {
    sector: "Health Care",
    short: "Nordic distributor of medical and care products.",
    tier: "Mid",
  },
  "Asmodee Group B": {
    sector: "Communication Services",
    short: "Global publisher and distributor of board games and tabletop hobby.",
    long: "Asmodee, spun out of Embracer in 2025, is the global leader in tabletop hobby — publisher of Catan, 7 Wonders, Ticket to Ride and distributor of Magic: The Gathering across many regions. Revenue mix is owned IP plus distribution of partner titles; the hobby category has proved sticky post-pandemic.",
    tier: "Mid",
  },
  "Aspo Oyj": {
    sector: "Industrials",
    short: "Finnish conglomerate (shipping, energy, trading).",
    tier: "Small",
  },
  "Atrium Ljungberg B": {
    sector: "Real Estate",
    short: "Swedish urban property owner (offices, retail, residential).",
    long: "Atrium Ljungberg owns large mixed-use city districts in the Stockholm region — Sickla, Slussen, Mobilia (Malmö) — combining offices, retail, residential and public space. The mixed-use approach hedges single-segment risk and lets the company capture full-value chain on redevelopment.",
    tier: "Mid",
  },
  "Attendo": {
    sector: "Health Care",
    short: "Nordic care services for elderly and disabled.",
    tier: "Mid",
  },
  "Autoliv SDB": {
    sector: "Consumer Discretionary",
    short: "Global leader in automotive safety (airbags, seatbelts).",
    long: "Autoliv is the world's largest supplier of passive automotive safety systems — airbags, seatbelts and steering wheels — with ~40% global market share. Demand is tied to global light-vehicle production but content per vehicle keeps rising on the back of stricter regulations and more airbags per car.",
    tier: "Large",
  },
  "Avanza Bank Holding": {
    sector: "Financials",
    short: "Swedish online savings and brokerage bank.",
    long: "Avanza is Sweden's largest online savings platform with ~2 million customers, offering execution-only brokerage, ISK/KF savings wrappers, pensions and mortgages. Earnings split between net commission income (volume-driven, cyclical) and net interest income (rate-sensitive on customer cash balances).",
    tier: "Mid",
  },
  "Avarda Bank": {
    sector: "Financials",
    short: "Swedish payment-services and consumer-finance bank.",
  },
  "Axfood": {
    sector: "Consumer Staples",
    short: "Swedish food retailer (Willys, Hemköp, Snabbgross).",
    long: "Axfood is the #2 Swedish grocer behind ICA, with Willys (discount) the growth engine and Hemköp (full-service) the second pillar. The discount segment has gained share through cycle and the recent Bergendahls acquisition added City Gross to the platform.",
    tier: "Large",
  },
  "Bang & Olufsen": {
    sector: "Consumer Discretionary",
    short: "Danish premium audio and TV brand.",
    tier: "Small",
  },
  "Bavarian Nordic": {
    sector: "Health Care",
    short: "Danish vaccines company (smallpox/mpox, rabies, RSV).",
    long: "Bavarian Nordic makes specialist vaccines, with the smallpox/mpox vaccine (Jynneos/Imvanex/Imvamune) sold to government stockpiles being the historical anchor. The recent Emergent acquisition added travel vaccines (rabies, cholera, typhoid, TBE) and the company is pushing into the chikungunya and Lyme-disease pipelines.",
    tier: "Large",
  },
  "Beijer Alma B": {
    sector: "Industrials",
    short: "Industrial components group (springs, wire products, distribution).",
    tier: "Mid",
  },
  "Bera": {
    sector: "Financials",
    short: "Icelandic investment company.",
    tier: "Small",
  },
  "Bergman & Beving B": {
    sector: "Industrials",
    short: "Trading group serving industry and construction.",
    tier: "Small",
  },
  "Berner Industrier B": {
    sector: "Industrials",
    short: "Industrial distribution of technical products.",
    tier: "Small",
  },
  "Betsson B": {
    sector: "Consumer Discretionary",
    short: "Online sports betting and casino operator.",
    long: "Betsson operates ~20 online gambling brands across Europe and Latin America, with Casino historically the dominant product over Sportsbook. Regulatory pressure in mature markets (Sweden, Netherlands) is offset by faster growth in regulated LatAm markets and Italy.",
    tier: "Mid",
  },
  "Better Collective": {
    sector: "Communication Services",
    short: "Digital sports-media and affiliate marketing for iGaming.",
    long: "Better Collective owns a portfolio of sports-betting media properties (Action Network, VegasInsider, HLTV, bola in Brazil) and earns revenue mainly via revenue-share or cost-per-acquisition deals with regulated operators. The US sports-betting rollout was a tailwind that has now matured into a more stable run-rate.",
    tier: "Mid",
  },
  "BHG Group": {
    sector: "Consumer Discretionary",
    short: "Online home-improvement retailer in the Nordics.",
    tier: "Small",
  },
  "BICO Group": {
    sector: "Health Care",
    short: "Bio-convergence: 3D bioprinting, bioscience automation.",
    tier: "Small",
  },
  "Bilia A": {
    sector: "Consumer Discretionary",
    short: "Nordic auto dealer (Volvo, BMW, Toyota).",
    long: "Bilia is the leading Nordic auto retailer for Volvo, BMW, MINI, Toyota and Lexus, with a vehicle-sales business at low single-digit margins balanced by a higher-margin aftermarket (parts, service, used cars). The aftermarket is the resilient earnings anchor when new-car volumes cycle.",
    tier: "Mid",
  },
  "Billerud": {
    sector: "Materials",
    short: "Nordic packaging-paper producer.",
    long: "Billerud (Billerud + Verso since 2022) makes virgin-fibre packaging board and kraft paper, predominantly used for liquid packaging, sack paper and consumer packaging. The US Verso acquisition added graphic-paper mills that are being converted to packaging grades, which has been the main capex story.",
    tier: "Mid",
  },
  "BioArctic B": {
    sector: "Health Care",
    short: "Swedish biotech (Alzheimer's, partnered Leqembi with Eisai/Biogen).",
    long: "BioArctic discovered lecanemab (Leqembi), the anti-amyloid Alzheimer's antibody now partnered with Eisai and Biogen — they receive royalties on global sales plus development milestones. The wholly owned pipeline (Parkinson's, ALS) is early stage but provides optionality beyond the Leqembi royalty stream.",
    tier: "Mid",
  },
  "BioGaia B": {
    sector: "Consumer Staples",
    short: "Probiotic supplements for digestive and immune health.",
    long: "BioGaia is a Swedish probiotics specialist focused on the Lactobacillus reuteri strain, sold via local distribution partners (pharmacies, paediatricians) in ~100 countries. Sales are driven mainly by paediatric drops for colic; adult and immune-health products are the diversification angle.",
    tier: "Small",
  },
  "BioInvent International": {
    sector: "Health Care",
    short: "Swedish antibody-based cancer immunotherapy biotech.",
    tier: "Small",
  },
  "Bittium Oyj": {
    sector: "Technology",
    short: "Finnish specialist in secure communications and medical-tech devices.",
    tier: "Small",
  },
  "Bonava B": {
    sector: "Real Estate",
    short: "Nordic and German residential developer.",
    tier: "Small",
  },
  "BONESUPPORT HOLDING": {
    sector: "Health Care",
    short: "Injectable synthetic bone-graft substitutes.",
    long: "BONESUPPORT sells injectable, ceramic bone-graft substitutes (CERAMENT) used in trauma surgery and bone-infection treatment. The US, where reimbursement is most attractive, is the largest market and the growth engine.",
    tier: "Small",
  },
  "Boozt": {
    sector: "Consumer Discretionary",
    short: "Nordic online fashion retailer.",
    long: "Boozt is a Nordic online multi-brand fashion department store (Boozt.com) plus an off-price arm (Booztlet). Differentiation versus Zalando is curation skewed to Nordic-relevant brands and a higher mix of premium labels; sustainability and own logistics are positioned as moats.",
    tier: "Small",
  },
  "Bravida Holding": {
    sector: "Industrials",
    short: "Nordic installer of electrical, heating, plumbing and ventilation systems.",
    long: "Bravida is the largest installer of technical building services in the Nordics, with electrical, heating & plumbing and HVAC offerings on both new-build and a meaningful — and more resilient — service / aftermarket business. Demand has been weak in residential new-build but supported by public infrastructure and industrial projects.",
    tier: "Mid",
  },
  "Brdr. A & O Johansen B": {
    sector: "Industrials",
    short: "Danish wholesaler of technical installation products.",
    tier: "Small",
  },
  "Brim": {
    sector: "Consumer Staples",
    short: "Icelandic seafood (fishing and processing).",
    tier: "Small",
  },
  "BTS Group B": {
    sector: "Consumer Services",
    short: "Strategy execution and leadership training consultancy.",
    tier: "Small",
  },
  "Bufab": {
    sector: "Industrials",
    short: "Global supplier of fasteners and C-parts.",
    long: "Bufab handles C-parts supply (screws, nuts, washers, small components) for industrial manufacturers under VMI / Kanban contracts. The pitch is total cost-of-ownership: low-value parts whose stockout cost in a customer's line is enormous, so customers value reliability over price.",
    tier: "Mid",
  },
  "Bulten": {
    sector: "Industrials",
    short: "Fastener supplier to the automotive industry.",
    tier: "Small",
  },
  "Bure Equity": {
    sector: "Financials",
    short: "Swedish listed investment company.",
    long: "Bure Equity is a long-term holding company with concentrated stakes in Mycronic, Vitrolife, Yubico, Cavotec and others. Track record of NAV growth is the case for the discount-to-NAV narrowing over time.",
    tier: "Mid",
  },
  "Byggmax Group": {
    sector: "Consumer Discretionary",
    short: "Nordic DIY building-materials retailer.",
    tier: "Small",
  },
  "C-RAD B": {
    sector: "Health Care",
    short: "Patient-positioning and motion management for radiotherapy.",
    tier: "Small",
  },
  "Camurus": {
    sector: "Health Care",
    short: "Long-acting injectable therapies, notably for opioid dependence (Buvidal).",
    long: "Camurus uses its FluidCrystal depot technology to make long-acting injectables, with Buvidal (weekly/monthly buprenorphine for opioid dependence) the flagship product sold in Europe and Australia. The US launch (Brixadi, partnered with Braeburn) is the swing factor for the next phase of growth.",
    tier: "Mid",
  },
  "Cantargia": {
    sector: "Health Care",
    short: "Cancer biotech targeting IL1RAP.",
    tier: "Small",
  },
  "CapMan Oyj": {
    sector: "Financials",
    short: "Nordic private-asset manager (PE, infra, real estate).",
    tier: "Small",
  },
  "Carasent": {
    sector: "Health Care",
    short: "Cloud-based EHR for Nordic primary and outpatient care.",
    tier: "Small",
  },
  "Catella B": {
    sector: "Financials",
    short: "European property advisory and asset management.",
    tier: "Small",
  },
  "Catena": {
    sector: "Real Estate",
    short: "Swedish logistics-property landlord.",
    long: "Catena owns and develops logistics and warehouse properties along the Stockholm–Gothenburg–Malmö corridor and the Öresund region. Tenants are mostly large logistics integrators (Schenker, PostNord, DHL) and retailers — long leases, low vacancy, but development-led growth is rate-sensitive.",
    tier: "Mid",
  },
  "CBRAIN": {
    sector: "Technology",
    short: "Government-process software (case-management platform F2).",
    tier: "Small",
  },
  "CellaVision": {
    sector: "Health Care",
    short: "Automated digital cell-morphology systems for hematology labs.",
    long: "CellaVision automates microscopic analysis of blood cells — slides scanned, AI pre-classifies, technologist reviews on screen. Sales mix is razor/blade: instrument capex driving long-tail consumable and software revenue. The clinical use case is well established in mid-to-large hospital labs in developed markets.",
    tier: "Small",
  },
  "ChemoMetec": {
    sector: "Health Care",
    short: "Danish cell-counting instruments for life sciences.",
    tier: "Small",
  },
  "Cibus Real Estate": {
    sector: "Real Estate",
    short: "Owner of grocery-anchored properties in the Nordics.",
    long: "Cibus owns grocery-anchored retail properties across Finland, Sweden, Denmark and Norway, with Kesko, Coop, Tokmanni and S Group the largest tenants. Long leases (often 10+ years) and inflation-linked indexation make cash flows highly predictable; the equity story is mostly NAV growth and dividend.",
    tier: "Mid",
  },
  "Cinclus Pharma Holding": {
    sector: "Health Care",
    short: "GI-focused drug developer (acid-related disorders).",
    tier: "Small",
  },
  "Cint Group": {
    sector: "Communication Services",
    short: "Global digital insights and online survey platform.",
    tier: "Small",
  },
  "Citycon Oyj": {
    sector: "Real Estate",
    short: "Owner of urban grocery-anchored shopping centres in the Nordics and Baltics.",
    tier: "Mid",
  },
  "Clas Ohlson B": {
    sector: "Consumer Discretionary",
    short: "Swedish hardware/home retailer.",
    long: "Clas Ohlson operates ~220 hardware, electronics and household-goods stores across Sweden, Norway, Finland and the UK, plus a growing e-commerce channel. The assortment skews to inexpensive small-ticket items, which has proven resilient through consumer downturns.",
    tier: "Mid",
  },
  "Cloetta B": {
    sector: "Consumer Staples",
    short: "Nordic confectionery (Läkerol, Kexchoklad, Malaco).",
    long: "Cloetta owns a portfolio of Nordic confectionery brands — Läkerol, Kexchoklad, Polly, Malaco, Sportlunch — plus the pick-and-mix business. Demand is mostly impulse-driven and channel-mix sensitive (grocery vs. convenience), with cocoa and sugar input inflation the recurring margin worry.",
    tier: "Small",
  },
  "Coor Service Management Hold.": {
    sector: "Industrials",
    short: "Integrated facility management across the Nordics.",
    tier: "Mid",
  },
  "Corem Property Group B": {
    sector: "Real Estate",
    short: "Swedish/Nordic commercial-property owner.",
    tier: "Mid",
  },
  "CTEK": {
    sector: "Industrials",
    short: "Battery chargers and EV-charging solutions.",
    tier: "Small",
  },
  "CTT Systems": {
    sector: "Industrials",
    short: "Aircraft cabin humidification systems.",
    tier: "Small",
  },
  "D/S Norden": {
    sector: "Industrials",
    short: "Danish dry-cargo and product-tanker shipping.",
    tier: "Mid",
  },
  "Dedicare B": {
    sector: "Health Care",
    short: "Healthcare staffing across the Nordics.",
    tier: "Small",
  },
  "Demant": {
    sector: "Health Care",
    short: "Hearing aids, audiology and diagnostics (Oticon).",
    long: "Demant is one of the three global hearing-aid majors (with Sonova and GN), with Oticon as the consumer brand and a meaningful retail footprint (HearingLife, Audika). Demographic tailwind is strong: aging populations, low penetration of available hearing solutions, growing willingness to treat hearing loss.",
    tier: "Large",
  },
  "DFDS": {
    sector: "Industrials",
    short: "Danish ferry and logistics operator (Channel, North Sea, Baltic).",
    long: "DFDS runs ferry routes in the Channel, North Sea and Baltic plus a contract logistics business doing road haulage to/from Türkiye and the UK. Earnings are split between Ferry (cyclical on freight volumes and tourism) and Logistics (steadier but lower margin).",
    tier: "Mid",
  },
  "Diös Fastigheter": {
    sector: "Real Estate",
    short: "Property owner across northern Swedish cities.",
    tier: "Mid",
  },
  "Dometic Group": {
    sector: "Consumer Discretionary",
    short: "Mobile-living products (cooling, sanitation, food prep) for RVs and marine.",
    long: "Dometic makes everything from RV fridges and marine air-conditioners to portable coolers and toilets — sold both to OEMs (RV and boat manufacturers) and aftermarket. The OEM cycle has been brutal since the post-pandemic RV boom unwound; aftermarket is the more defensive piece.",
    tier: "Mid",
  },
  "Duni": {
    sector: "Consumer Discretionary",
    short: "Premium table-top concepts and sustainable packaging.",
    tier: "Small",
  },
  "Dustin Group": {
    sector: "Technology",
    short: "Nordic IT reseller for SMB and public sector.",
    tier: "Small",
  },
  "Dynavox Group": {
    sector: "Health Care",
    short: "Augmentative and alternative communication devices.",
    tier: "Small",
  },
  "Easor Oyj": {
    sector: "Industrials",
    short: "Finnish energy-systems group.",
  },
  "Eastnine": {
    sector: "Real Estate",
    short: "Owner of Baltic prime offices, listed in Sweden.",
    tier: "Small",
  },
  "Egetis Therapeutics": {
    sector: "Health Care",
    short: "Rare-disease drug development.",
    tier: "Small",
  },
  "Eik fasteignafélag": {
    sector: "Real Estate",
    short: "Icelandic commercial-property owner.",
    tier: "Small",
  },
  "Eimskipafélag Íslands": {
    sector: "Industrials",
    short: "Icelandic shipping and logistics.",
    tier: "Small",
  },
  "Elanders B": {
    sector: "Industrials",
    short: "Supply-chain solutions, print and packaging.",
    tier: "Small",
  },
  "Electrolux B": {
    sector: "Consumer Discretionary",
    short: "Global home-appliance maker.",
    long: "Electrolux is the second-largest white-goods maker globally after Whirlpool, with refrigerators, washing machines, dishwashers and cookers under Electrolux, AEG and Frigidaire. The US business has been the chronic underperformer; restructuring and shifting more production to lower-cost locations is the margin story.",
    tier: "Large",
  },
  "Electrolux Professional B": {
    sector: "Industrials",
    short: "Professional kitchen and laundry equipment.",
    long: "Electrolux Professional, demerged in 2020, makes commercial dishwashers, ovens, laundry machines and beverage equipment for hotels, restaurants and on-premise laundries. End markets are more cyclical than residential white goods but mix is shifting toward higher-margin connected-equipment and service.",
    tier: "Mid",
  },
  "Elekta B": {
    sector: "Health Care",
    short: "Radiation oncology and radiosurgery systems.",
    long: "Elekta competes with Varian (now part of Siemens Healthineers) in linear accelerators and brachytherapy for cancer treatment. The MR-Linac (Unity) is the differentiated bet; aftermarket service on a large installed base is the steady cash flow.",
    tier: "Mid",
  },
  "Embla Medical": {
    sector: "Health Care",
    short: "Iceland-based maker of prosthetics and bracing (formerly Össur).",
    long: "Embla Medical (formerly Össur) is one of two global majors in prosthetics — artificial limbs — alongside Ottobock, plus a meaningful bracing & supports business. Demand is structural (diabetes-related amputations, vascular disease) and reimbursed in most developed markets.",
    tier: "Mid",
  },
  "Embracer Group B": {
    sector: "Communication Services",
    short: "Video games and entertainment IP holding.",
    long: "Embracer rolled up dozens of game studios and IP libraries (Lord of the Rings via Middle-earth Enterprises, Tomb Raider, Saints Row, THQ Nordic, Dark Horse) at a frantic pace. After a 2023 funding shock, the group has split into three: Coffee Stain (PC/Console), Asmodee (tabletop), and Fellowship Entertainment (Lord of the Rings IP).",
    tier: "Mid",
  },
  "Enad Global 7": {
    sector: "Communication Services",
    short: "Game developer and publisher.",
    tier: "Small",
  },
  "Endomines Finland Oyj": {
    sector: "Materials",
    short: "Gold mining in Finland and the US.",
    tier: "Small",
  },
  "Enea": {
    sector: "Technology",
    short: "Telecom software (5G data management, network security).",
    tier: "Small",
  },
  "Enento Group Oyj": {
    sector: "Industrials",
    short: "Nordic business and consumer credit-information services.",
    tier: "Small",
  },
  "engcon B": {
    sector: "Industrials",
    short: "Tiltrotators for excavators.",
    long: "engcon is the inventor and global market leader in tiltrotators — the wrist-joint attachment between excavator and bucket that turns a digger into a multi-tool. Penetration is high in the Nordics but very low globally, which is the long-run growth thesis; geographic expansion (Germany, US) is the swing factor.",
    tier: "Mid",
  },
  "Enity Holding": {
    sector: "Financials",
    short: "Swedish consumer-finance lender.",
    tier: "Small",
  },
  "Eolus B": {
    sector: "Utilities",
    short: "Renewable-power project developer (wind, solar, storage).",
    tier: "Small",
  },
  "Ependion": {
    sector: "Technology",
    short: "Industrial computers, communications and embedded electronics.",
    tier: "Small",
  },
  "EQL Pharma": {
    sector: "Health Care",
    short: "Niche-generics pharmaceuticals.",
    tier: "Small",
  },
  "Ework Group": {
    sector: "Industrials",
    short: "Consulting and IT-talent supplier.",
    tier: "Small",
  },
  "F-Secure Oyj": {
    sector: "Technology",
    short: "Finnish consumer cybersecurity.",
    tier: "Small",
  },
  "Fabege": {
    sector: "Real Estate",
    short: "Stockholm office-property owner.",
    long: "Fabege is one of the dominant Stockholm office landlords, with portfolios concentrated in Solna, Hammarby Sjöstad and the CBD. Long-run NAV growth has come from densifying detail plans on land the company already owns rather than acquisitions.",
    tier: "Mid",
  },
  "Fagerhult Group": {
    sector: "Industrials",
    short: "Professional lighting solutions.",
    tier: "Mid",
  },
  "Fasadgruppen Group": {
    sector: "Industrials",
    short: "Nordic façade contractor.",
    tier: "Small",
  },
  "Fastighetsbolaget Emilshus B": {
    sector: "Real Estate",
    short: "Commercial property in southern Sweden.",
    tier: "Small",
  },
  "Fastpartner A": {
    sector: "Real Estate",
    short: "Swedish commercial real estate.",
    tier: "Mid",
  },
  "Fenix Outdoor International B": {
    sector: "Consumer Discretionary",
    short: "Outdoor brands (Fjällräven, Tierra, Primus).",
    long: "Fenix Outdoor owns the Fjällräven, Tierra, Hanwag, Primus and Brunton outdoor brands, sold via wholesale and own retail (Naturkompaniet, Frilufts, Globetrotter). Fjällräven's Kånken backpack and trekking line are the iconic products driving brand pull.",
    tier: "Mid",
  },
  "Ferronordic": {
    sector: "Industrials",
    short: "Construction-equipment dealer and services.",
    tier: "Small",
  },
  "Festi": {
    sector: "Consumer Discretionary",
    short: "Icelandic retail group (gas stations, grocery).",
    tier: "Small",
  },
  "Fingerprint Cards B": {
    sector: "Technology",
    short: "Biometric sensors (fingerprint).",
    tier: "Small",
  },
  "Finnair Oyj": {
    sector: "Industrials",
    short: "Finnish flag carrier airline.",
    tier: "Small",
  },
  "Fiskars Oyj Abp": {
    sector: "Consumer Discretionary",
    short: "Finnish maker of homeware and consumer goods (Fiskars, Iittala).",
    long: "Fiskars owns a portfolio of home and garden brands — Fiskars scissors and garden tools, Iittala glassware, Royal Copenhagen porcelain, Wedgwood, Waterford crystal. The acquisition of Georg Jensen (2024) added another Nordic heritage premium brand to the platform.",
    tier: "Mid",
  },
  "Flerie": {
    sector: "Health Care",
    short: "Life-science holding company.",
    tier: "Small",
  },
  "FLSmidth & Co.": {
    sector: "Industrials",
    short: "Equipment and services for mining and cement industries.",
    long: "FLSmidth supplies engineering, equipment and aftermarket services to mining (crushers, mills, flotation, dewatering) and cement (kilns, mills, automation). The strategic pivot is to refocus on Mining, which has structurally higher growth and margins than Cement, where the business is being wound down.",
    tier: "Mid",
  },
  "Føroya Banki": {
    sector: "Financials",
    short: "Faroese bank.",
    tier: "Small",
  },
  "G5 Entertainment": {
    sector: "Communication Services",
    short: "Mobile casual-games developer.",
    tier: "Small",
  },
  "Gentoo Media": {
    sector: "Communication Services",
    short: "Digital media for the iGaming industry.",
    tier: "Small",
  },
  "GN Store Nord": {
    sector: "Health Care",
    short: "Hearing instruments and audio communications (Jabra, ReSound).",
    long: "GN runs two businesses: GN Hearing (ReSound, Beltone hearing aids, competing with Demant and Sonova) and GN Audio (Jabra headsets, plus video collaboration via the SteelSeries gaming acquisition). The enterprise-audio business saw a violent post-pandemic destocking cycle which has now largely normalised.",
    tier: "Large",
  },
  "Gofore Oyj": {
    sector: "Technology",
    short: "Finnish digital-transformation consultancy.",
    tier: "Small",
  },
  "Green Landscaping Group": {
    sector: "Industrials",
    short: "Outdoor environment services (landscaping, infrastructure).",
    tier: "Small",
  },
  "GRK Infra Oyj": {
    sector: "Industrials",
    short: "Infrastructure construction (roads, rail).",
    tier: "Small",
  },
  "Gruvaktiebolaget Viscaria": {
    sector: "Materials",
    short: "Copper mining project in northern Sweden.",
    tier: "Small",
  },
  "Gränges": {
    sector: "Materials",
    short: "Rolled aluminium for HVAC and EV battery applications.",
    long: "Gränges is the world's largest producer of rolled aluminium for heat-exchanger applications (car radiators, A/C condensers) and a growing player in aluminium for EV battery cooling. The thesis is share-of-vehicle gain as cars electrify and thermal management content rises.",
    tier: "Mid",
  },
  "Gubra": {
    sector: "Health Care",
    short: "Preclinical contract research and obesity/metabolic drug development.",
    tier: "Small",
  },
  "H+H International": {
    sector: "Materials",
    short: "Aircrete building blocks producer.",
    tier: "Small",
  },
  "H. Lundbeck B": {
    sector: "Health Care",
    short: "Danish psychiatry- and neurology-focused pharma.",
    long: "Lundbeck is a CNS-focused pharma — depression (Trintellix, Brintellix), Alzheimer's-related agitation (Rexulti), migraine (Vyepti), Parkinson's (Onstryv). The Longboard acquisition added bexicaserin for epilepsy/Dravet syndrome as the late-stage pipeline catalyst.",
    tier: "Large",
  },
  "Hacksaw": {
    sector: "Communication Services",
    short: "iGaming content studio.",
    tier: "Small",
  },
  "Hagar": {
    sector: "Consumer Staples",
    short: "Icelandic food wholesaler.",
    tier: "Small",
  },
  "Hampiðjan": {
    sector: "Industrials",
    short: "Icelandic fishing-gear maker (nets, ropes).",
    tier: "Small",
  },
  "Hansa Biopharma": {
    sector: "Health Care",
    short: "Antibody-cleaving enzyme therapies (kidney transplant, autoimmune).",
    long: "Hansa develops imlifidase (Idefirix), an enzyme that cleaves IgG antibodies and is approved in Europe to enable kidney transplant in highly sensitised patients. Pipeline reach extends into anti-GBM disease, Guillain-Barré, gene therapy pre-treatment.",
    tier: "Small",
  },
  "HANZA": {
    sector: "Industrials",
    short: "Manufacturing partner for industrial customers.",
    tier: "Small",
  },
  "Harboes Bryggeri B": {
    sector: "Consumer Staples",
    short: "Danish brewery.",
    tier: "Small",
  },
  "Harvia Oyj": {
    sector: "Consumer Discretionary",
    short: "Sauna and spa products.",
    long: "Harvia is the global market leader in sauna stoves and complete sauna interiors, with strong positions in the Nordics and US. The infrared/sauna-conversion boom during the pandemic boosted volumes; the post-boom slowdown is the recent overhang.",
    tier: "Small",
  },
  "HEBA B": {
    sector: "Real Estate",
    short: "Stockholm residential property owner.",
    tier: "Small",
  },
  "Heimar": {
    sector: "Real Estate",
    short: "Icelandic property company.",
    tier: "Small",
  },
  "Hemnet Group": {
    sector: "Communication Services",
    short: "Sweden's leading residential property portal.",
    long: "Hemnet is the dominant residential-property listing site in Sweden, with ~90% of listings. Revenue per listing has grown well above inflation as the platform has rolled out premium-placement upgrades; the moat is the network effect between sellers, agents and buyers.",
    tier: "Mid",
  },
  "Hexatronic Group": {
    sector: "Technology",
    short: "Fibre-optic infrastructure products.",
    long: "Hexatronic makes fibre-optic ducts, cables and connectivity products for fixed-network rollouts, with the US a fast-growing market on the back of BEAD funding and rural fibre buildouts. The Swedish home market saw a sharp post-pandemic slowdown that has weighed on the share price.",
    tier: "Mid",
  },
  "HEXPOL B": {
    sector: "Materials",
    short: "Advanced polymer compounds.",
    long: "HEXPOL is the global leader in advanced rubber compounds, with operations across Europe, the Americas and Asia serving automotive, construction and consumer goods. Niche position, asset-light through-cycle returns and steady bolt-on M&A are the long-term thesis.",
    tier: "Mid",
  },
  "Hiab Oyj": {
    sector: "Industrials",
    short: "On-road load-handling equipment (cranes, tail-lifts).",
    long: "Hiab is the world's largest maker of on-road load-handling equipment — truck-mounted cranes (HIAB), forestry/recycling cranes (Loglift/Jonsered), demountables (Multilift), tail-lifts (Zepro/Waltco/Del). Demerged from Cargotec in 2024, now operates as a pure-play.",
    tier: "Mid",
  },
  "HMS Networks": {
    sector: "Technology",
    short: "Industrial Internet of Things communications.",
    long: "HMS Networks makes communication products that connect industrial equipment to networks and IT systems — gateways, embedded modules, remote-access solutions. End-market growth is tied to factory-automation capex and Industry 4.0 retrofits.",
    tier: "Mid",
  },
  "Hoist Finance": {
    sector: "Financials",
    short: "European acquirer of non-performing loans.",
    tier: "Small",
  },
  "Hufvudstaden A": {
    sector: "Real Estate",
    short: "Premium Stockholm/Gothenburg city-centre property.",
    long: "Hufvudstaden owns prime CBD properties in Stockholm (Norrmalmstorg, NK department store) and Gothenburg. Concentration on top-tier locations gives best-in-class vacancy and rent-growth metrics — the trade-off is a high P/NAV and low yield.",
    tier: "Mid",
  },
  "Huhtamäki Oyj": {
    sector: "Materials",
    short: "Sustainable food and consumer packaging.",
    tier: "Mid",
  },
  "Humana": {
    sector: "Health Care",
    short: "Care services across the Nordics.",
    tier: "Small",
  },
  "Humble Group": {
    sector: "Consumer Staples",
    short: "Sustainable/better-for-you consumer-goods group.",
    tier: "Small",
  },
  "HusCompagniet": {
    sector: "Consumer Discretionary",
    short: "Danish detached-house builder.",
    tier: "Small",
  },
  "Husqvarna B": {
    sector: "Industrials",
    short: "Outdoor power products (chainsaws, robotic mowers).",
    long: "Husqvarna sells chainsaws, robotic mowers, brushcutters and watering products via professional and consumer channels (Husqvarna, Gardena, Flymo brands). Robotic mowers — Automower — are the structural growth story; the consumer side is hostage to weather and DIY footfall.",
    tier: "Large",
  },
  "Icelandair Group": {
    sector: "Industrials",
    short: "Icelandic flag carrier airline.",
    tier: "Small",
  },
  "Immunovia": {
    sector: "Health Care",
    short: "Blood-based diagnostics (pancreatic cancer screening).",
    tier: "Small",
  },
  "Incap Oyj": {
    sector: "Industrials",
    short: "Electronics contract manufacturer.",
    tier: "Small",
  },
  "Infant Bacterial TherapeuticsB": {
    sector: "Health Care",
    short: "Therapy for necrotising enterocolitis in preterm infants.",
    tier: "Small",
  },
  "Instalco": {
    sector: "Industrials",
    short: "Nordic installation services (electrical, HVAC, plumbing).",
    long: "Instalco runs a decentralised installation group with ~150 entrepreneur-led local companies across Sweden, Norway, Finland and the Baltics. The model is Indutrade-like: M&A of small profitable companies kept operationally autonomous.",
    tier: "Mid",
  },
  "Intea Fastigheter B": {
    sector: "Real Estate",
    short: "Owner of public-sector properties (universities, courts).",
    tier: "Small",
  },
  "International Petroleum Corp.": {
    sector: "Energy",
    short: "Oil and gas producer (Canada, Malaysia, France).",
    tier: "Small",
  },
  "Intrum": {
    sector: "Financials",
    short: "European credit-management and debt-collection services.",
    long: "Intrum is Europe's largest credit-management services company — third-party servicing, plus owning non-performing-loan portfolios on its own balance sheet. The high leverage and US Chapter 11 restructuring (2024) have made the equity story a recovery / deleveraging play.",
    tier: "Small",
  },
  "INVISIO": {
    sector: "Industrials",
    short: "Communication systems for defence and security.",
    long: "INVISIO makes hearing-protection and intercom systems for soldiers — high-end gear where hearing protection, situational awareness and radio communication need to combine. The defence-spending cycle plus modernisation of dismounted-soldier equipment is the multi-year growth driver.",
    tier: "Mid",
  },
  "Inwido": {
    sector: "Industrials",
    short: "Nordic and European windows and doors.",
    tier: "Small",
  },
  "Isofol Medical": {
    sector: "Health Care",
    short: "Oncology drug development.",
    tier: "Small",
  },
  "ISS": {
    sector: "Industrials",
    short: "Global facility services.",
    long: "ISS is a global integrated facility services provider — cleaning, catering, security, technical services, workplace management — serving large corporates across ~30 countries. Margin recovery and de-leveraging post-COVID has been the multi-year story.",
    tier: "Mid",
  },
  "ITAB Shop Concept": {
    sector: "Industrials",
    short: "Retail store interiors and check-out systems.",
    tier: "Small",
  },
  "JBT Marel Corp.": {
    sector: "Industrials",
    short: "Food-processing technology and solutions.",
    long: "JBT Marel was formed in 2025 by the merger of US-listed JBT and Iceland-listed Marel — the resulting group is the global #1 in food-processing equipment (poultry, fish, meat) with a large recurring-aftermarket business. Synergies and category leadership in protein-processing are the investment case.",
    tier: "Large",
  },
  "Jeudan": {
    sector: "Real Estate",
    short: "Copenhagen office property owner and operator.",
    tier: "Mid",
  },
  "JM": {
    sector: "Consumer Discretionary",
    short: "Nordic residential developer.",
    long: "JM is one of Sweden's largest residential developers, focused on the Stockholm region with smaller positions in other Swedish cities, Oslo and Finland. The bull case requires Nordic interest rates and housing-affordability dynamics to turn back — the share price is closely tied to home-sales rates.",
    tier: "Mid",
  },
  "John Mattson Fastighetsföret.": {
    sector: "Real Estate",
    short: "Stockholm residential property owner.",
    tier: "Small",
  },
  "Jyske Bank": {
    sector: "Financials",
    short: "Danish full-service bank.",
    long: "Jyske Bank is Denmark's second-largest bank by domestic loans, with retail, SME and private-banking franchises (no investment-banking arm of note). The 2014 acquisition of BRFkredit gave it a mortgage-bond engine; the recent acquisition of Handelsbanken's Danish operations added scale in personal customers.",
    tier: "Large",
  },
  "K-Fast Holding B": {
    sector: "Real Estate",
    short: "Cost-efficient residential property developer.",
    tier: "Mid",
  },
  "Kaldalón": {
    sector: "Real Estate",
    short: "Icelandic property company.",
    tier: "Small",
  },
  "Kalmar Oyj B": {
    sector: "Industrials",
    short: "Container and cargo handling equipment.",
    long: "Kalmar, demerged from Cargotec in 2024, makes reach stackers, terminal tractors, straddle carriers, ship-to-shore and yard cranes for ports and intermodal terminals. The electrification of port equipment is the multi-year structural tailwind.",
    tier: "Mid",
  },
  "Kamux Oyj": {
    sector: "Consumer Discretionary",
    short: "Used-car retailer.",
    tier: "Small",
  },
  "Karnell Group B": {
    sector: "Industrials",
    short: "Niche industrial holding group.",
    tier: "Small",
  },
  "Karnov Group": {
    sector: "Communication Services",
    short: "Legal and tax information services.",
    tier: "Mid",
  },
  "Kemira Oyj": {
    sector: "Materials",
    short: "Specialty chemicals (water, pulp & paper).",
    long: "Kemira makes specialty chemicals for water treatment, pulp & paper and oil & gas. The strategic shift toward higher-margin water and pulp segments — and away from commoditised paper-grade products — has been the multi-year margin story.",
    tier: "Mid",
  },
  "Kempower Oyj": {
    sector: "Industrials",
    short: "Fast EV chargers for trucks and buses.",
    tier: "Small",
  },
  "Kinnevik B": {
    sector: "Financials",
    short: "Listed investment company focused on growth tech.",
    long: "Kinnevik is a Swedish investment company that pivoted from telecom (Tele2, MTG, Millicom) to growth tech and healthcare — current portfolio includes Pleo, TravelPerk, Spring Health, Mathem and others. The share trades at a sizeable discount to reported NAV, with the discount widening as private valuations have come under pressure.",
    tier: "Mid",
  },
  "KlaraBo Sverige B": {
    sector: "Real Estate",
    short: "Residential property owner in Swedish growth cities.",
    tier: "Small",
  },
  "Knowit": {
    sector: "Technology",
    short: "Nordic IT and design consultancy.",
    tier: "Small",
  },
  "Kvika banki": {
    sector: "Financials",
    short: "Icelandic challenger bank.",
    tier: "Small",
  },
  "Lagercrantz Group B": {
    sector: "Industrials",
    short: "Niche tech and components group.",
    long: "Lagercrantz is a decentralised acquirer of niche industrial-technology businesses — typical targets are 50–500 MSEK revenue with high recurring service mix. Structurally the model is similar to Indutrade or Lifco.",
    tier: "Mid",
  },
  "Lassila & Tikanoja": {
    sector: "Industrials",
    short: "Environmental services and industrial cleaning.",
    tier: "Small",
  },
  "Latour B": {
    sector: "Financials",
    short: "Listed investment company with industrial holdings.",
    long: "Latour is the Douglas family's listed investment company, with concentrated positions in Assa Abloy, Sweco, Securitas, Tomra and Nederman plus a wholly owned industrial portfolio (Caljan, Hultafors, Latour Industries). Trades persistently at a premium to NAV — the bet is on long-run compounding of the underlying holdings.",
    tier: "Large",
  },
  "Lime Technologies": {
    sector: "Technology",
    short: "CRM software for Nordic SMB.",
    long: "Lime is a Nordic-focused CRM SaaS vendor competing with Salesforce and HubSpot for mid-market customers. Recurring revenue mix is rising and the customer-acquisition focus on Nordic vertical-specific solutions is the differentiation pitch.",
    tier: "Small",
  },
  "Lindab International": {
    sector: "Industrials",
    short: "Ventilation systems and ductwork.",
    tier: "Small",
  },
  "Lindex Group Oyj": {
    sector: "Consumer Discretionary",
    short: "Nordic women's fashion retail.",
    tier: "Small",
  },
  "Logistea B": {
    sector: "Real Estate",
    short: "Logistics and industrial properties in Sweden.",
    tier: "Small",
  },
  "Loomis": {
    sector: "Industrials",
    short: "Cash-handling and ATM services.",
    long: "Loomis transports, processes and recirculates cash for banks and retailers — a structurally declining volume business in mature markets, but cost-out and SafePoint smart-safes (which turn the customer service from full to managed) have driven margins higher than the volume trajectory would suggest.",
    tier: "Mid",
  },
  "Lumo Kodit Oyj": {
    sector: "Real Estate",
    short: "Finnish residential rental owner.",
    tier: "Mid",
  },
  "Lundbergföretagen B": {
    sector: "Financials",
    short: "Listed family investment company.",
    long: "Lundbergs is the Lundberg family's listed investment vehicle, with controlling or large stakes in Hufvudstaden, Holmen, Industrivärden, Indutrade and Husqvarna. Capital allocation is famously conservative and the holding has compounded NAV well above the SIXRX over decades.",
    tier: "Large",
  },
  "Lundin Gold": {
    sector: "Materials",
    short: "Gold producer (Fruta del Norte, Ecuador).",
    tier: "Mid",
  },
  "Lundin Mining Corporation": {
    sector: "Materials",
    short: "Diversified base-metals miner.",
    tier: "Mid",
  },
  "Luotea Plc": {
    sector: "Financials",
    short: "Consumer-finance lender.",
    tier: "Small",
  },
  "Maha Capital": {
    sector: "Energy",
    short: "Oil and gas E&P focused on Brazil.",
    tier: "Small",
  },
  "Mandatum": {
    sector: "Financials",
    short: "Finnish wealth and life-insurance group.",
    long: "Mandatum, spun out of Sampo in 2023, runs unit-linked life insurance, group pensions and wealth management for Finnish customers. The legacy with-profit book is in run-off; the new growth engine is the unit-linked and institutional asset-management franchise.",
    tier: "Mid",
  },
  "Marimekko Oyj": {
    sector: "Consumer Discretionary",
    short: "Finnish design and lifestyle brand.",
    long: "Marimekko is a Finnish premium-lifestyle brand selling clothing, bags and home goods built around iconic prints (Unikko). The strategic focus is international expansion — Asia, especially Japan, is the standout growth market.",
    tier: "Small",
  },
  "Matas": {
    sector: "Consumer Discretionary",
    short: "Danish beauty and personal-care retailer.",
    long: "Matas is the dominant beauty and personal-care retailer in Denmark with ~270 stores plus a strong e-commerce channel. The Norwegian KICKS acquisition (2024) is the major recent strategic move, extending the platform into a fragmented Nordic peer.",
    tier: "Small",
  },
  "MedCap": {
    sector: "Health Care",
    short: "Nordic medical-device and pharma group.",
    tier: "Small",
  },
  "Medicover B": {
    sector: "Health Care",
    short: "Pan-European clinics and diagnostic labs.",
    long: "Medicover runs healthcare services (outpatient clinics, hospitals) and diagnostic services (labs, imaging) across Poland, Romania, Germany, Ukraine and India. Growth is heavily acquisition-driven; the Polish flagship business is the cash anchor.",
    tier: "Mid",
  },
  "MEKO": {
    sector: "Consumer Discretionary",
    short: "Nordic auto-parts wholesaler (Mekonomen).",
    tier: "Mid",
  },
  "Meren Energy": {
    sector: "Energy",
    short: "African-focused oil and gas (formerly Africa Oil).",
    tier: "Small",
  },
  "Metsä Board Oyj B": {
    sector: "Materials",
    short: "Premium folding boxboard and white kraftliner.",
    long: "Metsä Board makes premium folding boxboard (FBB) and white kraftliner — paper packaging substrates that benefit from substitution away from plastic and from the growth of e-commerce. The Husum mill investment is the major recent capex programme.",
    tier: "Mid",
  },
  "Mildef Group": {
    sector: "Industrials",
    short: "Rugged electronics for defence.",
    tier: "Small",
  },
  "Mips": {
    sector: "Consumer Discretionary",
    short: "Brain-protection system for helmets.",
    long: "Mips licenses its low-friction layer technology to helmet manufacturers — bike, motorcycle, ski, equestrian, construction — earning a royalty per helmet. The patent and brand-recognition position is strong in bike helmets; expansion into motorcycle and safety helmets is the new growth chapter.",
    tier: "Mid",
  },
  "Moberg Pharma": {
    sector: "Health Care",
    short: "Topical OTC pharmaceuticals.",
    tier: "Small",
  },
  "Modern Times Group B": {
    sector: "Communication Services",
    short: "Mobile-games publisher (MTG).",
    long: "MTG, after spinning off the linear-TV business (Viaplay/NENT), is now a pure mobile-games holding company with InnoGames, Hutch, Plarium (sold) and PlaySimple. The focus is on acquiring mature mobile-games studios with stable cash flows rather than chasing high-growth hits.",
    tier: "Small",
  },
  "Momentum Group B": {
    sector: "Industrials",
    short: "Industrial components and consumables.",
    tier: "Small",
  },
  "MT Højgaard Holding": {
    sector: "Industrials",
    short: "Danish construction group.",
    tier: "Small",
  },
  "Munters Group": {
    sector: "Industrials",
    short: "Climate-control solutions (data centres, food production).",
    long: "Munters makes precision climate-control systems — humidity and dehumidification, evaporative cooling, mist eliminators — sold mainly into data centres (cooling), food production and lithium-ion battery plants. AI-driven data-centre buildouts have been a notable tailwind.",
    tier: "Mid",
  },
  "Musti Group Oyj": {
    sector: "Consumer Discretionary",
    short: "Nordic pet-care retailer.",
    long: "Musti Group operates the largest specialty pet-care retail platform in the Nordics (~380 stores under Musti og Mirri, Arken Zoo, Premiere Pets) plus a sizeable e-commerce share. The category is structurally growing with pet humanisation, and pet food has the recurring-revenue characteristics investors like.",
    tier: "Mid",
  },
  "Mycronic": {
    sector: "Industrials",
    short: "Electronics-assembly equipment and mask writers for displays.",
    long: "Mycronic makes pick-and-place machines, dispensing equipment and inspection systems for PCB assembly (Assembly Solutions), plus mask writers for advanced displays (Pattern Generators). The mask-writer business is a quasi-monopoly with long order cycles and very high margins; assembly is steadier and recurring.",
    tier: "Mid",
  },
  "NCAB Group": {
    sector: "Technology",
    short: "Printed-circuit-board sourcing partner.",
    tier: "Mid",
  },
  "NCC B": {
    sector: "Industrials",
    short: "Nordic construction and infrastructure.",
    long: "NCC is one of the largest Nordic construction groups — public and private buildings, infrastructure, asphalt, aggregates. After the Bonava demerger, the focus shifted to higher-margin contracting and aggregate sales rather than property development.",
    tier: "Mid",
  },
  "Nederman Holding": {
    sector: "Industrials",
    short: "Industrial air filtration.",
    tier: "Small",
  },
  "Nelly Group": {
    sector: "Consumer Discretionary",
    short: "Online fashion retailer.",
    tier: "Small",
  },
  "Neobo Fastigheter": {
    sector: "Real Estate",
    short: "Swedish residential property owner.",
    tier: "Small",
  },
  "Net Insight B": {
    sector: "Technology",
    short: "Media networking and live-content transport.",
    tier: "Small",
  },
  "Netcompany Group": {
    sector: "Technology",
    short: "Danish digital-transformation consultancy.",
    long: "Netcompany is a Danish-founded IT services firm focused on large public-sector and financial-services digitalisation projects, with strong positions in Denmark, Norway, the UK and the Netherlands. Project-led revenue means earnings are sensitive to large contract pipelines.",
    tier: "Mid",
  },
  "Netel Holding": {
    sector: "Industrials",
    short: "Critical-infrastructure contractor (telecom, power).",
    tier: "Small",
  },
  "New Wave B": {
    sector: "Consumer Discretionary",
    short: "Brand group (Craft, Cutter & Buck, Orrefors).",
    tier: "Small",
  },
  "Nightingale Health Oyj B": {
    sector: "Health Care",
    short: "Blood-biomarker analytics for preventive health.",
    tier: "Small",
  },
  "Nilörngruppen B": {
    sector: "Consumer Discretionary",
    short: "Branding and trims for apparel.",
    tier: "Small",
  },
  "Nivika Fastigheter B": {
    sector: "Real Estate",
    short: "Residential and commercial property in southern Sweden.",
    tier: "Small",
  },
  "NNIT": {
    sector: "Technology",
    short: "Danish IT services for life sciences.",
    tier: "Small",
  },
  "NOBA Bank Group": {
    sector: "Financials",
    short: "Nordic consumer-finance bank.",
    tier: "Small",
  },
  "Nobia": {
    sector: "Consumer Discretionary",
    short: "Kitchen-cabinet manufacturer.",
    tier: "Small",
  },
  "Nokian Renkaat Oyj": {
    sector: "Consumer Discretionary",
    short: "Finnish winter and all-season tyre maker.",
    long: "Nokian Tyres makes premium winter and all-season tyres, historically with a strong position in Russia, which was divested after the 2022 invasion of Ukraine. The new Romanian factory and US Dayton plant are being scaled to replace lost capacity; the equity is essentially a multi-year turnaround.",
    tier: "Mid",
  },
  "Nolato B": {
    sector: "Materials",
    short: "Polymer products for medical and industrial use.",
    long: "Nolato makes precision polymer components and devices for medical, automotive and consumer-electronics customers. The Medical Solutions segment (drug-delivery, single-use devices, IVD) is the growth and margin engine.",
    tier: "Mid",
  },
  "Nordnet": {
    sector: "Financials",
    short: "Pan-Nordic online savings and brokerage bank.",
    long: "Nordnet is the second-largest Nordic online savings platform after Avanza, with operations in Sweden, Norway, Denmark and Finland. Earnings drivers mirror Avanza's: customer cash balances on the balance sheet (NII) plus brokerage and fund commissions tied to market activity.",
    tier: "Mid",
  },
  "Norion Bank": {
    sector: "Financials",
    short: "Swedish corporate and consumer bank.",
    tier: "Small",
  },
  "North Media": {
    sector: "Communication Services",
    short: "Danish distribution and digital marketplaces.",
    tier: "Small",
  },
  "NOTE": {
    sector: "Industrials",
    short: "Electronics manufacturing services.",
    tier: "Small",
  },
  "Nova Klúbburinn": {
    sector: "Communication Services",
    short: "Icelandic telecom (mobile, broadband).",
    tier: "Small",
  },
  "NP3 Fastigheter": {
    sector: "Real Estate",
    short: "Commercial-property owner in northern Sweden.",
    tier: "Small",
  },
  "NTG Nordic Transport Group": {
    sector: "Industrials",
    short: "Asset-light freight forwarder.",
    tier: "Small",
  },
  "Oculis Holding": {
    sector: "Health Care",
    short: "Ophthalmology biopharma.",
    tier: "Small",
  },
  "OEM International B": {
    sector: "Industrials",
    short: "Trading of industrial components.",
    tier: "Small",
  },
  "Olvi Oyj A": {
    sector: "Consumer Staples",
    short: "Finnish brewery group (beer, soft drinks).",
    tier: "Small",
  },
  "Oma Säästöpankki Oyj": {
    sector: "Financials",
    short: "Finnish regional savings bank.",
    tier: "Small",
  },
  "Oncopeptides": {
    sector: "Health Care",
    short: "Cancer drug development (multiple myeloma).",
    tier: "Small",
  },
  "Optomed Oyj": {
    sector: "Health Care",
    short: "Handheld ophthalmic imaging devices.",
    tier: "Small",
  },
  "Oriola Oyj": {
    sector: "Health Care",
    short: "Pharmaceutical distribution in Finland and Sweden.",
    tier: "Small",
  },
  "Orrön Energy": {
    sector: "Utilities",
    short: "Listed renewable-energy producer (wind).",
    tier: "Small",
  },
  "Outokumpu Oyj": {
    sector: "Materials",
    short: "Stainless steel producer.",
    long: "Outokumpu is Europe's largest stainless-steel producer with major mills in Finland (Tornio), Germany and the US. Earnings are highly cyclical, tied to stainless prices, nickel and ferrochrome — though the captive Kemi chromite mine is a significant structural cost advantage.",
    tier: "Mid",
  },
  "Ovzon": {
    sector: "Communication Services",
    short: "Satellite-based mobile broadband for defence.",
    tier: "Small",
  },
  "Pandox B": {
    sector: "Real Estate",
    short: "Owner and operator of hotel properties.",
    long: "Pandox owns ~160 large hotel properties across Europe and Canada, mostly let to operating partners on revenue-based lease structures plus a smaller portfolio operated in-house. The lease structures give upside in upcycles but bring more volatility than a flat-rent commercial REIT.",
    tier: "Mid",
  },
  "Peab B": {
    sector: "Industrials",
    short: "Nordic construction and civil engineering.",
    tier: "Mid",
  },
  "Per Aarsleff Holding B": {
    sector: "Industrials",
    short: "Danish ground-works and civil-engineering contractor.",
    tier: "Mid",
  },
  "Pierce Group": {
    sector: "Consumer Discretionary",
    short: "Online motorcycle-gear retailer.",
    tier: "Small",
  },
  "Pihlajalinna Oyj": {
    sector: "Health Care",
    short: "Finnish private healthcare operator.",
    tier: "Small",
  },
  "Platzer Fastigheter Holding B": {
    sector: "Real Estate",
    short: "Gothenburg commercial property.",
    tier: "Mid",
  },
  "Ponsse Oyj 1": {
    sector: "Industrials",
    short: "Cut-to-length forestry machines.",
    long: "Ponsse is one of the global majors in cut-to-length forestry machines (harvesters and forwarders), alongside John Deere and Komatsu. The customer base — independent logging contractors — is fragmented, but the brand is dominant in Finland and growing in North and South America.",
    tier: "Small",
  },
  "Posti Group": {
    sector: "Industrials",
    short: "Finnish postal and logistics operator.",
    tier: "Small",
  },
  "PowerCell Sweden": {
    sector: "Industrials",
    short: "Hydrogen fuel-cell systems.",
    tier: "Small",
  },
  "Precise Biometrics": {
    sector: "Technology",
    short: "Mobile biometric software.",
    tier: "Small",
  },
  "Prevas B": {
    sector: "Technology",
    short: "Industrial digitalisation consultancy.",
    tier: "Small",
  },
  "Pricer B": {
    sector: "Technology",
    short: "Electronic shelf-label systems for retail.",
    long: "Pricer makes electronic shelf labels for grocery and other retailers — competing with VusionGroup (formerly SES-Imagotag) in a duopolistic structure. Retailers adopt ESLs to enable dynamic pricing and cut staff cost in changing labels.",
    tier: "Small",
  },
  "Prisma Properties": {
    sector: "Real Estate",
    short: "Retail-property owner in Sweden.",
    tier: "Small",
  },
  "Proact IT Group": {
    sector: "Technology",
    short: "Nordic IT-infrastructure services.",
    tier: "Small",
  },
  "Puuilo Oyj": {
    sector: "Consumer Discretionary",
    short: "Finnish discount hardware retailer.",
    long: "Puuilo is a fast-growing Finnish hard-discount retailer for hardware, tools, home and outdoor products — think Action or B&M for the Nordic market. Store rollout has been rapid and SSSG has held up well through the consumer downturn.",
    tier: "Small",
  },
  "Q-Linea": {
    sector: "Health Care",
    short: "Rapid microbiology diagnostics.",
    tier: "Small",
  },
  "Qt Group Oyj": {
    sector: "Technology",
    short: "Cross-platform application development software.",
    long: "Qt sells cross-platform development frameworks and tooling used by manufacturers to build the software-side of physical products (medical devices, automotive infotainment, industrial HMIs). The licensing model is a mix of distribution licenses (per-device) and developer seats.",
    tier: "Mid",
  },
  "Raisio Oyj Vaihto-osake": {
    sector: "Consumer Staples",
    short: "Finnish plant-based foods (Benecol).",
    tier: "Small",
  },
  "Ratos B": {
    sector: "Financials",
    short: "Listed investment company (Nordic mid-cap).",
    tier: "Mid",
  },
  "RaySearch Laboratories B": {
    sector: "Health Care",
    short: "Treatment-planning software for radiation therapy.",
    long: "RaySearch makes treatment-planning software (RayStation) used by hospitals to plan radiation-therapy doses, with a growing OIS (oncology information system) product (RayCare). The software is integrated with Elekta, Varian, IBA and other vendor hardware and competes mainly with Varian Eclipse and Elekta Monaco.",
    tier: "Small",
  },
  "Reitir fasteignafélag": {
    sector: "Real Estate",
    short: "Icelandic commercial-property owner.",
    tier: "Small",
  },
  "Rejlers B": {
    sector: "Industrials",
    short: "Nordic engineering consultancy.",
    tier: "Small",
  },
  "Relais Group Oyj": {
    sector: "Consumer Discretionary",
    short: "Heavy-vehicle aftermarket parts.",
    tier: "Small",
  },
  "Remedy Entertainment Oyj": {
    sector: "Communication Services",
    short: "AAA game studio (Control, Alan Wake).",
    long: "Remedy is a Finnish AAA-game developer behind Max Payne, Alan Wake, Control and the upcoming FBC: Firebreak. Most projects are publisher-funded (Epic, 505 Games), which limits upfront risk but caps royalty upside.",
    tier: "Small",
  },
  "Revenio Group Oyj": {
    sector: "Health Care",
    short: "Glaucoma screening devices.",
    long: "Revenio makes Icare, the leading non-contact rebound tonometer for glaucoma screening — the largest installed base of its kind globally. Sales grow on penetration in primary-care ophthalmology where traditional Goldmann tonometers are impractical.",
    tier: "Small",
  },
  "Royal UNIBREW": {
    sector: "Consumer Staples",
    short: "Danish brewer (Faxe Kondi, Royal).",
    long: "Royal Unibrew is Denmark's #2 brewer behind Carlsberg, with beer, soft drinks and mineral water brands across Denmark, Finland and the Baltics plus a growing position in Italy (Lurisia, Crodino) after the Solera acquisitions. Soft drinks and energy drinks are the higher-margin growth piece.",
    tier: "Large",
  },
  "Rusta": {
    sector: "Consumer Discretionary",
    short: "Nordic value retailer of home and leisure goods.",
    long: "Rusta is a Swedish discount-variety retailer (~210 stores in Sweden, Norway, Finland, Germany) selling home, garden, seasonal and toy goods at low ticket prices. The category is structurally taking share from traditional retailers in a soft-consumer environment.",
    tier: "Small",
  },
  "RVRC Holding": {
    sector: "Consumer Discretionary",
    short: "Direct-to-consumer outdoor brand (Revolution Race).",
    long: "Revolution Race (RVRC) sells outdoor clothing direct-to-consumer online, with a brand mix that competes more on price and styling than on technical specs. Inventory turns and DTC margins are above peers; the question is brand longevity once early-adopter customer cohorts mature.",
    tier: "Small",
  },
  "Röko B": {
    sector: "Financials",
    short: "Acquirer of niche profitable Nordic businesses.",
    long: "Röko is Fredrik Karlsson and Tomas Billing's Indutrade-style serial acquirer of niche, profitable, founder-led Nordic businesses across business services and industrial niches. Capital-allocation track record at Lifco/Indutrade is the implicit investor reference point.",
    tier: "Mid",
  },
  "Samhällsbyggnadsbo. i Norden B": {
    sector: "Real Estate",
    short: "Owner of community-service properties (SBB).",
    long: "SBB owns community-service properties — schools, elderly-care homes, social-care facilities — across the Nordics, plus a residential portfolio. The high leverage and 2023 funding crisis make this a balance-sheet recovery story rather than a steady-state property compounder.",
    tier: "Mid",
  },
  "Saniona": {
    sector: "Health Care",
    short: "Rare-disease drug developer.",
    tier: "Small",
  },
  "Sanoma Oyj": {
    sector: "Communication Services",
    short: "Finnish learning and media group.",
    long: "Sanoma is split between Learning (K-12 textbook and digital learning across Europe) and Media Finland (Helsingin Sanomat, Nelonen, Ruutu). Learning is the focus area on stability and structural growth; Media Finland is the cash-cow legacy.",
    tier: "Small",
  },
  "Scandi Standard": {
    sector: "Consumer Staples",
    short: "Nordic chicken-meat producer.",
    tier: "Small",
  },
  "Scandic Hotels Group": {
    sector: "Consumer Discretionary",
    short: "Nordic hotel operator.",
    long: "Scandic is the largest Nordic hotel chain by rooms, mostly running properties under management or franchise rather than owning real estate. Earnings are highly sensitive to corporate/MICE demand and tourism flows.",
    tier: "Mid",
  },
  "Scandinavian Tobacco Group": {
    sector: "Consumer Staples",
    short: "Cigars, pipe tobacco and accessories.",
    tier: "Small",
  },
  "Scanfil Oyj": {
    sector: "Industrials",
    short: "Electronics contract manufacturer.",
    tier: "Small",
  },
  "Schouw & Co.": {
    sector: "Industrials",
    short: "Danish industrial conglomerate (BioMar, GPV).",
    long: "Schouw is a Danish industrial holding with six wholly owned businesses: BioMar (fish feed, the largest), GPV (electronics manufacturing), HydraSpecma (hydraulics), Borg Automotive (remanufactured auto parts), Fibertex Personal Care and Fibertex Nonwovens. Capital allocation is conservative and long-term oriented.",
    tier: "Mid",
  },
  "Sdiptech B": {
    sector: "Industrials",
    short: "Niche infrastructure-tech group.",
    tier: "Small",
  },
  "SECTRA B": {
    sector: "Health Care",
    short: "Medical imaging IT and cybersecurity.",
    long: "Sectra is the global #1 in PACS (Picture Archiving and Communication Systems) for radiology in the US and a leading player in Europe — large hospital systems use Sectra's enterprise-imaging platform for radiology, pathology and other image-producing departments. A smaller but high-margin Secure Communications business serves defence customers.",
    tier: "Mid",
  },
  "Sedana Medical": {
    sector: "Health Care",
    short: "Inhaled sedation for ICU patients.",
    tier: "Small",
  },
  "Senzime": {
    sector: "Health Care",
    short: "Patient-monitoring devices.",
    tier: "Small",
  },
  "Sinch": {
    sector: "Communication Services",
    short: "Cloud messaging and customer-engagement APIs.",
    long: "Sinch sells SMS, RCS, voice and email APIs to enterprises that need to communicate with their customers — CPaaS, competing with Twilio. The roll-up from 2020–22 saddled the group with significant goodwill and debt; the recent focus has been on margin expansion and de-leveraging.",
    tier: "Mid",
  },
  "Sivers Semiconductors": {
    sector: "Technology",
    short: "RF and photonics chips (5G, satellite).",
    tier: "Small",
  },
  "SJF Bank": {
    sector: "Financials",
    short: "Danish savings bank.",
    tier: "Small",
  },
  "Sjóvá-Almennar tryggingar": {
    sector: "Financials",
    short: "Icelandic non-life insurer.",
    tier: "Small",
  },
  "Skagi": {
    sector: "Financials",
    short: "Icelandic insurance and asset management.",
    tier: "Small",
  },
  "Skel fjárfestingafélag": {
    sector: "Financials",
    short: "Icelandic investment company.",
    tier: "Small",
  },
  "SkiStar B": {
    sector: "Consumer Discretionary",
    short: "Operator of Nordic alpine ski resorts.",
    long: "SkiStar operates Sälen, Åre, Vemdalen, Hammarbybacken and partly Trysil — the dominant Nordic ski-resort operator. Snow conditions in the Alps and the willingness of Nordic households to take winter holidays drive the year.",
    tier: "Small",
  },
  "Skjern Bank": {
    sector: "Financials",
    short: "Danish regional bank.",
    tier: "Small",
  },
  "Sleep Cycle": {
    sector: "Health Care",
    short: "Sleep-tracking app subscription.",
    tier: "Small",
  },
  "Solar B": {
    sector: "Industrials",
    short: "Distributor of electrical, plumbing and HVAC products.",
    tier: "Small",
  },
  "Solid Försäkringsaktiebolag": {
    sector: "Financials",
    short: "Swedish niche insurer.",
    tier: "Small",
  },
  "SP Group": {
    sector: "Materials",
    short: "Plastic-product manufacturer.",
    tier: "Small",
  },
  "SSH Communications Security": {
    sector: "Technology",
    short: "Encrypted connectivity and PAM software.",
    tier: "Small",
  },
  "Stendörren Fastigheter B": {
    sector: "Real Estate",
    short: "Light-industrial property owner.",
    tier: "Small",
  },
  "Stenhus Fastigheter i Norden": {
    sector: "Real Estate",
    short: "Mixed-use property owner in Sweden.",
    tier: "Small",
  },
  "Stillfront Group": {
    sector: "Communication Services",
    short: "Free-to-play mobile and browser games publisher.",
    tier: "Small",
  },
  "Storskogen Group B": {
    sector: "Industrials",
    short: "Diversified acquirer of small-and-medium Nordic businesses.",
    long: "Storskogen is a serial acquirer with ~115 holdings across services, industrial and trade, structured as a long-term compounder rather than a PE-style flipper. The post-IPO leverage and pace of acquisitions overshot, and the more recent focus is on de-leveraging and consolidating the existing portfolio.",
    tier: "Mid",
  },
  "Studsvik": {
    sector: "Industrials",
    short: "Nuclear-fuel and waste-management services.",
    tier: "Small",
  },
  "Sveafastigheter": {
    sector: "Real Estate",
    short: "Swedish residential developer/owner.",
    tier: "Small",
  },
  "Svedbergs Group B": {
    sector: "Consumer Discretionary",
    short: "Bathroom-furniture maker.",
    tier: "Small",
  },
  "SWECO B": {
    sector: "Industrials",
    short: "Engineering and architecture consultancy.",
    long: "Sweco is the largest engineering and architecture consultancy in Europe by headcount (~22,000), with strong positions in the Nordics, Belgium and the UK. Project mix is heavily skewed toward public-sector infrastructure and energy-transition work.",
    tier: "Large",
  },
  "Swedish Logistic Property B": {
    sector: "Real Estate",
    short: "Logistics-property owner in Sweden.",
    tier: "Small",
  },
  "SynAct Pharma": {
    sector: "Health Care",
    short: "Inflammation-focused biopharma.",
    tier: "Small",
  },
  "Synsam": {
    sector: "Consumer Discretionary",
    short: "Nordic optical retailer.",
    long: "Synsam operates ~500 optical-retail stores across the Nordics with a notable shift to a subscription-based pricing model. The subscription approach (Lifestyle programme) is recurring-revenue heavy and has been the structural growth driver.",
    tier: "Small",
  },
  "Systemair": {
    sector: "Industrials",
    short: "Ventilation products.",
    tier: "Mid",
  },
  "Síldarvinnslan": {
    sector: "Consumer Staples",
    short: "Icelandic pelagic-fish processor.",
    tier: "Small",
  },
  "Síminn": {
    sector: "Communication Services",
    short: "Icelandic telecom operator.",
    tier: "Small",
  },
  "Sýn": {
    sector: "Communication Services",
    short: "Icelandic telecom and media (Vodafone Iceland).",
    tier: "Small",
  },
  "Taaleri Oyj": {
    sector: "Financials",
    short: "Finnish alternative-asset manager.",
    tier: "Small",
  },
  "Talenom Oyj": {
    sector: "Industrials",
    short: "Accounting services for SMB.",
    long: "Talenom provides outsourced accounting services to Finnish (and increasingly Swedish, Spanish, Italian) small-and-medium businesses, with a proprietary digital platform. The model is recurring fees and SMB customers are sticky.",
    tier: "Small",
  },
  "Terveystalo Oyj": {
    sector: "Health Care",
    short: "Finnish private healthcare provider.",
    long: "Terveystalo is Finland's largest private healthcare provider — primary care, occupational health, specialists, dental, diagnostic services — across ~340 clinics. The occupational-health channel (employer-paid) is the cash anchor.",
    tier: "Mid",
  },
  "Thule Group": {
    sector: "Consumer Discretionary",
    short: "Roof racks, bike carriers and outdoor gear.",
    long: "Thule makes roof racks, bike carriers, child strollers and outdoor gear — the bike-carrier and stroller categories saw a post-pandemic boom-and-bust; underlying brand strength remains intact in mature markets.",
    tier: "Mid",
  },
  "Tieto Oyj": {
    sector: "Technology",
    short: "Nordic IT services (TietoEvry).",
    long: "TietoEvry is the largest Nordic IT services company, formed by the 2019 merger of Tieto (Finland) and Evry (Norway). Banking and public sector are the dominant verticals, with a multi-year strategy of carving the group into four more focused units.",
    tier: "Mid",
  },
  "Tobii": {
    sector: "Technology",
    short: "Eye-tracking hardware and software.",
    tier: "Small",
  },
  "Tokmanni Group Oyj": {
    sector: "Consumer Discretionary",
    short: "Finnish discount variety retailer.",
    long: "Tokmanni is the largest discount-variety retailer in Finland (~190 stores) with a recent expansion into Sweden, Norway and Denmark via the acquisition of Dollarstore. The category structurally benefits from cost-of-living pressure.",
    tier: "Small",
  },
  "TORM A": {
    sector: "Energy",
    short: "Product-tanker shipping.",
    long: "TORM is one of the largest pure-play product-tanker operators — clean petroleum products, diesel, jet, gasoline. The freight-rate cycle for LR/MR product tankers has been historically strong since the 2022 sanctions-driven dislocations.",
    tier: "Mid",
  },
  "Transtema Group": {
    sector: "Industrials",
    short: "Communications-infrastructure contractor.",
    tier: "Small",
  },
  "TRATON": {
    sector: "Industrials",
    short: "Heavy commercial vehicles (Scania, MAN, Navistar).",
    long: "TRATON is the truck and bus division of Volkswagen Group, with Scania (premium), MAN (volume), Navistar (US) and Volkswagen Truck & Bus (Brazil) under one roof. Synergies across the four brands and the transition to electric and autonomous trucks are the strategic agenda.",
    tier: "Large",
  },
  "Trianon B": {
    sector: "Real Estate",
    short: "Residential and commercial property in Malmö.",
    tier: "Small",
  },
  "Trifork Group": {
    sector: "Technology",
    short: "Software-development house.",
    tier: "Small",
  },
  "Troax Group": {
    sector: "Industrials",
    short: "Mesh-panel safety enclosures.",
    long: "Troax is the global market leader in mesh-panel safety fencing for industrial guarding, automated warehouses and property protection. The growth driver is automation in logistics and manufacturing, where robot cells need safety enclosures.",
    tier: "Mid",
  },
  "Truecaller B": {
    sector: "Technology",
    short: "Caller-identification app.",
    long: "Truecaller's caller-ID and spam-blocking app is dominant in India and a handful of other emerging markets, monetised mostly via ads with a smaller premium subscription. India regulatory risk and ad-market sensitivity are the chronic overhangs.",
    tier: "Small",
  },
  "UIE Plc": {
    sector: "Consumer Staples",
    short: "Listed investment holding (palm-oil and food assets).",
    tier: "Small",
  },
  "Vaisala Oyj A": {
    sector: "Industrials",
    short: "Weather and environmental measurement instruments.",
    long: "Vaisala makes instruments for weather observation, industrial measurement (humidity, CO2, dew point) and lightning detection — sold to meteorological agencies, airports, pharma and EV-battery plants. The Industrial Measurements segment is the structurally growing piece.",
    tier: "Mid",
  },
  "VBG GROUP B": {
    sector: "Industrials",
    short: "Truck equipment and air-treatment industrial group.",
    tier: "Small",
  },
  "Verkkokauppa.com Oyj": {
    sector: "Consumer Discretionary",
    short: "Finnish online electronics retailer.",
    tier: "Small",
  },
  "Vestum": {
    sector: "Industrials",
    short: "Infrastructure services group (water, civil works).",
    tier: "Small",
  },
  "Viaplay Group B": {
    sector: "Communication Services",
    short: "Nordic streaming and broadcasting (NENT).",
    long: "Viaplay runs the Nordic streaming service plus linear TV channels (TV3 and others) — the international streaming expansion was unwound after the 2023 funding crisis. The recent recapitalisation has stabilised the balance sheet; the equity is essentially a Nordic-only restructured streaming-plus-broadcast asset.",
    tier: "Small",
  },
  "Vicore Pharma Holding": {
    sector: "Health Care",
    short: "Rare-lung-disease biotech.",
    tier: "Small",
  },
  "Vimian Group": {
    sector: "Health Care",
    short: "Global animal-health products.",
    long: "Vimian, spun out of Nordic Capital, is a global animal-health platform with four segments — Specialty Pharma, MedTech (veterinary devices), Veterinary Services and Diagnostics. The Bure-style serial-acquirer model is the long-term thesis.",
    tier: "Mid",
  },
  "Vitec Software Group B": {
    sector: "Technology",
    short: "Vertical-market software acquirer.",
    long: "Vitec acquires vertical-market software companies (real-estate management, school administration, energy retailers, healthcare scheduling) and runs them decentrally for cash. The model is Constellation-Software-like: small acquisitions, high IRRs, very long hold.",
    tier: "Mid",
  },
  "Vitrolife": {
    sector: "Health Care",
    short: "IVF media and devices.",
    long: "Vitrolife is the global #2 in IVF consumables (media, disposables) and devices (incubators, time-lapse) after CooperSurgical, plus a meaningful genetic-testing business (PGT-A) via Igenomix. Demand is driven by structural rise of IVF cycles globally.",
    tier: "Mid",
  },
  "VNV Global": {
    sector: "Financials",
    short: "Listed venture-capital investor.",
    tier: "Small",
  },
  "Volati": {
    sector: "Industrials",
    short: "Nordic industrial acquirer.",
    tier: "Small",
  },
  "Volvo Car B": {
    sector: "Consumer Discretionary",
    short: "Premium and electric carmaker.",
    long: "Volvo Cars, majority-owned by Geely, sells premium SUVs and sedans with an increasing focus on full-electric models (EX30, EX90). The relationship with Polestar (sister brand) and Geely (parent) is both an advantage on the cost side and a complication for investors valuing the equity.",
    tier: "Large",
  },
  "Wallenstam B": {
    sector: "Real Estate",
    short: "Residential and commercial property in Gothenburg/Stockholm.",
    tier: "Mid",
  },
  "Wihlborgs Fastigheter": {
    sector: "Real Estate",
    short: "Property owner in the Öresund region.",
    long: "Wihlborgs is the dominant commercial-property owner in Malmö and Helsingborg, with smaller positions in Copenhagen and Lund. The Öresund-region focus has historically given above-average rental growth.",
    tier: "Mid",
  },
  "Xbrane Biopharma": {
    sector: "Health Care",
    short: "Biosimilars developer.",
    tier: "Small",
  },
  "Xspray Pharma": {
    sector: "Health Care",
    short: "Cancer-drug reformulation specialist.",
    tier: "Small",
  },
  "Xvivo Perfusion": {
    sector: "Health Care",
    short: "Organ-preservation devices for transplantation.",
    long: "Xvivo makes machines and perfusion solutions that keep donor organs (lung, heart, liver, kidney) viable longer outside the body — extending the donor pool and the transplant window. Sales mix is razor/blade between machines and recurring perfusion-fluid consumables.",
    tier: "Small",
  },
  "YIT Oyj": {
    sector: "Industrials",
    short: "Finnish construction (residential, infrastructure).",
    tier: "Small",
  },
  "Yubico": {
    sector: "Technology",
    short: "Hardware security keys (YubiKey).",
    long: "Yubico makes YubiKey hardware-security tokens used for phishing-resistant multi-factor authentication, with a customer base concentrated in enterprises, governments and consumer-facing platforms (Google, Microsoft, Cloudflare). The FIDO2/passkey adoption curve is the long-term growth driver.",
    tier: "Small",
  },
  "Ísfélag": {
    sector: "Consumer Staples",
    short: "Icelandic seafood processor.",
    tier: "Small",
  },
  "Íslandsbanki": {
    sector: "Financials",
    short: "Icelandic universal bank.",
    long: "Íslandsbanki is one of three Icelandic systemic banks, with retail, corporate and asset-management arms. Re-privatisation by the Icelandic state has been the multi-year overhang on the share register.",
    tier: "Small",
  },
  "Öresund": {
    sector: "Financials",
    short: "Listed Swedish investment company.",
    long: "Investment AB Öresund is a Swedish listed investment company chaired by Mats Qviberg, with concentrated holdings across Nordic mid-caps. The portfolio is materially more concentrated and active than Lundbergs or Industrivärden.",
    tier: "Mid",
  },
};

// Keyword-based inference for the long tail.
function inferSector(name) {
  const n = name.toLowerCase();
  if (/(pharma|bio|therapeut|medical|medic|health|biotech|pharm)/.test(n)) return "Health Care";
  if (/(bank|banki|pankki)/.test(n)) return "Financials";
  if (/(fastighet|properties|property|real estate|fasteign|kodit)/.test(n)) return "Real Estate";
  if (/(software|tech|technologies|telecom|cyber)/.test(n)) return "Technology";
  if (/(media|games|gaming|entertainment|tv|press)/.test(n)) return "Communication Services";
  if (/(retail|fashion|brand|shop|store|cars?|auto)/.test(n)) return "Consumer Discretionary";
  if (/(food|brewer|seafood|fisk|fish|tobacco|cloetta|olvi)/.test(n)) return "Consumer Staples";
  if (/(industri|industrial|construction|building|engineer|logistics|transport|shipping)/.test(n)) return "Industrials";
  if (/(energy|oil|gas|wind|solar)/.test(n)) return "Energy";
  if (/(materials|mining|steel|paper|chem|aluminium|gold|copper)/.test(n)) return "Materials";
  if (/(insur|capital|equity|invest|holding|fond)/.test(n)) return "Financials";
  return "Other";
}

let withOverride = 0;
let withLong = 0;
let withTier = 0;
let withInference = 0;
for (const s of stocks) {
  const entry = overrides[s.name];
  if (entry) {
    s.sector = entry.sector;
    s.description = entry.short;
    s.long = entry.long ?? null;
    s.tier = entry.tier ?? null;
    s.multiples = entry.multiples ?? { ...EMPTY_MULTIPLES };
    withOverride++;
    if (entry.long) withLong++;
    if (entry.tier) withTier++;
  } else {
    s.sector = inferSector(s.name);
    s.description = `Nordic listed company on ${s.exchange || s.country}. Trades in ${s.ccy}. Sector inferred from name; verify on the company's investor-relations site.`;
    s.long = null;
    s.tier = null;
    s.multiples = { ...EMPTY_MULTIPLES };
    withInference++;
  }
}

fs.writeFileSync(file, JSON.stringify(stocks, null, 2) + "\n");
console.log(
  `Enriched ${stocks.length} stocks: ${withOverride} curated (${withLong} long, ${withTier} tiered), ${withInference} keyword-inferred.`,
);

const bySector = stocks.reduce((acc, s) => {
  acc[s.sector] = (acc[s.sector] || 0) + 1;
  return acc;
}, {});
console.log("By sector:", bySector);
