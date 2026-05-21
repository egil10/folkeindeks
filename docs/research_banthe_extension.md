# From BANTHE to VINX: Extending Index-Effect Machine Learning to Statens fond i Tromsø

## 1. The index effect in BANTHE and the academic literature

BANTHE (Jordåen & Furnes, NHH 2023) defines the *index effect* as the systematic price drift of stocks added to, or deleted from, a benchmark index in the window leading up to the effective date (ED). Empirically (Figure 1.1 of the thesis), OSEBX additions rise roughly 10 percent from -100 trading days to ED, and deletions fall around 60 percent over the same window, with an abnormal-return peak the day before ED. The phenomenon was first documented by Shleifer (1986) on the S&P 500 ("the S&P phenomenon") and later by Lynch & Mendenhall (1997). BANTHE follows Afego (2017) in splitting the candidate explanations into two families:

- *Demand-based*: price pressure (temporary, mean-reverting) and imperfect substitutes (permanent shift in the demand curve).
- *Information-based*: information hypothesis, liquidity hypothesis, awareness hypothesis, and selection-criteria (certification) hypothesis.

BANTHE explicitly invokes Shleifer (1986), Afego (2017), Lynch & Mendenhall (1997), Jain (1987), Kasch & Sarkar (2012), Peterson (2021), Elton/Gruber/de Souza (2022), Ang, Brandt & Denison (2014, NBIM), and the Norwegian master theses of Mæhle & Sandberg (2015) and Melingen & Brennmoen (2018). Chen/Noronha/Singal (2004) is not cited by name, but the *imperfect substitute* framing the thesis uses is essentially their result.

## 2. Methodology

**Universe and labels.** Sample: OSEAX constituents from January 2006 to March 2023, yielding ~5,900 firm-rebalancing observations across 22 OSEBX rebalances. Target `index_cp` is binary: 1 if the firm is on OSEBX in the *next* period, 0 otherwise.

**Features.** Deliberately minimal — only the four variables Euronext itself uses in the OSEBX rule book, plus lagged labels:
- `trading_status` (share of days traded),
- `turnover_eob` (12m turnover excluding 12 highest-turnover days),
- `free_float` (free-float market cap),
- `icb_supersector` (ICB industry),
- `index_lag1…lag4` (membership in the prior 1–4 periods).

This rule-book-only feature set is a strength: the model is interpretable and replication-friendly, but it deliberately leaves alpha on the table (no momentum, no analyst expectations, no fundamentals).

**Models.** Logistic regression via R `glm()` and gradient-boosted trees via `xgboost`. Three horizons per model — 30, 60, 100 trading days ahead of ED. A *conditional posterior-probability threshold* (PPT) is the methodological novelty: θ\* = θ ± ε conditioned on `index_lag1`, where θ = 0.6 and ε = 0.2 for the XGBC variant. This breaks the model's tendency to "predict the lag" by raising the bar for staying in and lowering the bar for entering.

**Validation.** Expanding-window time-series cross-validation (Bergmeir & Benitez 2012) — train on all rebalances prior to t, predict t. This is the right choice for a non-stationary financial label and is far stronger than naive K-fold.

**Backtest.** 2010-02-28 to 2023-03-17, 26 OSEBX rebalances. Long the predicted additions and short the predicted deletions from the prediction date to ED; outside the active window the portfolio holds OSEBX. Prices are VWAP from DataStream/Refinitiv. Costs: 4 bps per leg, 4 percent annual short-borrow, risk-free rate ≈ 1.46 percent annual. Risk-adjusted with CAPM and the Norwegian Fama–French 3-factor data of Ødegaard (2023).

## 3. Empirical findings on OSEBX

**Magnitude.** The cumulative drift before ED is large (around 60 percent for deletions, 10 percent for additions on the -100 to 0 window) and there is a partial reversal post-ED, consistent with a blend of price-pressure and substitute effects.

