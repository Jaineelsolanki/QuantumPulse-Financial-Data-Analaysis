import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, Bell, ChevronDown, CircleHelp, Command, Download, LayoutDashboard, Search, Settings2, SlidersHorizontal, WalletCards } from "lucide-react";

type Row = { symbol: string; name: string; yield: string; change: number; volume: string; trend: number[] };
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
function Spark({values,down}:{values:number[];down:boolean}) {
  const points=values.map((v,i)=>`${i/(values.length-1)*100},${58-v}`).join(" ");
  return <svg className={down?"spark down":"spark"} viewBox="0 0 100 60" preserveAspectRatio="none" aria-label="Illustrative trend"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
export default function App() {
  const [query,setQuery]=useState(""); const [alert,setAlert]=useState(false); const [selected,setSelected]=useState("US10Y");
  const filtered=useMemo(()=>rows.filter(r=>(r.symbol+" "+r.name).toLowerCase().includes(query.toLowerCase())),[query]);
  return <main className={alert?"app alert-mode":"app"}>
    <aside className="sidebar"><div className="brand"><span className="brand-mark"><Activity size={19}/></span><span>quantum<span className="light">pulse</span></span></div>
      <div className="section-label">WORKSPACE</div><button className="nav active"><LayoutDashboard/>Market monitor</button><button className="nav"><WalletCards/>Bond watchlist</button><button className="nav"><Activity/>Analytics</button>
      <div className="side-bottom"><button className="nav"><Settings2/>Preferences</button><button className="nav"><CircleHelp/>Help center</button><div className="profile"><span className="avatar">QA</span><div><b>Quant Analyst</b><small>Research desk</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <section className="content"><header className="topbar"><div className="crumb">Markets <i>/</i> Fixed income <i>/</i> Overview</div><div className="top-actions"><span className="market-open"><i/> MARKET OPEN</span><button className="icon-btn" aria-label="Notifications"><Bell/></button><span className="avatar small">QA</span></div></header>
      <div className="heading"><div><div className="eyebrow">GLOBAL FIXED INCOME</div><h1>Market monitor</h1><p>Cross-market rates and bond performance at a glance.</p></div><div className="actions"><button className="secondary"><Download/>Export</button><button className="primary" onClick={()=>setAlert(!alert)}><Activity/>{alert?"Exit alert view":"Simulate alert"}</button></div></div>
      {alert&&<div className="alert-banner"><span className="alert-dot"/><div><b>HIGH-ALERT SIMULATION</b><p>US 10Y yield movement is highlighted. Secondary context is dimmed in this prototype state.</p></div><span className="demo">DEMO STATE</span></div>}
      <section className="metrics">
        <article><label>US 10Y YIELD</label><strong>5.1528<span>%</span></strong><small className="up">↗ +6.7 bps <i>today</i></small></article>
        <article><label>US 2Y YIELD</label><strong>4.8821<span>%</span></strong><small className="up">↗ +4.2 bps <i>today</i></small></article>
        <article><label>2s10s SPREAD</label><strong>+27.07<span> bps</span></strong><small className="up">Steepening <i>today</i></small></article>
        <article><label>WATCHLIST VOLUME</label><strong>116.8<span>B</span></strong><small>12 instruments <i>tracked</i></small></article>
      </section>
      <section className="panel"><div className="panel-head"><div><div className="eyebrow">LIVE-STYLE OVERVIEW</div><h2>Rates watchlist <span>12</span></h2></div><div className="table-tools"><label className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search instruments"/></label><button className="icon-btn" aria-label="Filter"><SlidersHorizontal/></button><button className="icon-btn" aria-label="Commands"><Command/></button></div></div>
        <div className="table-scroll"><table><thead><tr><th>INSTRUMENT</th><th>LAST YIELD</th><th>CHANGE</th><th>VOLUME</th><th>INTRADAY TREND</th><th>STATUS</th></tr></thead><tbody>{filtered.map(r=><tr key={r.symbol} onClick={()=>setSelected(r.symbol)} className={selected===r.symbol?"selected":""}><td><b className="symbol">{r.symbol}</b><span className="name">{r.name}</span></td><td className="num">{r.yield}%</td><td className={r.change>=0?"num up":"num down-text"}>{r.change>=0?"+":""}{r.change.toFixed(3)}%</td><td className="num muted">{r.volume}</td><td><div className="spark-wrap"><Spark values={r.trend} down={r.change<0}/></div></td><td><span className={Math.abs(r.change)>=.04?"status watch":"status normal"}>{Math.abs(r.change)>=.04?"WATCH":"NORMAL"}</span></td></tr>)}</tbody></table>{!filtered.length&&<div className="empty">No instruments match your search.</div>}</div>
        <div className="table-foot"><span>Showing {filtered.length} of 12 instruments</span><span>Click a row to focus · Sample data only</span></div>
      </section><footer className="foot"><span><i/> Prototype environment</span><span>Illustrative mock data — not live market prices.</span><span>Sample session</span></footer>
    </section>
  </main>;
}
