# Official Treasury Yield-Curve Dataset Audit

## Dataset source
- Publisher: U.S. Department of the Treasury
- Series: Daily Treasury Par Yield Curve Rates
- Official table: https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value_month=202611&type=daily_treasury_yield_curve
- Methodology: https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics/
- Captured window: 2–13 November 2026
- Included observations: 9 published business dates
- Included maturities: 14 (1M, 1.5M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y)
- Data file: `data/treasury/daily-treasury-yield-curve-nov-2026.csv`

## Scope and limitations
This is a small, real-world reference sample, not a high-frequency feed. The Treasury describes these par yields as derived from closing market bid-price quotations on the most recently auctioned Treasury securities; the quotations are indicative and are obtained around 3:30 PM on business days. These are curve rates, not a tape of individual bond trades, executable quotes, or intraday ticks.

The sample contains 9 dates × 14 maturity values = 126 numeric observations. The selected maturity fields have no N/A values in these 9 rows. 11 November is absent from the published sample; do not silently fill it or assume a value. The original Treasury table also contains additional metadata and bill-rate columns that are intentionally excluded from this compact maturity-only CSV.

## Findings from the captured sample
- The 13 November curve ranges from 4.10% at 1 month to 5.47% at 30 years.
- On 13 November, the 10-year rate is 5.15% and the 2-year rate is 4.88%, a 27 bp difference.
- From 2 November to 13 November, the 10-year rate rises from 4.91% to 5.15% (+24 bp); the 30-year rate rises from 5.28% to 5.47% (+19 bp).
- The 20-year rate exceeds the 30-year rate on both 12 November (5.48% vs 5.43%) and 13 November (5.52% vs 5.47%). Preserve this observed curve shape; do not force monotonicity.
- Values are percentages. A basis-point change is calculated as percentage-point difference × 100.

## Data-quality and UI implications
1. Keep maturity as an explicit field; do not sort tenor labels lexicographically.
2. Preserve the reported precision (two decimal places) in the display.
3. Treat a missing date or missing cell as unavailable, not zero and not an interpolated value.
4. Use a neutral source/time label such as “Treasury daily curve · 13 Nov 2026”; do not label this dataset “live”.
5. Do not infer bid/ask, volume, liquidity, instrument identifiers, issuer-level bond data, or volatility from this series. Those fields are not supplied here.
6. A curve inversion or non-monotonic segment is a valid observed condition and should remain visible.

## Relevance to QuantumPulse
This dataset is suitable for validating dense numerical typography, maturity-grid alignment, precision handling, date labels, and null-state behavior. It is not sufficient by itself to validate the project brief's 500+ distinct market instruments or 5,000 live data points. Those require a separate security-level dataset and, for live behavior, an approved streaming data source.

## Reproduction note
The CSV is a manually transcribed, limited sample from the official Treasury HTML table for the dates listed above. It is not the complete 2026 archive or a direct automated feed download. Verify values against the linked Treasury source before production use.

## Official-source verification record

- Verification date: 14 November 2026
- Official publisher: U.S. Department of the Treasury
- Official series: Daily Treasury Par Yield Curve Rates
- Official November 2026 table: https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value_month=202611&type=daily_treasury_yield_curve
- Official 2026 table: https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?field_tdr_date_value=2026&type=daily_treasury_yield_curve
- Methodology: https://home.treasury.gov/policy-issues/financing-the-government/interest-rate-statistics/
- Comparison scope: 9 CSV dates × 14 maturity fields = 126 populated values.
- Result: 126 of 126 values matched the corresponding Treasury date and maturity; 0 mismatches identified.
- Dates checked: 2026-11-02, 2026-11-03, 2026-11-04, 2026-11-05, 2026-11-06, 2026-11-09, 2026-11-10, 2026-11-12, and 2026-11-13.
- Maturities checked, in CSV order: 1 month, 1.5 months, 2 months, 3 months, 4 months, 6 months, 1 year, 2 years, 3 years, 5 years, 7 years, 10 years, 20 years, and 30 years.
- The 2026-11-11 row remains absent. No value was interpolated, inferred, or added.
- No unavailable value or mismatch was identified within the 126 populated cells in the listed nine dates.

### Verification boundary

This record documents a value-by-value comparison against the official Treasury table. It is separate from structural CSV validation and automated unit-test execution. A successful source comparison does not prove that the Python validator or unit tests were run; record those results only when an actual execution log is available.

The CSV remains a manually captured sample rather than an automated Treasury feed. Recheck the source before production use because Treasury may revise or update published data.
