# QuantumPulse — Financial Data Density Engine

A B2B FinTech dashboard concept for quantitative analysts monitoring global bond markets. The project explores high-density financial data presentation, numerical typography, progressive disclosure, and cognitive-load-aware alert states.

## Project brief

QuantumPulse addresses dashboard blindness in dense financial interfaces. The design direction uses spark-grids, monospaced tabular typography, and progressive disclosure to help analysts identify important market changes without unnecessary visual competition.

The project brief describes a target of 5,000 live data points on one screen. This is a design goal from the brief, not a currently implemented or verified capability.

## Week 1 — Data hierarchy and typography

Week 1 focuses on:
- Ranking financial information by urgency and analyst priority.
- Establishing a monospaced numerical typography system for small-size legibility.

Documentation:
- [Financial data hierarchy](docs/week-1/data-hierarchy.md)
- [Numerical typography system](docs/week-1/typography-system.md)

**Evidence note:** The Week 1 documents currently define a proposed information architecture and typography specification. A limited official Treasury par-yield sample and source audit have now been added. It supports initial checks of maturity-grid structure and numerical formatting, but it is not a security-level bond dataset and does not complete validation of the proposed P0–P3 hierarchy. The typography scale still requires final 1080p legibility validation.

## Planned technical direction

The software implementation is planned to use:
- React + TypeScript + Vite for the dashboard frontend.
- Python + FastAPI for backend services.
- WebSockets for streaming-style updates.
- A clearly labelled mock dataset until an approved market-data source is available.

These are planned implementation choices; the application scaffold and live data pipeline are not yet implemented.

## Roadmap

- [x] Add Week 1 data hierarchy proposal.
- [x] Add Week 1 typography system specification.
- [x] Add a limited official Treasury yield-curve sample (`data/treasury/`) and its audit (`docs/week-1/treasury-dataset-audit.md`).
- [x] Add a limited official Treasury yield-curve sample and document its scope / data-quality findings.
- [ ] Validate the hierarchy against a broader security-level bond-market dataset.
- [ ] Complete small-size numerical legibility and contrast checks.
- [ ] Week 2: define progressive disclosure rules and build dense reusable data-grid components.
- [ ] Mid-project review: validate 500+ data points on a 1080p display and test large / null values.
- [ ] Week 3: define alert triggers and implement Normal / High-Alert state transitions.
- [ ] Week 4: conduct heuristic eye-path review and complete design-system documentation.

## Repository status

This repository currently contains project documentation. Frontend, backend, streaming, alert-engine, and automated test implementation remain planned work.

## Working principles

- Do not present mock values as live market data.
- Preserve units, signs, precision, timestamps, and missing-value semantics.
- Do not use color as the only indicator of a market movement or alert.
- Record validation evidence and known limitations alongside design decisions.