**Classification.** Even a naive "predict lag" model gives 95.07 percent accuracy because OSEBX membership is sticky. The ML models trade a hair of accuracy (94–95 percent) for the ability to flag *changes*, which is what is needed to trade. GLM30 achieves 94.82 percent accuracy with 93 flagged changes; XGBC30 (custom-threshold XGBoost) drops to 92.60 percent but flags 271 changes. AUROC ≈ 0.98 across the board.

**P&L.**
- *Long-short active strategy* (held only in the 30/60/100-day window around each ED, otherwise OSEBX). The strongest portfolios — GLM30, GLM60, GLM100, and XGBC30 — show statistically significant FF3 alpha at the 5 percent level. Monthly excess return over OSEBX of ~0.34 percent (GLM30) to ~0.95 percent (GLM60), i.e. 4–11.4 percent annualised. GLM60/100 are highly volatile (1–6 names in the active window); XGBC30 is the standout because it carries ~25 names and still produces statistically significant alpha with beta close to 1.
- *Enhanced index portfolio*: when the active sleeve is constrained to a 2 percent annual TE budget, only **XGBC30** retains a significant FF3 alpha (p < 0.1) — about 0.06 percent monthly (~0.72 percent annual). GLM portfolios collapse because their tiny number of trades forces an active share of just 2.8–4.1 percent.

**Key insight.** Accuracy and exploitability are *anti-correlated*. The most accurate classifier is one that predicts nothing changes — and so trades nothing. This trade-off is the methodological contribution.

## 4. Stated limitations and further-research suggestions

The authors flag:
1. Missing VWAPs in 2010–2011 forced dropped predictions.
2. FF3 factors are reported on OSE, not OSEBX, introducing benchmark mismatch in the regressions.
3. No hyperparameter tuning on XGBoost, no probability-weighted position sizing.
4. ε in conditional PPT was not optimised.
5. Only three risk factors; no Carhart momentum, no Pástor–Stambaugh liquidity, no Q-factor.
6. The biggest open question: *is the OSEBX index effect a persistent inefficiency or a regime that decays as enhanced-index AUM grows*? They suggest testing on indices that differ in size, maturity, and passive-AUM penetration.

## 5. Extension to VINX Small Cap EUR NI / Statens fond i Tromsø

### 5.1 What the SFT mandate actually says

