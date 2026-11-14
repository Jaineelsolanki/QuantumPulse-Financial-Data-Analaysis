# Week 1 — Financial Data Hierarchy

## Purpose
Define an information hierarchy for the QuantumPulse quantitative-analyst use case: monitoring global bond markets in a high-density interface.

The project brief identifies dashboard blindness as the core problem. Week 1 establishes which information should receive attention first.

## Evidence boundary
No source market-data file or production feed was supplied with this repository when this document was prepared. This is a proposed UX information architecture derived from the project brief and stated bond-market use case. It is not a completed audit of a real financial dataset. Priorities must be validated with the team and representative users before production use.

## Proposed priority model

| Priority | Meaning | Candidate fields | Default treatment |
|---|---|---|---|
| P0 — Immediate attention | Identify the instrument, understand its current movement, and notice a potentially important event | Instrument / ticker, latest yield, yield change (bps), alert severity, event or update timestamp, stale-data indicator | Always visible; strongest numerical hierarchy |
| P1 — Decision context | Interpret movement and liquidity | Bid, ask, bid–ask spread, volume / liquidity, benchmark yield, benchmark spread | Visible in the primary grid where space permits |
| P2 — Supporting analysis | Deeper comparison, not required at every glance | Previous close, session high / low, price, coupon, maturity date, duration, daily range | Secondary columns, hover details, or expandable row |
| P3 — Reference metadata | Identification, filtering, occasional lookup | Issuer, country, currency, sector, instrument identifier, credit rating, issue size | Filters, details panel, or click-through |

These are candidate fields, not a claim that all are present in a supplied dataset. Field availability and exact definitions need confirmation against the eventual data schema.

## Initial progressive-attention rules
1. Keep P0 visible in the default view.
2. Show the most decision-relevant P1 fields alongside P0; move less frequently used P1 fields into a details view.
3. Put P2 in secondary columns or row details so it remains available without competing with urgent values.
4. Keep P3 available through filters or an instrument-details panel.
5. When a validated alert condition fires, emphasize the affected instrument and its P0 values. Reduce the visual prominence of unrelated panels rather than hiding information needed to interpret the alert.
6. Never use color as the only signal: pair color with sign, labels, icons, or explicit alert text.

## Data-quality and display rules to validate
- Preserve the sign of changes; positive and negative basis-point movements must be distinguishable.
- Display zero as a real value (0.00), not as missing data.
- Represent missing values explicitly (for example, an em dash) and distinguish them from zero.
- Show timestamps and a stale-data state so an old value is not mistaken for a live value.
- Define consistent precision and rounding per field; do not silently truncate values.
- Test unusually large values, negative values where valid, and long instrument identifiers.
- Document units in headers or field metadata (for example, yield in percent and change in bps).

## Validation still required
- Obtain a representative bond-market dataset and map its actual columns to this hierarchy.
- Confirm field definitions, units, update cadence, and missing-value conventions with the data owner / team lead.
- Review priorities with the target analyst or a proxy reviewer.
- Record changes to the P0–P3 classification and the rationale.

## Week 1 status
**Drafted:** proposed priority model, initial visibility rules, and data-quality considerations.

**Not yet evidenced:** audit of a real dataset, user validation, and confirmation of the actual production field schema.
