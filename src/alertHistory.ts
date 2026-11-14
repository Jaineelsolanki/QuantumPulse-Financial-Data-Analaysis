import type { AlertStatus } from "./alertEngine";

export type AlertHistoryEntry = {
  id: string;
  symbol: string;
  name: string;
  previousStatus: AlertStatus;
  newStatus: AlertStatus;
  changeBps: number;
  timestamp: string;
};

export type AlertTransitionRow = {
  symbol: string;
  name: string;
  status: AlertStatus | null;
  change: number;
  changeBps?: number | string | null;
};

const STORAGE_KEY = "quantumpulse.alertHistory.v1";
const MAX_HISTORY_ENTRIES = 100;
const validStatuses: AlertStatus[] = ["normal", "warning", "high-alert"];

function parseChangeBps(row: AlertTransitionRow): number | null {
  const value = row.changeBps === undefined ? row.change * 100 : row.changeBps;
  if (value === null || (typeof value === "string" && value.trim() === "")) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function detectStatusTransitions(
  previousStatuses: Record<string, AlertStatus | null>,
  rows: AlertTransitionRow[],
  timestamp = new Date(),
): { entries: AlertHistoryEntry[]; statuses: Record<string, AlertStatus | null> } {
  const entries = rows.flatMap((row) => {
    const previousStatus = previousStatuses[row.symbol];
    const changeBps = parseChangeBps(row);
    if (!row.status || !previousStatus || previousStatus === row.status || changeBps === null) return [];
    return [{
      id: `${timestamp.getTime()}-${row.symbol}-${previousStatus}-${row.status}`,
      symbol: row.symbol,
      name: row.name,
      previousStatus,
      newStatus: row.status,
      changeBps,
      timestamp: timestamp.toISOString(),
    }];
  });
  const statuses = Object.fromEntries(rows.map((row) => [row.symbol, row.status]));
  return { entries, statuses };
}

export function appendHistory(existing: AlertHistoryEntry[], incoming: AlertHistoryEntry[]): AlertHistoryEntry[] {
  const byId = new Map<string, AlertHistoryEntry>();
  for (const entry of [...incoming, ...existing]) {
    if (!byId.has(entry.id)) byId.set(entry.id, entry);
  }
  return [...byId.values()]
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, MAX_HISTORY_ENTRIES);
}

function isHistoryEntry(value: unknown): value is AlertHistoryEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<AlertHistoryEntry>;
  return typeof entry.id === "string"
    && typeof entry.symbol === "string"
    && typeof entry.name === "string"
    && validStatuses.includes(entry.previousStatus as AlertStatus)
    && validStatuses.includes(entry.newStatus as AlertStatus)
    && typeof entry.changeBps === "number"
    && Number.isFinite(entry.changeBps)
    && typeof entry.timestamp === "string"
    && Number.isFinite(Date.parse(entry.timestamp));
}

export function loadAlertHistory(): AlertHistoryEntry[] {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return appendHistory([], parsed.filter(isHistoryEntry));
  } catch {
    return [];
  }
}

export function saveAlertHistory(history: AlertHistoryEntry[]): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)));
  } catch {
    // Storage may be disabled or full; the in-memory history remains usable.
  }
}