The Investeringsmandat for SFT (Folketrygdfondet, 12.12.2024) makes three constraints binding for any BANTHE-style strategy:
- **Reference index = VINX Small Cap (tax-adjusted) less SPN constituents.** This is a Nordic small-cap universe (Norway, Sweden, Denmark, Finland, Iceland) with quarterly reviews and roughly ~390 constituents — far larger and more heterogeneous than OSEBX.
- **Ex-ante relative volatility ≤ 5 pp** (vs. BANTHE's 2 percent TE constraint) — gives substantially more room for an enhanced strategy.
- **No short-selling** (§2-3, item 9) and ≤ 5 percent ownership per name. This *kills the long-short variant directly* and forces the strategy into either long-only-active or enhanced-index framings only.

This last point is non-trivial: in BANTHE the long-only variants generally do *not* keep their FF3 alpha. The Tromsø setting therefore requires re-thinking how the deletion signal is monetised — most naturally by *underweighting* predicted deletions versus the benchmark weight rather than shorting them.

### 5.2 Does the literature predict a stronger or weaker effect on Nordic small caps?

The price-pressure and imperfect-substitute hypotheses both predict *larger* index effects where (a) free float is lower, (b) idiosyncratic volatility is higher, and (c) the rebalanced index is small enough that a single passive AUM tranche moves the order book. All three favour Nordic small caps over the S&P 500 or even OSEBX. Empirically, Biktimirov & Li (2014) on FTSE SmallCap and Chen et al. (2004) on the Russell 2000 reconstitution both report announcement-day abnormal returns of 3–7 percent on additions — multiples of the 1–2 percent typically reported for the S&P 500. Liu (2011) on Nikkei 500 small-caps reports similar magnitudes. The *prior* should therefore be that VINXSCEURNI carries an index effect at least as large as OSEBX, with the additional kicker that the Russell-style annual reconstitution literature (Madhavan 2003) shows the largest effects are at the *small-cap/mid-cap boundary* — exactly where SFT's universe lives.

### 5.3 Data availability — the real engineering problem

The vinxsceurni.txt snapshot in this repository shows the practical issue starkly: of the ~360 names, roughly 25 are Icelandic (ISK) and most show "Updated 00:00:00" with no live bid/ask — they trade in batches, sometimes with no transactions for an entire session. Examples in the file: Alvotech, Arion banki, Brim, Eik fasteignafélag, Eimskipafélag Íslands, Festi, Hagar, Hampiðjan, Heimar, Icelandair, Íslandsbanki, Síldarvinnslan, Síminn. Sweden dominates the universe (>50 percent of names, SEK denominated, deep liquidity). Finland (EUR) and Denmark (DKK) are reasonably liquid but with distinctly different tick regimes and shorter trading days for some venues. Currency translation to NOK adds an additional axis of noise.

Specific data engineering challenges:
1. **Iceland**: low trade frequency means `turnover_eob` and `trading_status` are heavily skewed; VWAP often undefined for a single day. Index-effect detection requires aggregating to weekly returns.
2. **Currency**: VINXSC EUR NI is the index in EUR; constituents trade in SEK/DKK/NOK/EUR/ISK. A coherent BANTHE-style backtest must either translate all returns to a single base currency (likely NOK for SFT) or use local-currency excess returns and then aggregate.
3. **Methodology heterogeneity**: VINX Small Cap rules (free-float threshold, liquidity tests, market-cap bands relative to VINX Large/Mid) differ from OSEBX's. The feature set must be re-derived from the Nasdaq Nordic methodology document (Methodology_VINX.pdf in this repo), not transplanted as-is.
4. **Survivorship and listings**: Nordic small caps see frequent IPOs and delistings (especially on First North, which is *not* in VINX Small Cap, but the migration boundary matters). Handling listings within a rebalance window will be more invasive than in BANTHE.

### 5.4 Would the BANTHE models transfer?

Partially. The classification framing is intact — predict next-period membership from rule-book variables — but four changes are required.

1. **Multi-class / hierarchical labels.** Unlike OSEBX's single-tier inclusion, VINX has Large/Mid/Small tiers. A firm exits VINXSC by moving *up* to Mid or *down* off the exchange — the price-effect signs are opposite. The model should be multinomial, not binary, or run as a stack of binary classifiers.
2. **Country and currency fixed effects.** ICB sector alone will not capture Nordic country-of-listing premia or volatility differences. Add country one-hot, primary-listing currency, and a venue indicator.
3. **Liquidity features that survive Icelandic gaps.** Replace `trading_status` with Amihud illiquidity, or use the Lesmond-Ogden-Trzcinka zero-return ratio over a rolling 60-day window. These are robust to the "00:00:00" days.
4. **Move beyond GLM/XGBoost monoculture.** With 5–10× the observations and richer covariates, the modelling palette should include LightGBM (handles categoricals natively, faster than XGBoost), a small TabNet or FT-Transformer for representation learning on the categorical-heavy feature set, and — separately — a sequence model (temporal-fusion transformer or simple LSTM) for the time-series component of the features, which BANTHE encoded as raw lags.

The PPT trick is universal and should be carried over verbatim — class imbalance gets *worse*, not better, in a 390-name universe with 5–15 quarterly changes.

### 5.5 Productionisation: how a fund actually uses this

For SFT specifically, the value of a BANTHE-style model is *not* primarily a long-short alpha engine (banned), but four operational uses:

1. **Pre-trade execution timing.** When SFT enters VINXSC tracking, it must buy the entire benchmark. If the model says a name is highly likely to be deleted at the next quarterly review, deferring the purchase (within TE limits) saves the post-deletion drop. This is precisely the trade NBIM has used since the 2000s on Government Pension Fund Global (Ang, Brandt & Denison 2014).
2. **Avoiding the wrong side of forced rebalances.** Symmetric — when a name is going to be added, buy ahead of the index's official add date to avoid paying the rebalance demand premium yourself.
3. **Active sleeve for enhanced indexing within the 5 pp TE budget.** With TE = 5 pp (vs. BANTHE's 2 percent), the active sleeve can be roughly 2.5× larger. XGBC30-style portfolios would be expected to scale almost linearly in alpha, leading to a plausible (back-of-envelope) 1.5–2 percent annual gross alpha if the underlying index effect on Nordic small caps is 1.5× OSEBX's.
4. **Risk-management overlay.** A high model-predicted probability of deletion is a signal that consensus liquidity will deteriorate — useful for sizing existing holdings even when the model is not the alpha generator.

### 5.6 Concrete PhD-proposal research questions

1. Does the index effect on VINX Small Cap exhibit the same shape (slow buildup, peak at ED-1, partial reversal) as on OSEBX, S&P 500, and Russell 2000? Estimate the event study with calendar-time and bootstrap-corrected standard errors.
2. Is the index effect heterogeneous across the five Nordic markets? Hypothesis: largest in Iceland and Finland, smallest in Sweden, because of passive AUM penetration and free-float depth.
3. Has the effect *decayed* between 2006 and 2026 as passive AUM rose? Roll the model across vintages and test for structural breaks.
4. Can predictability be exploited *long-only* with statistically significant FF5 (Fama–French 5-factor) and Q-factor alphas after costs?
5. Does combining the BANTHE membership-prediction signal with an order-book microstructure signal (depth, queue position) at the ED window improve realised execution vs. a VWAP benchmark?
6. Does an LLM-augmented news/text feature (Bloomberg news on candidate firms) move the AUROC meaningfully above the rule-book-only baseline?

## 6. Proposed 3-year PhD project for Statens fond i Tromsø

### Objectives
1. Establish, with state-of-the-art event-study and causal methods, the existence, magnitude and time-decay of the index effect across VINX Small Cap (and related Nordic indices) over 2002–2027.
2. Build a production-grade ML system that predicts VINX Small Cap composition changes 30–120 trading days ahead and quantifies the economic value of those predictions under SFT's actual mandate constraints (no shorts, 5 pp TE, ≤5 percent single-name ownership).
3. Deliver an open-source, audit-ready R/Python codebase that the SFT investment team can integrate into its execution and rebalancing workflow.

### Year 1 — Empirical foundation
- Rebuild the BANTHE dataset for VINX Small Cap 2002–2026 (Bloomberg BQL + Nasdaq Nordic methodology) with country/currency fixed effects and robust illiquidity proxies.
- Reproduce the event-study evidence (Figure 1.1 equivalent) for each Nordic submarket, with bootstrap inference, sector controls, and a calendar-time portfolio cross-check.
- Working paper #1: "The index effect on VINX Small Cap, 2002–2024".

### Year 2 — Methods
- Multinomial gradient-boosting + tabular-transformer ensemble; conditional PPT extended to multi-class.
- Probability-weighted position sizing (the explicit BANTHE limitation #4).
- Cost-aware optimisation: incorporate transaction-cost models (Almgren-Chriss, plus venue-specific spreads) directly into the model's objective.
- Walk-forward backtest with realistic capacity constraints (5 percent ownership cap, 10 percent ADV trading cap).
- Working paper #2: "Cost-aware ML for index-rebalance trading on Nordic small caps".

### Year 3 — Production and welfare
- Translate the long-short BANTHE design into a long-only enhanced-index implementation matching SFT's mandate.
- Live paper-trading or shadow-trade against the SFT execution desk for at least three rebalance cycles.
- Welfare analysis: what fraction of the index effect can a single mandated investor capture before the act of capture destroys it? Cournot-style model with calibration to SFT's expected AUM growth.
- Working paper #3 / dissertation chapter: "Productionising index-effect alpha under regulatory and ownership constraints".

### Deliverables
- Three working papers (target outlets: *Journal of Financial Markets*, *Review of Asset Pricing Studies*, *Journal of Financial Economics*).
- Open-source codebase (R + Python, fully reproducible from Bloomberg/Refinitiv).
- An internal SFT report on operational use of the signal in pre-trade timing and rebalance avoidance.
- A doctoral dissertation: "Machine Learning for the Index Effect on Nordic Small Caps: Evidence, Methods, and Implementation."
