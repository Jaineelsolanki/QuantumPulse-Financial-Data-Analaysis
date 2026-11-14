# QuantumPulse — Financial Data Density Engine

A B2B FinTech dashboard prototype for quantitative analysts monitoring global bond markets. The project explores high-density financial data presentation, numerical typography, progressive disclosure, and cognitive-load-aware alert states.

## Current implementation

**Frontend:** React + TypeScript + Vite. Includes a responsive market-monitor screen, summary cards, searchable bond watchlist, sparklines, selectable rows, and a simulated High-Alert view.

**Backend:** Python + FastAPI. Includes a health endpoint and a sample-instruments endpoint.

The dashboard currently uses illustrative mock data. The frontend is not yet connected to the backend, and no live market-data provider or WebSocket stream is connected. Do not treat displayed values as live prices.

## Run locally

### Frontend
Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Backend
Requires Python 3.10 or later.

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`.

## Project documentation

- [Financial data hierarchy](docs/week-1/data-hierarchy.md)
- [Numerical typography system](docs/week-1/typography-system.md)
- [Treasury dataset audit](docs/week-1/treasury-dataset-audit.md)
- [Grid validation results](docs/week-1/treasury-grid-validation.md)

## Next development steps

- Connect React frontend to FastAPI.
- Replace duplicated local sample values with a single typed API data model.
- Define progressive disclosure and dense-grid behavior.
- Validate large numbers, missing values, and 500+ visible fields.
- Define alert thresholds and Normal / Warning / High-Alert transitions.
- Add WebSocket updates using approved or clearly labelled simulated data.
- Complete visual, responsive, accessibility, and integration tests.
- Deploy a review build.

## Working principles

- Never present mock values as live market data.
- Preserve units, signs, precision, timestamps, and missing-value semantics.
- Do not use color as the only indicator of an alert.
- Record validation evidence and known limitations alongside design decisions.
