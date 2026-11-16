# Week 1 — Day 2: Data-Priority Matrix and Information Hierarchy

## Objective
Rank available financial information by urgency, analyst importance, frequency of use, and actionability. Separate critical information from supporting analysis and contextual reference data.

This matrix is a design prioritization proposal for the QuantumPulse monitoring use case. It should be reviewed with Winner and refined when the team confirms the target analyst tasks and any additional approved datasets.

## Prioritization method

Each information group is considered against four questions:

1. **Urgency:** How quickly does an analyst need to notice it?
2. **Importance:** How much does it contribute to understanding the market condition?
3. **Frequency:** How often is it likely to be checked during monitoring?
4. **Actionability:** Does it help the analyst decide what to inspect next?

Priority levels:
- **P0 — Critical:** required for an immediate overview; should remain visible.
- **P1 — Supporting:** helps interpret the current condition; visible when space permits or available close to the primary value.
- **P2 — Contextual:** useful for investigation and comparison; revealed on demand or shown in a secondary view.

The labels represent interface priority, not investment advice or production risk ratings.

## Data-priority matrix

| Priority | Information group | Fields / examples supported by current reference | Why it matters | Recommended placement |
|---|---|---|---|---|
| P0 — Critical | Instrument / maturity identity | Maturity labels: 1M, 1.5M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y | The analyst must know which point on the curve is being inspected | Always visible in the grid |
| P0 — Critical | Latest observation | Yield (%) for the selected maturity and observation date | Main value being monitored; date prevents stale or mismatched interpretation | Always visible in the grid |
| P1 — Supporting | Change between observations | Difference in percentage points converted to basis points, when a previous published observation exists | Helps identify direction and magnitude of movement | Visible where space permits; otherwise hover / expanded detail |
| P1 — Supporting | Curve comparison | Comparison of selected maturities, such as 2Y versus 10Y, when both values share the same observation date | Provides broader curve context beyond a single maturity | Summary panel or expanded analysis |
| P2 — Contextual | Historical observations | Earlier daily yields and their dates from the captured sample | Supports comparison and trend inspection | Expanded detail / compact historical view |
| P2 — Contextual | Source and methodology | U.S. Treasury Daily Treasury Par Yield Curve Rates; daily observation context and methodology notes | Helps users understand what the values represent and what they do not represent | Source note / detail panel |

## Current data coverage and limitations

The committed reference sample contains 9 published business dates and 14 maturity fields, for 126 populated numeric yield observations. It is a limited sample of daily U.S. Treasury par-yield curve rates.

The sample supports maturity, observation date, yield, derived changes between available observations, and cross-maturity comparisons on a shared date.

The sample does **not** provide individual security identifiers, issuer-level data, bid/ask quotes, trading volume, liquidity, intraday ticks, or executable prices. These fields are not included in this matrix as if they were available. They may be added only after a separate approved dataset and definitions are supplied.

The absent 11 November observation remains absent. Do not interpolate it or treat it as zero.

## Hierarchy recommendations

### Critical information — P0
- Keep maturity identity and latest available yield visible together.
- Make the observation date clear at row or grid level.
- Preserve the yield unit (%) and the source's two-decimal precision.
- Do not allow supporting visuals to overpower the primary value.

### Supporting information — P1
- Show change in basis points only when the comparison observation is available.
- Make comparison dates discoverable so the change is interpretable.
- Use same-date maturity comparisons for curve context.
- Keep the sign and unit visible; do not rely on color alone.

### Contextual information — P2
- Make historical daily observations available without crowding the default grid.
- Provide source and methodology context in a discoverable location.
- Keep limitations clear so daily par-yield observations are not mistaken for live security-level trading data.

## Display and data-integrity rules
- Preserve the explicit maturity order; do not sort tenor labels alphabetically.
- Display yields as percentages with two decimal places, matching the captured source.
- Calculate basis-point difference as percentage-point difference × 100.
- Compare observations only when their dates are known and valid.
- Distinguish zero from missing / unavailable data.
- Do not fill missing dates or values without an approved method.
- Preserve non-monotonic curve shapes; do not force yields to increase with maturity.
- Pair color with signs, labels, or icons for direction and alert meaning.

## Review questions for Winner
1. Does the P0/P1/P2 split match the team's intended analyst workflow?
2. Should the 2Y–10Y comparison be a persistent summary metric or remain in supporting analysis?
3. Which additional approved market fields, if any, will be supplied for the next iteration?
4. What specific analyst tasks should be used to validate the priority order?

## Day 2 completion status
**Drafted:** prioritization criteria, P0/P1/P2 matrix, field placement recommendations, hierarchy rules, and data limitations based on the committed Treasury reference sample.

**Pending:** review with Winner, confirmation of target analyst tasks, and updates if a broader approved dataset is provided.
