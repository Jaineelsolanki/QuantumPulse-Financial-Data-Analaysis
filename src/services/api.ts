const API_BASE_URL = "http://localhost:8000";

export interface Instrument {
  symbol: string;
  name: string;
  yield_percent: number;
  change_bps: number;
  status: "normal" | "watch" | "alert";
  source: string;
  is_mock: boolean;
}

export async function getInstruments(): Promise<Instrument[]> {
  const response = await fetch(`${API_BASE_URL}/api/instruments`);

  if (!response.ok) {
    throw new Error("Unable to fetch instruments from FastAPI");
  }

  return response.json();
}