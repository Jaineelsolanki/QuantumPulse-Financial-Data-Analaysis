import { useEffect, useMemo, useRef, useState } from "react";
import { getInstruments } from "./services/api";
import { classifyStatus, isValidThresholds } from "./alertEngine";
import { AlertHistoryEntry, appendHistory, detectStatusTransitions, loadAlertHistory, saveAlertHistory } from "./alertHistory";
import type { AlertStatus } from "./alertEngine";
import { advanceMarketRows } from "./simulatedMarket";
import { Activity, ArrowUpRight, Bell, ChevronDown, CircleHelp, Command, Download, LayoutDashboard, Search, Settings2, SlidersHorizontal, WalletCards } from "lucide-react";

type Row = {
  symbol: string;
  name: string;
  yield: string;
  change: number;
  volume: string;
  trend: number[];
  changeBps?: number | string | null;
  baseYield?: number;
};
const rows: Row[] = [
  {symbol:"US02Y",name:"US Treasury 2Y",yield:"4.8821",change:0.042,volume:"18.4B",trend:[22,27,24,35,31,42,38,48]},
  {symbol:"US05Y",name:"US Treasury 5Y",yield:"4.9814",change:0.018,volume:"12.8B",trend:[28,24,31,29,36,33,41,44]},
  {symbol:"US10Y",name:"US Treasury 10Y",yield:"5.1528",change:0.067,volume:"26.1B",trend:[18,24,21,32,29,39,35,52]},
  {symbol:"US30Y",name:"US Treasury 30Y",yield:"5.4712",change:-0.012,volume:"9.6B",trend:[42,39,44,34,38,29,33,30]},
  {symbol:"DE10Y",name:"Germany Bund 10Y",yield:"2.6410",change:-0.023,volume:"7.2B",trend:[46,42,45,36,39,31,34,28]},
  {symbol:"UK10Y",name:"UK Gilt 10Y",yield:"4.3820",change:0.031,volume:"5.8B",trend:[21,25,22,34,30,37,35,43]},
  {symbol:"JP10Y",name:"Japan JGB 10Y",yield:"1.1820",change:0.006,volume:"3.1B",trend:[27,29,26,32,31,34,33,36]},
  {symbol:"US01Y",name:"US Treasury 1Y",yield:"4.6510",change:-0.009,volume:"8.9B",trend:[43,39,41,35,37,32,34,31]},
  {symbol:"US03Y",name:"US Treasury 3Y",yield:"4.9210",change:0.026,volume:"11.2B",trend:[20,24,23,31,29,37,34,42]},
  {symbol:"FR10Y",name:"France OAT 10Y",yield:"3.4210",change:-0.014,volume:"4.4B",trend:[44,40,42,35,38,32,34,29]},
  {symbol:"IT10Y",name:"Italy BTP 10Y",yield:"3.8910",change:0.052,volume:"6.7B",trend:[18,22,20,29,26,36,33,45]},
  {symbol:"CA10Y",name:"Canada GoC 10Y",yield:"3.2110",change:0.011,volume:"2.8B",trend:[24,28,26,33,31,37,35,40]}
];
function parseFinite(value: string | number | undefined): number | null {
  if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseVolume(volume: string | undefined): number | null {
  if (typeof volume !== "string") return null;
  const match = volume.trim().match(/^([+-]?(?:\d+\.?\d*|\.\d+))\s*([KMBT])?$/i);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  const multiplier = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[match[2]?.toUpperCase() as "K" | "M" | "B" | "T"] ?? 1;
  return value * multiplier;
}

function formatVolumeBillions(value: number | null): string {
  return value === null ? "—" : (value / 1e9).toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function Spark({values,down}:{values:number[];down:boolean}) {
  const points=values.map((v,i)=>`${i/(values.length-1)*100},${58-v}`).join(" ");
  return <svg className={down?"spark down":"spark"} viewBox="0 0 100 60" preserveAspectRatio="none" aria-label="Illustrative trend"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export default function App() {
  const [query,setQuery]=useState("");
  const [alert,setAlert]=useState(false);
  const [selected,setSelected]=useState("US10Y");
  const [warningThresholdInput, setWarningThresholdInput] = useState("3");
  const [highAlertThresholdInput, setHighAlertThresholdInput] = useState("6");
  const [marketRows, setMarketRows] = useState<Row[]>(rows);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [lastSimulatedUpdate, setLastSimulatedUpdate] = useState<Date | null>(null);
  const [statusChangedSymbols, setStatusChangedSymbols] = useState<string[]>([]);
  const [alertHistory, setAlertHistory] = useState<AlertHistoryEntry[]>(loadAlertHistory);
  const marketRowsRef = useRef(marketRows);
  const updateInProgressRef = useRef(false);
  const thresholdsRef = useRef({ warning: 3, highAlert: 6 });
  const previousStatusesRef = useRef<Record<string, AlertStatus | null> | null>(null);
const warningThreshold = parseFinite(warningThresholdInput);
const highAlertThreshold = parseFinite(highAlertThresholdInput);
const thresholdsValid = isValidThresholds(warningThreshold, highAlertThreshold);
const effectiveWarningThreshold = thresholdsValid && warningThreshold !== null ? warningThreshold : 3;
const effectiveHighAlertThreshold = thresholdsValid && highAlertThreshold !== null ? highAlertThreshold : 6;
thresholdsRef.current = { warning: effectiveWarningThreshold, highAlert: effectiveHighAlertThreshold };
marketRowsRef.current = marketRows;
const thresholdError = "Enter finite, nonnegative thresholds with high alert greater than warning.";
const rowsWithStatus = useMemo(() => marketRows.map((row) => ({
  ...row,
  status: classifyStatus(row.changeBps === undefined ? (Number.isFinite(row.change) ? row.change * 100 : undefined) : row.changeBps, effectiveWarningThreshold, effectiveHighAlertThreshold),
})), [marketRows, effectiveWarningThreshold, effectiveHighAlertThreshold]);
useEffect(() => {
  const currentStatuses = Object.fromEntries(rowsWithStatus.map((row) => [row.symbol, row.status]));
  const previousStatuses = previousStatusesRef.current;
  if (previousStatuses === null) {
    previousStatusesRef.current = currentStatuses;
    return;
  }

  const transitionResult = detectStatusTransitions(previousStatuses, rowsWithStatus);
  previousStatusesRef.current = transitionResult.statuses;
  if (transitionResult.entries.length > 0) {
    setAlertHistory((currentHistory) => appendHistory(currentHistory, transitionResult.entries));
  }
}, [rowsWithStatus]);
useEffect(() => {
  saveAlertHistory(alertHistory);
}, [alertHistory]);
const filtered = useMemo(
  () => rowsWithStatus.filter((r) =>
    (r.symbol + " " + r.name).toLowerCase().includes(query.toLowerCase())
  ),
  [rowsWithStatus, query]
);
const metrics = useMemo(() => {
  const us10y = marketRows.find((row) => row.symbol === "US10Y");
  const us02y = marketRows.find((row) => row.symbol === "US02Y");
  const us10yYield = parseFinite(us10y?.yield);
  const us02yYield = parseFinite(us02y?.yield);
  const us10yChange = parseFinite(us10y?.change);
  const us02yChange = parseFinite(us02y?.change);
  const spread = us10yYield === null || us02yYield === null
    ? null
    : (us10yYield - us02yYield) * 100;
  const spreadChange = us10yChange === null || us02yChange === null
    ? null
    : (us10yChange - us02yChange) * 100;
  const volumes = marketRows.map((row) => parseVolume(row.volume)).filter((value): value is number => value !== null);
  const totalVolume = volumes.length === marketRows.length && volumes.length > 0
    ? volumes.reduce((total, value) => total + value, 0)
    : null;

  return { us10yYield, us02yYield, us10yChange, us02yChange, spread, spreadChange, totalVolume };
}, [marketRows]);
useEffect(() => {
  async function loadInstruments() {
    try {
      setApiLoading(true);

      const instruments = await getInstruments();

      setMarketRows((currentRows) =>
        currentRows.map((row) => {
          const instrument = instruments.find(
            (item) => item.symbol === row.symbol
          );

          if (!instrument) return row;

          return {
            ...row,
            yield: Number.isFinite(instrument.yield_percent) ? instrument.yield_percent.toFixed(4) : row.yield,
            baseYield: Number.isFinite(instrument.yield_percent) ? instrument.yield_percent : parseFinite(row.yield) ?? undefined,
            change: Number.isFinite(instrument.change_bps) ? instrument.change_bps / 100 : Number.NaN,
            changeBps: Number.isFinite(instrument.change_bps) ? instrument.change_bps : null,
          };
        })
      );

      setApiError("");
    } catch (error) {
      console.error(error);
      setApiError("Unable to connect to FastAPI. Showing sample data.");
    } finally {
      setApiLoading(false);
    }
  }

  loadInstruments();
}, []);
useEffect(() => {
  if (apiLoading) return;

  const intervalId = window.setInterval(() => {
    if (updateInProgressRef.current) return;
    updateInProgressRef.current = true;
    try {
      const currentRows = marketRowsRef.current;
      const nextRows = advanceMarketRows(currentRows);
      const changedSymbols = nextRows.flatMap((nextRow, index) => {
        const currentRow = currentRows[index];
        const currentStatus = classifyStatus(
          currentRow.changeBps === undefined ? (Number.isFinite(currentRow.change) ? currentRow.change * 100 : undefined) : currentRow.changeBps,
          thresholdsRef.current.warning,
          thresholdsRef.current.highAlert,
        );
        const nextStatus = classifyStatus(
          nextRow.changeBps === undefined ? (Number.isFinite(nextRow.change) ? nextRow.change * 100 : undefined) : nextRow.changeBps,
          thresholdsRef.current.warning,
          thresholdsRef.current.highAlert,
        );
        return currentStatus !== nextStatus ? [nextRow.symbol] : [];
      });

      marketRowsRef.current = nextRows;
      setMarketRows(nextRows);
      setStatusChangedSymbols(changedSymbols);
      setLastSimulatedUpdate(new Date());
    } finally {
      updateInProgressRef.current = false;
    }
  }, 3000);

  return () => window.clearInterval(intervalId);
}, [apiLoading]);
function clearAlertHistory() {
  if (!window.confirm("Clear all saved alert history? This cannot be undone.")) return;
  setAlertHistory([]);
}
return <main className={alert?"app alert-mode":"app"}>
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><Activity size={19}/></span><span>quantum<span className="light">pulse</span></span></div>
      <div className="section-label">WORKSPACE</div><button className="nav active"><LayoutDashboard/>Market monitor</button><button className="nav"><WalletCards/>Bond watchlist</button><button className="nav"><Activity/>Analytics</button>
      <div className="side-bottom"><button className="nav"><Settings2/>Preferences</button><button className="nav"><CircleHelp/>Help center</button><div className="profile"><span className="avatar">QA</span><div><b>Quant Analyst</b><small>Research desk</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <section className="content"><header className="topbar"><div className="crumb">Markets <i>/</i> Fixed income <i>/</i> Overview</div><div className="top-actions"><span className="market-open"><i/> SIMULATED</span><button className="icon-btn" aria-label="Notifications"><Bell/></button><span className="avatar small">QA</span></div></header>
      <div className="heading"><div><div className="eyebrow">GLOBAL FIXED INCOME</div><h1>Market monitor</h1><p>Cross-market rates and bond performance at a glance.</p></div><div className="actions"><button className="secondary"><Download/>Export</button><button className="primary" onClick={()=>setAlert(!alert)}><Activity/>{alert?"Exit alert view":"Simulate alert"}</button></div></div>
      {alert&&<div className="alert-banner"><span className="alert-dot"/><div><b>HIGH-ALERT SIMULATION</b><p>US 10Y yield movement is highlighted. Secondary context is dimmed in this prototype state.</p></div><span className="demo">DEMO STATE</span></div>}
      <div className="simulation-notice" role="status"><span><b>SIMULATED</b> Illustrative values update every 3 seconds. Not live market data.</span><span>Last update: {lastSimulatedUpdate ? lastSimulatedUpdate.toLocaleTimeString() : "Waiting for first update"}</span></div>
      {apiLoading && (
  <div className="api-message">
    Connecting to QuantumPulse API...
  </div>
)}

{apiError && (
  <div className="api-message">
    {apiError}
  </div>
)}

{!apiLoading && !apiError && (
  <div className="api-message">
    API Connected · 4 instruments received · Mock data
  </div>
)}
      <section className="alert-settings" aria-labelledby="alert-settings-title">
        <div className="alert-settings-copy">
          <div className="eyebrow">PROTOTYPE ALERT RULES</div>
          <h2 id="alert-settings-title">Change thresholds</h2>
          <p>Classify by absolute change in basis points. Demonstration thresholds only, not financial recommendations.</p>
        </div>
        <div className="threshold-controls">
          <label>Warning threshold (bps)<input type="number" min="0" step="0.1" value={warningThresholdInput} aria-invalid={!thresholdsValid} onChange={(event) => setWarningThresholdInput(event.target.value)} /></label>
          <label>High-alert threshold (bps)<input type="number" min="0" step="0.1" value={highAlertThresholdInput} aria-invalid={!thresholdsValid} onChange={(event) => setHighAlertThresholdInput(event.target.value)} /></label>
          {!thresholdsValid && <p className="threshold-error" role="alert">{thresholdError}</p>}
        </div>
        <div className="threshold-legend" aria-label="Status thresholds">
          <span className="status normal">NORMAL &lt; {effectiveWarningThreshold} bps</span>
          <span className="status warning">WARNING {effectiveWarningThreshold}–&lt;{effectiveHighAlertThreshold} bps</span>
          <span className="status high-alert">HIGH ALERT ≥ {effectiveHighAlertThreshold} bps</span>
        </div>
      </section>
      <section className="metrics">
        <article><label>US 10Y YIELD</label><strong>{metrics.us10yYield === null ? "—" : metrics.us10yYield.toFixed(4)}{metrics.us10yYield !== null && <span>%</span>}</strong><small className={metrics.us10yChange !== null && metrics.us10yChange < 0 ? "down-text" : "up"}>{metrics.us10yChange === null ? "—" : `${metrics.us10yChange >= 0 ? "↗ +" : "↘ "}${(metrics.us10yChange * 100).toFixed(1)} bps`} {metrics.us10yChange !== null && <i>today</i>}</small></article>
        <article><label>US 2Y YIELD</label><strong>{metrics.us02yYield === null ? "—" : metrics.us02yYield.toFixed(4)}{metrics.us02yYield !== null && <span>%</span>}</strong><small className={metrics.us02yChange !== null && metrics.us02yChange < 0 ? "down-text" : "up"}>{metrics.us02yChange === null ? "—" : `${metrics.us02yChange >= 0 ? "↗ +" : "↘ "}${(metrics.us02yChange * 100).toFixed(1)} bps`} {metrics.us02yChange !== null && <i>today</i>}</small></article>
        <article><label>2s10s SPREAD</label><strong>{metrics.spread === null ? "—" : `${metrics.spread >= 0 ? "+" : ""}${metrics.spread.toFixed(2)}`}{metrics.spread !== null && <span> bps</span>}</strong><small>{metrics.spreadChange === null ? "—" : metrics.spreadChange > 0 ? "Steepening" : metrics.spreadChange < 0 ? "Flattening" : "Unchanged"} {metrics.spreadChange !== null && <i>today</i>}</small></article>
        <article><label>WATCHLIST VOLUME</label><strong>{formatVolumeBillions(metrics.totalVolume)}{metrics.totalVolume !== null && <span>B</span>}</strong><small>{marketRows.length} instruments <i>tracked</i></small></article>
      </section>
      <section className="alert-history panel" aria-labelledby="alert-history-title">
        <div className="alert-history-head">
          <div><div className="eyebrow">SIMULATED STATUS TRANSITIONS</div><h2 id="alert-history-title">Alert history <span>{alertHistory.length}</span></h2></div>
          <button className="secondary" onClick={clearAlertHistory} disabled={alertHistory.length === 0}>Clear history</button>
        </div>
        {alertHistory.length === 0 ? (
          <div className="alert-history-empty">No status transitions recorded yet. This history uses simulated market values.</div>
        ) : (
          <ol className="alert-history-list">
            {alertHistory.map((entry) => (
              <li key={entry.id}>
                <div className="history-instrument"><b>{entry.symbol}</b><span>{entry.name}</span></div>
                <div className="history-transition">
                  <span className={`status ${entry.previousStatus}`}>{entry.previousStatus === "high-alert" ? "HIGH ALERT" : entry.previousStatus.toUpperCase()}</span>
                  <span aria-hidden="true">→</span>
                  <span className={`status ${entry.newStatus}`}>{entry.newStatus === "high-alert" ? "HIGH ALERT" : entry.newStatus.toUpperCase()}</span>
                </div>
                <span className="history-change">{entry.changeBps >= 0 ? "+" : ""}{entry.changeBps.toFixed(2)} bps</span>
                <time dateTime={entry.timestamp}>{new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" })}</time>
              </li>
            ))}
          </ol>
        )}
      </section>
      <section className="panel"><div className="panel-head"><div><div className="eyebrow">SIMULATED MARKET OVERVIEW</div><h2>Rates watchlist <span>12</span></h2></div><div className="table-tools"><label className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search instruments"/></label><button className="icon-btn" aria-label="Filter"><SlidersHorizontal/></button><button className="icon-btn" aria-label="Commands"><Command/></button></div></div>
        <div className="table-scroll"><table><thead><tr><th>INSTRUMENT</th><th>LAST YIELD</th><th>CHANGE</th><th>VOLUME</th><th>INTRADAY TREND</th><th>STATUS</th></tr></thead><tbody>{filtered.map(r=><tr key={r.symbol} onClick={()=>setSelected(r.symbol)} className={`${selected===r.symbol?"selected":""}${statusChangedSymbols.includes(r.symbol)?" status-changed":""}`}><td><b className="symbol">{r.symbol}</b><span className="name">{r.name}</span></td><td className="num">{r.yield}%</td><td className={r.change>=0?"num up":"num down-text"}>{Number.isFinite(r.change) ? `${r.change>=0?"+":""}${r.change.toFixed(3)}%` : "—"}</td><td className="num muted">{r.volume}</td><td><div className="spark-wrap"><Spark values={r.trend} down={r.change<0}/></div></td>
        <td>
  <span className={`status ${r.status || "unavailable"}${statusChangedSymbols.includes(r.symbol)?" status-changed":""}`}>
    {r.status ? (r.status === "high-alert" ? "HIGH ALERT" : r.status.toUpperCase()) : "UNAVAILABLE"}
  </span>
</td>
</tr>
)}</tbody></table>{!filtered.length&&<div className="empty">No instruments match your search.</div>}</div>
        <div className="table-foot"><span>Showing {filtered.length} of 12 instruments</span><span>Click a row to focus · Sample data only</span></div>
      </section><footer className="foot"><span><i/> Prototype environment</span><span>Illustrative mock data — not live market prices.</span><span>Sample session</span></footer>
    </section>
  </main>;
}
