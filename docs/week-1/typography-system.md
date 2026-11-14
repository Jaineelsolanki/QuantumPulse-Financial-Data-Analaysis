# Week 1 — Numerical Typography System

## Purpose
Establish a consistent type system for dense financial values, with particular attention to numerical legibility at small sizes. The project brief specifically calls for a strict monospaced typography scale.

## Typeface roles
- **IBM Plex Mono:** financial values, prices, yields, basis-point changes, timestamps, identifiers, and other tabular numerical data.
- **Inter:** interface labels, navigation, panel headings, helper text, and explanatory copy.

Use tabular numerals wherever the selected font and implementation support them. Keep numeric columns right-aligned so decimal places and signs are easy to scan.

## Proposed desktop type scale

| Role | Typeface | Size | Weight | Usage |
|---|---|---:|---|---|
| Primary financial value | IBM Plex Mono | 13 px | Medium (500) | Key yield, price, and change values |
| Dense grid value | IBM Plex Mono | 12 px | Regular (400) / Medium (500) | Standard numerical cells |
| Secondary numerical value | IBM Plex Mono | 11 px | Regular (400) | Supporting metrics and compact metadata |
| Column / field label | Inter | 11 px | Medium (500) | Grid headers and short labels |
| Body / helper text | Inter | 12 px | Regular (400) | Explanations and supporting copy |
| Compact metadata | Inter | 10 px | Regular (400) | Timestamps, units, and secondary labels |
| Panel title | Inter | 14–16 px | Semibold (600) | Section and panel headings |

This is the initial design scale for desktop density exploration, not a verified minimum readable size. Final values must be confirmed through rendered-screen checks and user review.

## Numerical formatting rules
1. Right-align numerical columns.
2. Use consistent decimal precision within the same field and unit.
3. Keep minus signs visible; do not rely on red/green color alone to communicate direction.
4. Include units in the column label or adjacent metadata (for example, yield (%) and change (bps)).
5. Use a consistent placeholder for missing values and ensure it cannot be confused with zero.
6. Keep timestamps visually distinct from market values while preserving enough contrast to read them.
7. Avoid mixing proportional and tabular numeral styles within the same data column.

## Legibility and density test plan
Test the scale in the actual dashboard frame at the intended 1080p display size:
- Inspect 10 px metadata, 11 px labels, and 11–13 px numerical values at 100% zoom.
- Check common financial patterns: 0.00, -0.125, +12.5, 100.000, and long identifiers.
- Compare dense rows with clear column alignment and consistent spacing.
- Verify that font weight does not make narrow digits or punctuation merge.
- Check contrast for primary, secondary, positive, negative, muted, and alert text against their actual backgrounds.
- Repeat at the expected display scaling; do not use a zoomed Figma canvas as proof of on-screen legibility.

## Acceptance criteria
- Financial values use IBM Plex Mono consistently.
- Interface labels and supporting copy use Inter consistently.
- Numerical columns align consistently and use stable precision rules.
- Sign, decimal point, units, zero, and missing-value states remain distinguishable.
- A 1080p screenshot at 100% scale is reviewed and legibility findings are recorded.

## Week 1 status
**Defined:** typeface roles, initial scale, numerical formatting rules, and validation checklist.

**Pending evidence:** final 1080p legibility review, measured contrast audit across all actual color pairs, and confirmation of the final scale after testing.
