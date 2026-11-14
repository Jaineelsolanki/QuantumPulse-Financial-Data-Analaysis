#!/usr/bin/env python3
"""Validate the compact Treasury yield-curve CSV used by QuantumPulse.

Run from the repository root:
    python scripts/validate_treasury_csv.py
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path

EXPECTED_COLUMNS = [
    "date", "1_month", "1_5_month", "2_month", "3_month", "4_month",
    "6_month", "1_year", "2_year", "3_year", "5_year", "7_year",
    "10_year", "20_year", "30_year",
]
NUMBER_PATTERN = re.compile(r"^-?\d+\.\d{2}$")


def validate(path: Path) -> dict[str, int | str]:
    errors: list[str] = []
    row_count = 0
    populated_values = 0
    missing_values = 0
    seen_dates: set[str] = set()
    parsed_dates: list[date] = []

    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames != EXPECTED_COLUMNS:
            raise ValueError(
                "Unexpected CSV columns/order. "
                f"Expected {EXPECTED_COLUMNS}; got {reader.fieldnames}"
            )

        for line_number, row in enumerate(reader, start=2):
            row_count += 1
            raw_date = (row.get("date") or "").strip()
            try:
                parsed_date = date.fromisoformat(raw_date)
            except ValueError:
                errors.append(f"Line {line_number}: invalid ISO date {raw_date!r}")
                parsed_date = None

            if raw_date in seen_dates:
                errors.append(f"Line {line_number}: duplicate date {raw_date}")
            seen_dates.add(raw_date)
            if parsed_date is not None:
                parsed_dates.append(parsed_date)

            for column in EXPECTED_COLUMNS[1:]:
                raw_value = (row.get(column) or "").strip()
                if raw_value == "":
                    missing_values += 1
                    continue  # Missing is not zero; preserve it as unavailable.
                if not NUMBER_PATTERN.fullmatch(raw_value):
                    errors.append(
                        f"Line {line_number}, {column}: expected a value "
                        f"with exactly two decimal places, got {raw_value!r}"
                    )
                    continue
                try:
                    Decimal(raw_value)
                except InvalidOperation:
                    errors.append(
                        f"Line {line_number}, {column}: invalid decimal {raw_value!r}"
                    )
                    continue
                populated_values += 1

    if row_count == 0:
        errors.append("CSV contains no data rows")
    if parsed_dates != sorted(parsed_dates):
        errors.append("Dates are not in ascending chronological order")

    if errors:
        raise ValueError("\n".join(errors))

    return {
        "rows": row_count,
        "maturities": len(EXPECTED_COLUMNS) - 1,
        "populated_values": populated_values,
        "missing_values": missing_values,
        "first_date": parsed_dates[0].isoformat(),
        "last_date": parsed_dates[-1].isoformat(),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "csv_path",
        nargs="?",
        default="data/treasury/daily-treasury-yield-curve-nov-2026.csv",
        type=Path,
    )
    args = parser.parse_args()
    try:
        result = validate(args.csv_path)
    except (OSError, ValueError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1

    print("PASS: Treasury CSV structure and values are valid")
    for key, value in result.items():
        print(f"{key}: {value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
