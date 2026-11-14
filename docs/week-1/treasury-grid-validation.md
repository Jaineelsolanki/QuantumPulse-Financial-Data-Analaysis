# Treasury Grid Validation — Week 1

## Validation scope
This validation checks the committed sample at
`data/treasury/daily-treasury-yield-curve-nov-2026.csv`. It is a data-structure
and formatting check, not a visual legibility test or a market-data correctness
certification.

## Expected maturity order
The grid must retain this explicit maturity sequence:
1M, 1.5M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y.

Do not sort these labels as plain strings. The validator checks the CSV header
against the exact expected order.

## Sample validation results
- Data rows: 9
- Maturity columns: 14
- Populated numeric cells: 126
- Missing cells: 0
- Date range: 2–13 November 2026
- Numeric display precision in the source file: exactly two decimal places
- Date order: ascending; dates are unique

The 11 November row is absent. It remains absent; the validator does not create
or interpolate dates.

## Null and zero behavior
- An empty cell is counted as missing and remains unavailable.
- A literal `0.00` is accepted and counted as a populated numeric value.
- Missing values must not be coerced to zero.
- The current captured sample has no blank maturity cells, so the null behavior
  is verified through automated test fixtures rather than observed missing data
  in the Treasury sample.

## Automated checks
Run from the repository root:

```bash
python scripts/validate_treasury_csv.py
python -m unittest discover -s tests -p 'test_*.py'
```

The validator checks:
- exact header names and maturity order;
- ISO-formatted dates, uniqueness, and ascending order;
- exactly two decimal places for populated rates;
- blank cells as missing values rather than zero;
- zero values as valid populated numbers.

The unit tests include valid data, zero, blank-cell, duplicate-date,
out-of-order-date, and incorrect-precision cases.

## What this does not prove
- It does not prove the displayed type is legible at 100% on a 1080p screen.
- It does not measure contrast in the actual Figma frame.
- It does not validate the 500+ instrument / 5,000-point target.
- It does not convert this daily Treasury curve into live or intraday data.
- It does not verify the manually transcribed values against a machine-downloaded
  Treasury feed. The source audit's reproduction note still applies.

## Result
The sample's schema, maturity order, date sequence, and two-decimal formatting
are now covered by a repeatable validator. Missing-vs-zero semantics are covered
by automated fixtures. Visual typography and broader market-data validation
remain open tasks.
