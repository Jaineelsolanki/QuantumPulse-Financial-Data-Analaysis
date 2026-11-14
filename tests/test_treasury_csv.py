import csv
import tempfile
import unittest
from pathlib import Path

from scripts.validate_treasury_csv import EXPECTED_COLUMNS, validate


class TreasuryCsvValidationTests(unittest.TestCase):
    def write_csv(self, rows):
        temp = tempfile.NamedTemporaryFile(
            mode="w", newline="", encoding="utf-8", suffix=".csv", delete=False
        )
        with temp:
            writer = csv.DictWriter(temp, fieldnames=EXPECTED_COLUMNS)
            writer.writeheader()
            writer.writerows(rows)
        self.addCleanup(Path(temp.name).unlink, missing_ok=True)
        return Path(temp.name)

    def row(self, day, value="4.25"):
        result = {"date": day}
        result.update({column: value for column in EXPECTED_COLUMNS[1:]})
        return result

    def test_valid_data_and_zero_are_counted_as_values(self):
        first = self.row("2026-11-02", "0.00")
        second = self.row("2026-11-03", "4.25")
        result = validate(self.write_csv([first, second]))
        self.assertEqual(result["rows"], 2)
        self.assertEqual(result["populated_values"], 28)
        self.assertEqual(result["missing_values"], 0)

    def test_blank_cell_is_missing_not_zero(self):
        row = self.row("2026-11-02")
        row["10_year"] = ""
        result = validate(self.write_csv([row]))
        self.assertEqual(result["missing_values"], 1)
        self.assertEqual(result["populated_values"], 13)

    def test_duplicate_dates_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "duplicate date"):
            validate(self.write_csv([
                self.row("2026-11-02"), self.row("2026-11-02")
            ]))

    def test_out_of_order_dates_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "ascending"):
            validate(self.write_csv([
                self.row("2026-11-03"), self.row("2026-11-02")
            ]))

    def test_wrong_precision_is_rejected(self):
        row = self.row("2026-11-02")
        row["10_year"] = "4.2"
        with self.assertRaisesRegex(ValueError, "exactly two decimal places"):
            validate(self.write_csv([row]))


if __name__ == "__main__":
    unittest.main()
