# Week 1 Progress Log

## Scope from the project brief
- HCI research & architecture: audit a complex financial dataset and rank information by urgency and analyst priority.
- UI design & motion prototyping: establish a monospaced typography scale for numerical legibility in dense interfaces.

## Repository documentation completed
- Added a proposed P0–P3 financial-data hierarchy in `docs/week-1/data-hierarchy.md`.
- Defined initial numerical typography roles, desktop type scale, formatting rules, and legibility checks in `docs/week-1/typography-system.md`.
- Added a limited U.S. Treasury Daily Par Yield Curve sample and documented its scope and limitations.
- Added repeatable CSV validation guidance and test fixtures documentation.
- Updated the project overview and documentation index.

## Status by deliverable

| Deliverable | Status | Evidence / next step |
|---|---|---|
| Data urgency and priority model | Drafted | P0–P3 proposal documented; review priorities with Winner |
| Reference financial dataset | Added and source-checked | 9 dates × 14 maturities = 126 values compared with the official Treasury table; sample remains manually captured |
| Production / live data coverage | Not in scope of this design record | Treasury sample is daily curve data, not a live feed or a security-level dataset |
| Analyst / team validation | Pending | Review priorities and definitions with Winner / target-user proxy |
| Numerical typography roles | Defined | IBM Plex Mono for financial values; Inter for interface text |
| Initial type scale and formatting rules | Drafted | Documented in typography-system.md |
| Small-size legibility validation | Pending | Review a Figma frame at 1080p and 100% display scale |
| Full contrast validation | Pending | Measure actual foreground/background pairs in the design |

## Important limitations
- The Treasury sample contains 9 published business dates and 14 maturity fields (126 numeric observations).
- It is daily par-yield curve data, not intraday ticks, executable quotes, or individual bond trade data.
- Bid/ask, volume, liquidity, issuer-level fields, and intraday movement are not supplied by this sample.
- The 11 November date is absent and must not be interpolated or silently filled.
- The project brief's 500+ instruments / 5,000 data-point target is not validated by this sample.
- Source comparison is documented separately from execution of the CSV validator and unit tests; do not claim those tests ran without an execution record.

## Next actions
1. Review P0–P3 priorities and field definitions with Winner.
2. Review numerical legibility in the Figma design at 1080p and 100% scale.
3. Measure contrast for actual design color pairs.
4. Carry approved hierarchy and typography into Week 2 progressive-disclosure rules and reusable components.
