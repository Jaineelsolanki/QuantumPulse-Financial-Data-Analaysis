# Week 2 — Visibility & Interaction Rules

| Layer | Trigger | Information shown | Behavior | Constraints |
|---|---|---|---|---|
| Default | Initial dashboard view | Maturity / instrument, latest yield, unit, observation-date context, supported change and status | Stable, scannable grid | No hover/click required for essential values |
| Hover | Pointer enters a row or data point | Previous available observation, comparison date, calculated bps change, field/unit help, supported data context | Compact tooltip and row highlight | Must not reflow grid or obscure essential neighboring values |
| Selected | Analyst selects a row | Selected-row emphasis and access to deeper information | Opens anchored detail view | Preserve grid context and selected identity |
| Expanded | Selected row detail is open | Latest and previous observations, bps difference, historical daily trend, source/date, applicable alert explanation | Inline expansion or side panel | Collapse on repeat selection/close; switching rows changes detail target |
| High alert | A defined alert rule is met | Severity label, affected value, movement, date, threshold explanation | Strong but controlled emphasis | Do not rely on color alone or hide context |
| Unavailable | Required source value is absent | Explicit unavailable marker and explanation where known | Stable placeholder | Never convert missing to zero or invent values |

## Field placement guidance

### Default grid
- Maturity / instrument label.
- Latest yield (%).
- Observation date or unambiguous date context.
- Daily change (bps) only when a valid comparison is available.
- Supported alert / data status.

### Hover
- Previous available yield and its date.
- Difference in basis points.
- Field definition and units.
- Source freshness / availability context.

### Expanded details
- Selected maturity and observation date.
- Latest and previous observations.
- Calculated change and comparison window.
- Historical daily observations / compact trend.
- Source and data limitations.
- Alert rule explanation, if defined.

## Interaction acceptance criteria
- Hover feedback is reversible and does not change grid dimensions.
- Tooltips remain within the viewport and do not obscure essential values.
- Selected state is visually distinct from hover state.
- Expanded state remains anchored to the selected row or clearly identifies its instrument.
- A second selection changes the detail target; closing restores the compact grid.
- Keyboard focus and activation have an equivalent path to pointer interaction.
- Positive, negative, zero, and unavailable values are distinguishable without color alone.
- The maturity order remains explicit and stable.

## Data boundary
The currently documented Treasury sample supports daily par-yield values by maturity and date. It does not contain security-level bid/ask, volume, liquidity, issuer, or intraday trading fields. Do not show these as actual values in the prototype without a separate verified dataset. Alert thresholds are not yet approved and must be treated as configurable design placeholders until Winner confirms them.
