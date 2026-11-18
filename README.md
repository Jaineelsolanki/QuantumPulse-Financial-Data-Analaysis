# QuantumPulse — Financial Data Density Engine

A B2B FinTech UX and interaction-design project for quantitative analysts monitoring global bond markets. QuantumPulse explores high-density financial data presentation, numerical typography, progressive disclosure, and cognitive-load-aware alert states.

## Project focus

The project focuses on research, interface design, reusable design-system components, and interactive prototyping.

- **Research & information architecture:** financial-data hierarchy, analyst priorities, progressive disclosure, and data-integrity rules.
- **Figma design system:** dashboard layouts, Auto Layout, reusable data-grid components, component variants, typography, and visual states.
- **ProtoPie interaction prototype:** hover, selection, expanded details, alert-state transitions, and interaction behavior.
- **Documentation & validation:** research findings, visibility rules, design decisions, usability checks, accessibility considerations, and progress records.

This repository is the project documentation and research record. It is not a software-development or local-run guide.

## Week 1 — Data hierarchy and numerical typography

- [Financial data hierarchy](docs/week-1/data-hierarchy.md)
- [Day 2 data-priority matrix](docs/week-1/day-2-data-priority-matrix.md)
- [Day 2 progress log](docs/week-1/day-2-progress-log.md)
- [Numerical typography system](docs/week-1/typography-system.md)
- [Treasury dataset audit](docs/week-1/treasury-dataset-audit.md)
- [Treasury grid validation](docs/week-1/treasury-grid-validation.md)
- [Week 1 progress log](docs/week-1/progress-log.md)

The Treasury reference is a limited sample of daily par-yield observations, not an intraday feed or a complete set of individual bond instruments. Its source, scope, and limitations are recorded in the dataset audit.

## Week 2 — Progressive disclosure and interactive design

Day 1 deliverables:
- [Progressive Disclosure Research](docs/week-2/day-1-progressive-disclosure-research.md)
- [Visibility & Interaction Rules](docs/week-2/visibility-interaction-rules.md)
- [Progressive Disclosure Map](docs/week-2/progressive-disclosure-map.md)
- [Week 2 Day 1 progress log](docs/week-2/day-1-progress-log.md)
- [Week 2 Day 2 Progressive Disclosure State Board](docs/week-2/day-2-progressive-disclosure-state-board.md)

Week 2 design work proceeds from the existing project foundation:
1. Review and confirm default, hover, selected, and expanded information layers.
2. Define the data-grid structure and reusable Figma components.
3. Build component variants and states with Auto Layout.
4. Integrate the components into the dashboard design.
5. Translate the approved interaction rules into a ProtoPie prototype.
6. Review visual hierarchy, numerical legibility, accessibility, and interaction clarity.

## Project roadmap

- [x] Draft Week 1 financial-data hierarchy.
- [x] Define initial numerical typography roles and formatting rules.
- [x] Record and validate the limited Treasury reference sample.
- [x] Draft Week 2 Day 1 progressive-disclosure research.
- [x] Draft the visibility and interaction rules.
- [x] Draft the progressive-disclosure map.
- [ ] Review Day 1 decisions with Winner and confirm unresolved field / alert definitions.
- [x] Complete the Week 2 Day 2 Progressive Disclosure State Board in Figma and document the four primary states.
- [ ] Build reusable Figma data-grid components and variants.
- [ ] Integrate the components into the dashboard design.
- [ ] Build the ProtoPie interactive prototype.
- [ ] Validate normal and high-alert states, hover and expanded behavior, and missing-data presentation.
- [ ] Complete design-system documentation and project handoff.

## Working principles

- Do not present mock or illustrative values as live market data.
- Preserve units, signs, precision, timestamps, and missing-value semantics.
- Do not use color as the only indicator of movement or alert severity.
- Do not invent fields, alert thresholds, or data that the source does not provide.
- Keep essential information visible without requiring hover.
- Record evidence, decisions, assumptions, and limitations alongside design work.
