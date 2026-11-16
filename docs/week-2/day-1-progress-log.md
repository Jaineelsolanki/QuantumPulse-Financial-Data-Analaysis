# Week 2 — Day 1 Progress Log

## Focus
Progressive Disclosure Research: define how analysts access essential, supporting, and detailed financial information without losing the main dashboard overview.

## Completed documentation
- `docs/week-2/day-1-progressive-disclosure-research.md`: research rationale, default / hover / expanded layers, normal and high-alert presentation, data-integrity constraints, Figma requirements, and ProtoPie requirements.
- `docs/week-2/visibility-interaction-rules.md`: visibility matrix, field placement, interaction rules, acceptance criteria, and data boundaries.
- `docs/week-2/progressive-disclosure-map.md`: analyst interaction journey, information placement map, and prototype state model.
- Updated the root README to describe the research, Figma, ProtoPie, and documentation workflow.

## Current status

| Deliverable | Status | Notes |
|---|---|---|
| Progressive Disclosure Research | Drafted | Requires review with Winner |
| Visibility & Interaction Rules | Drafted | Alert thresholds and final fields require confirmation |
| Progressive Disclosure Map | Drafted | Ready to guide component and prototype work |
| Data-grid component requirements | Drafted | Default, Hover, Selected, Expanded states specified |
| Figma component construction | Pending | Build reusable components with Auto Layout and variants |
| ProtoPie interaction prototype | Pending | Implement hover, selection, expansion, and alert-state interactions |
| Visual / accessibility validation | Pending | Review legibility, contrast, keyboard/focus equivalents, and motion |

## Important design boundaries
- The available Treasury reference is daily par-yield curve data, not intraday or security-level bond data.
- Do not invent bid/ask, volume, liquidity, issuer-level fields, or alert thresholds.
- Preserve maturity order, two-decimal rate precision, dates, and missing-vs-zero semantics.
- These are research and prototype specifications; Figma components and ProtoPie interactions are not yet marked complete.

## Next steps
1. Review the proposed visibility rules with Winner.
2. Confirm alert severity definitions and any additional data fields.
3. Build the reusable data-grid component set in Figma.
4. Translate the approved states and behaviors into ProtoPie.
