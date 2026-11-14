export type SimulatedMarketRow = {
  yield: string;
  change: number;
  changeBps?: number | string | null;
  baseYield?: number;
  volume: string;
  trend: number[];
};

function finiteNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function volumeInBillions(volume: string): number | null {
  const match = volume.trim().match(/^([+-]?(?:\d+\.?\d*|\.\d+))\s*([KMBT])?$/i);
  if (!match) return null;
  const multiplier = { K: 1e-6, M: 1e-3, B: 1, T: 1e3 }[match[2]?.toUpperCase() as "K" | "M" | "B" | "T"] ?? 1e-9;
  const result = Number(match[1]) * multiplier;
  return Number.isFinite(result) ? result : null;
}

export function advanceMarketRows<T extends SimulatedMarketRow>(rows: T[], random: () => number = Math.random): T[] {
  return rows.map((row) => {
    const currentYield = finiteNumber(row.yield);
    const parsedChange = finiteNumber(row.change);
    const currentChangeBps = row.changeBps === undefined
      ? parsedChange === null ? null : parsedChange * 100
      : finiteNumber(row.changeBps);
    if (currentYield === null || currentChangeBps === null) return row;

    const baseYield = finiteNumber(row.baseYield) ?? currentYield;
    const yieldStep = (random() - 0.5) * 0.01;
    const nextYield = Math.min(baseYield + 0.08, Math.max(baseYield - 0.08, currentYield + yieldStep));
    const nextChangeBps = Math.min(10, Math.max(-10, currentChangeBps + (random() - 0.5) * 1.2));
    const currentVolume = volumeInBillions(row.volume);
    const nextVolume = currentVolume === null ? row.volume : `${(currentVolume + 0.005 + random() * 0.01).toFixed(3)}B`;
    const nextTrend = row.trend.length === 0 ? row.trend : [
      ...row.trend.slice(1),
      Math.min(50, Math.max(8, row.trend[row.trend.length - 1] + (yieldStep >= 0 ? 1 : -1) + (random() - 0.5) * 2)),
    ];

    return {
      ...row,
      baseYield,
      yield: nextYield.toFixed(4),
      change: nextChangeBps / 100,
      changeBps: nextChangeBps,
      volume: nextVolume,
      trend: nextTrend,
    };
  });
}
