from datetime import datetime, timezone
from typing import Literal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="QuantumPulse API", version="0.1.0", description="Prototype API for the QuantumPulse dashboard.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Instrument(BaseModel):
    symbol: str
    name: str
    yield_percent: float
    change_bps: float
    status: Literal["normal", "watch", "alert"]
    source: str = "Illustrative mock data"
    is_mock: bool = True

SAMPLE_INSTRUMENTS = [
    Instrument(symbol="US02Y", name="US Treasury 2Y", yield_percent=4.8821, change_bps=4.2, status="watch"),
    Instrument(symbol="US05Y", name="US Treasury 5Y", yield_percent=4.9814, change_bps=1.8, status="normal"),
    Instrument(symbol="US10Y", name="US Treasury 10Y", yield_percent=5.1528, change_bps=6.7, status="alert"),
    Instrument(symbol="US30Y", name="US Treasury 30Y", yield_percent=5.4712, change_bps=-1.2, status="normal"),
]

@app.get("/")
def root():
    return {"name": "QuantumPulse API", "status": "running", "data_mode": "mock", "message": "No live market feed is connected."}

@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/instruments", response_model=list[Instrument])
def get_instruments():
    return SAMPLE_INSTRUMENTS
