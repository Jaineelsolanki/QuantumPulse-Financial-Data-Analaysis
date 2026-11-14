export type AlertStatus = "normal" | "warning" | "high-alert";

export function isValidThresholds(warningThreshold: number | null, highAlertThreshold: number | null): boolean {
  return warningThreshold !== null && highAlertThreshold !== null
    && Number.isFinite(warningThreshold) && Number.isFinite(highAlertThreshold)
    && warningThreshold >= 0 && highAlertThreshold > warningThreshold;
}

export function classifyStatus(
  changeBps: number | string | null | undefined,
  warningThreshold: number,
  highAlertThreshold: number,
): AlertStatus | null {
  if (changeBps === undefined || changeBps === null || (typeof changeBps === "string" && changeBps.trim() === "")) return null;
  const parsedChange = typeof changeBps === "number" ? changeBps : Number(changeBps);
  if (!Number.isFinite(parsedChange)) return null;

  const absoluteChange = Math.abs(parsedChange);
  if (absoluteChange >= highAlertThreshold) return "high-alert";
  if (absoluteChange >= warningThreshold) return "warning";
  return "normal";
}
