# Week 2 — Day 1: Progressive Disclosure Research

## Objective
Define how QuantumPulse presents dense financial information in three layers so analysts can maintain an overview while accessing supporting context when needed.

This is a design specification for the Figma and ProtoPie workflow. It does not describe a new software implementation.

## Project context
Week 1 established a proposed financial-data hierarchy and numerical typography system. The available reference dataset is the U.S. Treasury Daily Treasury Par Yield Curve sample documented in `docs/week-1/treasury-dataset-audit.md`: 9 published business dates, 14 maturities, and 126 populated numeric observations. It is daily curve data, not intraday trading data or a feed of individual securities.

The dataset supports decisions about maturity ordering, rate precision, dates, and missing-value presentation. It does not supply bid/ask, volume, liquidity, issuer-level bond metadata, or intraday movement. Do not design those as populated facts unless a separate approved source is provided.

## 1. Default visibility
Keep the following information visible without interaction:
- Instrument / maturity label.
- Latest available yield, with percent unit.
- Observation date or clear dataset date context.
- Relevant change value only where a valid comparison observation exists; show the unit (bps).
- Alert or data-quality state when supported by an explicitly defined rule.
- Search and essential grid controls.

For a Treasury maturity grid, preserve the explicit maturity order: 1M, 1.5M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y. Do not sort maturity labels lexicographically.

## 2. Hover visibility
Hover may reveal compact supporting context without changing the table's geometry:
- Previous available observation and its date, if present in the selected data.
- Calculated difference in basis points, with the comparison dates clear.
- A short definition of the field or unit.
- Data availability / freshness context derived from the source timestamp.
- Alert threshold explanation only after thresholds have been agreed and specified.

Hover must:
- Preserve the user's position in the grid and keep the row highlighted.
- Avoid covering key neighboring values; reposition or constrain the tooltip near viewport edges.
- Dismiss on pointer leave and remain readable at the intended desktop scale.
- Not be the only way to access essential information; provide an equivalent click/keyboard path where practical.

## 3. Click / expanded visibility
Selecting a row opens an inline detail area or a clearly anchored side panel. The selected instrument remains identifiable and the overview stays in context.

Proposed detail content:
- Maturity / instrument label and selected observation date.
- Latest yield and previous available observation, with units and dates.
- Basis-point difference, calculated only from available observations.
- A compact historical trend using the available daily observations.
- Data source and limitations.
- Alert state and its rule explanation, only when a defined rule applies.

Interaction rules:
- Select a row to expand its details.
- Select the same row again or use an explicit close control to collapse it.
- Selecting another row moves the detail focus to that row.
- Keep column headings and the overall grid context visible.
- If values are unavailable, label them unavailable; never substitute zero or fabricate history.

## 4. Normal and high-alert presentation
### Normal monitoring
- Keep the grid compact and stable.
- Keep core values and date context visible.
- Keep secondary details collapsed until requested.
- Use restrained hover feedback and avoid unnecessary motion.

### High-alert state
- Make the affected row and severity distinguishable using text / label / icon as well as color.
- Keep the relevant yield, movement, and date visible.
- Use hover for concise threshold context.
- Use the expanded state for the explanation, comparison window, and supporting observations.
- Do not dim or hide information needed to interpret the alert.
- Alert thresholds and trigger logic remain a design decision to be confirmed; do not invent operational thresholds.

## 5. Data integrity and presentation constraints
- Treasury par yields are percentages; basis-point differences are percentage-point differences multiplied by 100.
- Preserve the source's two-decimal precision for rates.
- Distinguish a true zero from a missing value.
- Do not fill absent dates or interpolate missing observations without an explicitly approved method.
- Preserve non-monotonic curve shapes; do not force maturities into an assumed increasing yield sequence.
- Label the sample as daily Treasury curve data, not live or intraday market data.
- Keep the source and observation date discoverable.

## 6. Figma component requirements
The design system should define reusable components and variants for:
- Data-grid row: Default, Hover, Selected, Expanded.
- Yield value: Default, Focused / Emphasized, Unavailable.
- Change value: Positive, Negative, Neutral, Unavailable.
- Data-status label: Available, Stale / Date-context warning, Unavailable (use only states actually supported by the data).
- Alert badge: Normal, Warning, High Alert (severity rules to be defined).
- Tooltip: Hidden, Visible.
- Detail panel: Collapsed, Expanded.
- Search field: Default, Focused, Filled, No Results.

Use Auto Layout for repeatable row and detail-panel structure. Maintain stable column alignment, consistent numeric precision, tabular numerals, clear units, accessible contrast, and visible focus states. Preserve the established Week 1 typography roles unless a measured review justifies a change.

## 7. ProtoPie interaction requirements
The interactive prototype should demonstrate:
1. Hovering a row reveals the supporting tooltip.
2. Moving away dismisses the tooltip.
3. Selecting a row opens its detail view.
4. Selecting it again or activating close collapses the detail view.
5. Selecting a different row updates the detail view.
6. Normal and high-alert states communicate different urgency without hiding essential values.
7. Missing data remains visibly distinct from zero.
8. Search / filtering does not break the selected-row context (final behavior to be specified during prototype design).

## Completion status
**Drafted:** progressive-disclosure research, initial visibility rules, interaction behavior, design-component requirements, and ProtoPie behavior requirements.

**Pending:** review with Winner, confirmation of alert thresholds and actual field availability, Figma component construction, ProtoPie implementation, and visual/accessibility validation.
