# Week 2 — Progressive Disclosure Map

## Analyst journey

```text
DASHBOARD / GRID
  |
  | Default: scan maturity, latest yield, date context, supported change/status
  |
  +-- Pointer enters row
  |      |
  |      +-- HOVER TOOLTIP
  |             Previous available observation + date
  |             Calculated change (bps)
  |             Field / unit explanation
  |             Supported data-status context
  |      |
  |      +-- Pointer leaves -> tooltip closes; grid remains unchanged
  |
  +-- Analyst selects row
         |
         +-- EXPANDED DETAILS
                Selected maturity and observation date
                Latest / previous yield and comparison window
                Calculated bps difference
                Historical daily observations / trend
                Source and limitations
                Alert explanation (only if a rule is defined)
         |
         +-- Select same row / close -> return to compact grid
         |
         +-- Select another row -> details update to new selection
```

## Information placement map

| Information | Default | Hover | Expanded |
|---|:---:|:---:|:---:|
| Maturity / instrument label | ✓ | — | ✓ |
| Latest yield and unit | ✓ | ✓ | ✓ |
| Observation date | ✓ / date context | ✓ | ✓ |
| Previous available yield | — | ✓ | ✓ |
| Calculated bps difference | When useful and valid | ✓ | ✓ |
| Historical daily observations | — | — | ✓ |
| Source / methodology limitations | Source/date cue | Short context | Full context |
| Alert severity | When active | ✓ | ✓ |
| Alert threshold explanation | — | If defined | If defined |
| Unavailable-data state | ✓ | ✓ | ✓ |

## Prototype state model
- Row: Default → Hover → Selected → Expanded.
- Tooltip: Hidden ↔ Visible.
- Detail view: Collapsed ↔ Expanded.
- Alert: Normal / Warning / High Alert, subject to confirmed thresholds.
- Data availability: Available / Unavailable; stale state only when source timing makes it demonstrable.

## Design guardrails
1. Keep the overview stable while revealing detail progressively.
2. Never make essential information hover-only.
3. Do not use color as the only indicator of change or severity.
4. Preserve missing-vs-zero semantics and source precision.
5. Avoid unsupported market fields and invented alert thresholds.
6. Keep motion short, purposeful, and non-blocking; provide clear focus and close behavior.
