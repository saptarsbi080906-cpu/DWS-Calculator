import { useState } from "react";

// --- BUILDING COST DATA ---
const buildingData = {
  "Watch Tower":       [900, 1100, 1300, 1550, 1850, 1500, 1600, 1750, 2000, 2250],
  "Fighter Barracks":  [400, 450, 550, 650, 800, 600, 700, 800, 1100, 1500],
  "Shooter Barracks":  [400, 450, 550, 650, 800, 600, 700, 800, 1100, 1500],
  "Rider Barracks":    [400, 450, 550, 650, 800, 600, 700, 800, 1100, 1500],
  "Research Center":   [900, 1100, 1300, 1550, 1850, 1500, 1500, 1800, 2100, 2500],
  "Medical Workshop":  [150, 200, 250, 300, 350, 300, 350, 400, 500, 750],
  "Construction Hall": [250, 300, 400, 450, 550, 450, 500, 600, 650, 750],
  "Radar":             [500, 600, 700, 700, 1050, 750, 900, 1000, 1250, 1500],
  "Training Ground":   [250, 300, 400, 450, 550, 450, 500, 600, 650, 750],
  "Mart":              [250, 300, 400, 450, 550, 450, 500, 600, 650, 750],
  "Military Center":   [1250, 1500, 1800, 2200, 2600, 2000, 2200, 2400, 2900, 3500],
  "Library":           [250, 300, 400, 450, 550, 450, 500, 600, 650, 750],
  "Alliance Plaza":    [150, 200, 200, 250, 300, 250, 300, 350, 500, 650],
  "Reservist Camp":    [750, 900, 1100, 1300, 1550, 1250, 1250, 1500, 1750, 2000],
  "Guild Hall":        [250, 250, 300, 350, 450, 350, 400, 500, 600, 750],
};

// --- INCOME DATA FROM TABLE ---
const incomeData = [
  { source: "Precision Parts Refinery (wildly variable)", daily: 5, inSeason: 35, offSeason: 35, oneTime: null },
  { source: "Radar Missions (slightly variable)", daily: 3, inSeason: 21, offSeason: 21, oneTime: null },
  { source: "Daily Tasks", daily: 20, inSeason: 140, offSeason: 140, oneTime: null },
  { source: "Survival Preparedness", daily: 31, inSeason: 217, offSeason: 217, oneTime: null },
  { source: "Alliance Duel", daily: 20, inSeason: 120, offSeason: 120, oneTime: null },
  { source: "Honor Shop", daily: null, inSeason: 50, offSeason: 50, oneTime: null },
  { source: "MutaBeast Hunt", daily: null, inSeason: 35, offSeason: 35, oneTime: null },
];
const totalInSeason = 618;
const totalOffSeason = 618;

// --- UTILITIES ---
function getPillState(index : number, cur : number, tgt : number) {
  if (index < cur) return "past";
  if (index === cur) return "current";
  if (index > cur && index < tgt) return "range";
  if (index === tgt) return "target";
  return "none";
}

const pillStyles = {
  past:    "bg-light text-secondary opacity-50 border border-light",
  current: "bg-warning bg-opacity-10 border border-warning shadow-sm", 
  range:   "bg-warning bg-opacity-25 border border-warning",
  target:  "bg-warning text-dark border border-warning shadow-sm",
  none:    "bg-white text-secondary border",
};

function Stepper({ value , onDecrement, onIncrement, textColor }) {
  return (
    <div className="d-flex align-items-center bg-light rounded-3 border p-1 border-warning border-opacity-25">
      <button
        onClick={onDecrement}
        className="btn btn-light border bg-white shadow-sm d-flex align-items-center justify-content-center text-dark"
        style={{ width: '40px', height: '36px' }}
        aria-label="Decrease"
      >
        <strong>−</strong>
      </button>
      <span className="flex-grow-1 text-center fs-5 fw-bold" style={{ color: textColor }}>
        {value}
      </span>
      <button
        onClick={onIncrement}
        className="btn btn-light border bg-white shadow-sm d-flex align-items-center justify-content-center text-dark"
        style={{ width: '40px', height: '36px' }}
        aria-label="Increase"
      >
        <strong>+</strong>
      </button>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function PrecisionCalculator() {
  const [selectedBuilding, setSelectedBuilding] = useState("Watch Tower");
  const [cur, setCur] = useState(0);
  const [segment, setSegment] = useState(0);
  const [tgt, setTgt] = useState(5);
  const [inventory, setInventory] = useState(0); 
  const [isSeasonActive, setIsSeasonActive] = useState(true);

  const adjustCur = (delta : number) => {
    const next = Math.max(0, Math.min(10, cur + delta));
    setCur(next);
    setSegment(0); 
    if (next >= tgt) setTgt(Math.min(10, next + 1));
  };

  const adjustSegment = (delta : number) => {
    if (cur >= 10) {
      setSegment(0);
      return;
    }
    setSegment((prev) => Math.max(0, Math.min(5, prev + delta)));
  };

  const adjustTgt = (delta : number) => {
    const next = Math.max(1, Math.min(10, tgt + delta));
    setTgt(next);
    setSegment(0); 
    if (next <= cur) setCur(Math.max(0, next - 1));
  };

  // Math Calculations
  const costs = buildingData[selectedBuilding] ?? [];
  const slice = costs.slice(cur, tgt);
  
  let total = slice.reduce((a, b) => a + b, 0);
  const maxSegments = 5;

  if (slice.length > 0 && segment > 0) {
    const currentLevelCost = costs[cur];
    const segmentDiscount = Math.round((currentLevelCost / maxSegments) * segment);
    total = Math.max(0, total - segmentDiscount);
  }

  const remainingParts = Math.max(0, total - inventory);
  const avg = slice.length > 1 ? Math.round(total / slice.length) : null;
  
  // Dynamic ETA Calculation based on chosen season
  const weeklyIncome = isSeasonActive ? totalInSeason : totalOffSeason;
  const etaWeeks: number = remainingParts > 0 ? Number((remainingParts / weeklyIncome).toFixed(1)) : 0;

  return (
    <div className="min-vh-100 py-5 font-monospace" style={{ backgroundColor: '#fffcf5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="container">
        
        {/* Header Area */}
        <div className="row mb-4">
          <div className="col-12 text-center text-lg-start">
            <h1 className="fw-bold mb-2 d-flex align-items-center justify-content-center justify-content-lg-start gap-2 text-dark">
              <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ width: '48px', height: '48px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}>
                <defs>
                  <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffb74d" />
                    <stop offset="70%" stopColor="#e65100" />
                    <stop offset="100%" stopColor="#bf360c" />
                  </radialGradient>
                  <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fff176" />
                    <stop offset="30%" stopColor="#ffd54f" />
                    <stop offset="80%" stopColor="#ff8f00" />
                    <stop offset="100%" stopColor="#e65100" />
                  </linearGradient>
                  <linearGradient id="silver" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#bdbdbd" />
                    <stop offset="100%" stopColor="#616161" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="56" fill="url(#gold)" />
                <circle cx="60" cy="60" r="48" fill="#3e1a00" /> 
                <circle cx="60" cy="60" r="46" fill="url(#bgGlow)" />
                <path d="M 10 30 L 18 36 L 14 44 Z" fill="url(#gold)" />
                <path d="M 110 30 L 102 36 L 106 44 Z" fill="url(#gold)" />
                <rect x="52" y="110" width="16" height="8" rx="2" fill="url(#gold)" />
                <circle cx="60" cy="60" r="42" fill="none" stroke="url(#silver)" strokeWidth="4" />
                <rect x="56" y="98" width="8" height="8" rx="2" fill="url(#silver)" />
                <circle cx="60" cy="24" r="16" fill="url(#silver)" />
                <circle cx="60" cy="24" r="12" fill="#424242" />
                <circle cx="60" cy="24" r="8" fill="#ffca28" />
                <circle cx="58" cy="21" r="3" fill="#ffffff" /> 
                <rect x="25" y="40" width="70" height="50" rx="6" fill="#4e2000" />
                <rect x="32" y="44" width="56" height="42" rx="4" fill="#ff9800" fillOpacity="0.8" />
                <rect x="18" y="36" width="18" height="58" rx="4" fill="url(#gold)" />
                <rect x="84" y="36" width="18" height="58" rx="4" fill="url(#gold)" />
                <path d="M 18 56 C 10 56, 10 74, 18 74 Z" fill="url(#silver)" />
                <path d="M 102 56 C 110 56, 110 74, 102 74 Z" fill="url(#silver)" />
                <ellipse cx="40" cy="65" rx="4" ry="15" fill="none" stroke="#ffee58" strokeWidth="4" />
                <ellipse cx="50" cy="65" rx="4" ry="15" fill="none" stroke="#ffee58" strokeWidth="4" />
                <ellipse cx="60" cy="65" rx="4" ry="15" fill="none" stroke="#ffee58" strokeWidth="4" />
                <ellipse cx="70" cy="65" rx="4" ry="15" fill="none" stroke="#ffee58" strokeWidth="4" />
                <ellipse cx="80" cy="65" rx="4" ry="15" fill="none" stroke="#ffee58" strokeWidth="4" />
                <rect x="36" y="62" width="48" height="6" fill="#ffffff" fillOpacity="0.7" />
                <circle cx="27" cy="44" r="2" fill="url(#silver)" />
                <circle cx="27" cy="86" r="2" fill="url(#silver)" />
                <circle cx="93" cy="44" r="2" fill="url(#silver)" />
                <circle cx="93" cy="86" r="2" fill="url(#silver)" />
                <rect x="36" y="48" width="48" height="6" rx="3" fill="#ffffff" fillOpacity="0.5" />
              </svg>
              Precision Parts Tracker
            </h1>
            <p className="text-muted">
              Calculate the exact materials required to optimize your building upgrades.
            </p>
          </div>
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="row g-4 mb-4">
          
          {/* Left Column: Controls */}
          <div className="col-lg-7">
            
            {/* Building Selector */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <label className="form-label text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  Select Building Structure
                </label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="form-select form-select-lg bg-light border-0 fw-medium focus-ring focus-ring-warning"
                  style={{ cursor: 'pointer' }}
                >
                  {Object.keys(buildingData).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Level Configuration */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="text-uppercase text-muted fw-bold mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  Upgrade Path
                </h6>

                {/* Visual Pill Indicator */}
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {Array.from({ length: 11 }, (_, i) => {
                    const state = getPillState(i, cur, tgt);
                    const dynamicTextColor = (state === 'current' || state === 'range') ? '#b45309' : undefined;
                    return (
                      <div
                        key={i}
                        title={i === 0 ? "Not started" : `Level ${i}`}
                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${pillStyles[state]}`}
                        style={{ width: '42px', height: '42px', fontSize: '0.875rem', transition: 'all 0.3s ease', userSelect: 'none', color: dynamicTextColor }}
                      >
                        {i === 0 ? "—" : i}
                      </div>
                    );
                  })}
                </div>

                {/* Stepper Controls */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <p className="mb-2 text-muted fw-medium small">Current Level</p>
                    <Stepper value={cur} onDecrement={() => adjustCur(-1)} onIncrement={() => adjustCur(1)} textColor="#d97706" />
                  </div>
                  <div className="col-12 col-md-4">
                    <p className="mb-2 text-muted fw-medium small">Current Segment</p>
                    <Stepper value={segment} onDecrement={() => adjustSegment(-1)} onIncrement={() => adjustSegment(1)} textColor="#b45309" />
                  </div>
                  <div className="col-12 col-md-4">
                    <p className="mb-2 text-muted fw-medium small">Target Level</p>
                    <Stepper value={tgt} onDecrement={() => adjustTgt(-1)} onIncrement={() => adjustTgt(1)} textColor="#f59e0b" />
                  </div>
                </div>

                {/* Inventory Input */}
                <div className="pt-3 border-top border-warning border-opacity-25">
                  <label className="form-label text-uppercase text-muted fw-bold mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Parts in Inventory
                  </label>
                  <div className="input-group input-group-lg shadow-sm rounded-3">
                    <span className="input-group-text bg-white border-warning border-opacity-50 border-end-0">
                      <svg style={{ width: '20px', height: '20px', color: '#f59e0b' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="form-control border-warning border-opacity-50 border-start-0 ps-0 fw-bold focus-ring focus-ring-warning"
                      placeholder="Enter parts you own..."
                      value={inventory === 0 ? "" : inventory}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setInventory(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Breakdown & Results */}
          <div className="col-lg-5 d-flex flex-column gap-4">
            
            {/* Total Summary Card */}
            <div className="card border-0 shadow rounded-4 text-white overflow-hidden" style={{ backgroundImage: 'linear-gradient(135deg, #332701 0%, #140f00 100%)' }}>
              <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-between position-relative">
                <svg className="position-absolute top-0 end-0 text-warning opacity-10" style={{ width: '120px', height: '120px', transform: 'translate(20px, -20px)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>

                <div className="position-relative z-1 mb-4">
                  <h6 className="text-uppercase fw-bold text-white-50 mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Requirement Summary
                  </h6>
                  <p className="small text-white-50 mb-0">
                    Level {cur} <span className="mx-1">&rarr;</span> Level {tgt}
                  </p>
                </div>
                
                <div className="position-relative z-1 d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-end border-bottom border-warning border-opacity-25 pb-2">
                    <span className="text-white-50">Total Base Cost:</span>
                    <span className="fs-5 fw-medium text-light">{total.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-end border-bottom border-warning border-opacity-25 pb-2">
                    <span className="text-white-50">Currently Owned:</span>
                    <span className="fs-5 fw-medium text-warning opacity-75">− {inventory.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-end mt-2">
                    <span className="text-white-50 fw-medium">Still Needed:</span>
                    <span className="display-5 fw-bold text-warning tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {remainingParts.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="card border-0 shadow-sm rounded-4 flex-grow-1">
              <div className="card-body p-4">
                <h6 className="text-uppercase text-muted fw-bold mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  Cost Breakdown
                </h6>

                {slice.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted fw-medium mb-0">No upgrades selected.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {slice.map((cost : number, i : number) => {
                      const from = cur + i;
                      const to = from + 1;
                      const isCurrentDiscountedLevel = i === 0 && segment > 0;
                      const displayCost = isCurrentDiscountedLevel ? cost - Math.round((cost / maxSegments) * segment) : cost;
                      const pct = total > 0 ? Math.min(100, Math.max(0, Math.round((displayCost / total) * 100))) : 0;
                      
                      return (
                        <div key={i}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="small text-muted fw-medium">
                              {from === 0 ? "Start" : `Lvl ${from}`} <span className="mx-1">&rarr;</span> {to}
                            </span>
                            <span className="small fw-bold text-dark">
                              {displayCost.toLocaleString()}
                              {isCurrentDiscountedLevel && <span className="ms-1" style={{fontSize: '0.7rem', color: '#b45309'}}>(Seg. applied)</span>}
                            </span>
                          </div>
                          <div className="progress bg-light" style={{ height: '8px' }}>
                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${pct}%`, transition: 'width 0.5s ease-in-out' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>

        {/* BOTTOM FULL-WIDTH: INCOME & ETA TABLE */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-dark text-white p-4 border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h5 className="fw-bold text-warning mb-1">Free-To-Play Income Strategy</h5>
                  <p className="text-white-50 small mb-0">Based on regular daily & weekly tasks</p>
                </div>
                
                {/* Dynamic ETA Badge */}
                {remainingParts > 0 && (
                  <div className="bg-warning bg-opacity-25 border border-warning rounded-3 px-3 py-2 text-end">
                    <span className="d-block text-white-50 small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em'}}>Estimated Farming Time</span>
                    <span className="fw-bold text-warning fs-5">
                      ~{etaWeeks} Weeks
                    </span>
                  </div>
                )}
              </div>

              {/* Season Toggle */}
              <div className="bg-light p-3 border-bottom d-flex align-items-center justify-content-between">
                <span className="small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>Server State</span>
                <div className="btn-group" role="group">
                  <button 
                    type="button" 
                    className={`btn btn-sm ${isSeasonActive ? 'btn-warning fw-bold' : 'btn-outline-secondary'}`}
                    onClick={() => setIsSeasonActive(true)}
                  >
                    In-Season
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm ${!isSeasonActive ? 'btn-warning fw-bold' : 'btn-outline-secondary'}`}
                    onClick={() => setIsSeasonActive(false)}
                  >
                    Off-Season
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle font-monospace small">
                  <thead className="table-light text-muted">
                    <tr>
                      <th className="py-3 ps-4 border-0">Income Source</th>
                      <th className="py-3 text-center border-0">Daily</th>
                      <th className="py-3 text-center border-0">Weekly (In-Season)</th>
                      <th className="py-3 text-center border-0">Realistic (Off-Season)</th>
                      <th className="py-3 text-center pe-4 border-0">One-Time</th>
                    </tr>
                  </thead>
                  <tbody className="border-top-0">
                    {incomeData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="ps-4 py-3 fw-medium text-dark">{row.source}</td>
                        <td className="text-center py-3 text-muted">{row.daily ?? '-'}</td>
                        <td className={`text-center py-3 ${isSeasonActive ? 'fw-bold text-dark' : 'text-muted'}`}>{row.inSeason ?? '-'}</td>
                        <td className={`text-center py-3 ${!isSeasonActive ? 'fw-bold text-dark' : 'text-muted'}`}>{row.offSeason ?? '-'}</td>
                        <td className="text-center py-3 text-muted pe-4">{row.oneTime ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-light fw-bold fs-6">
                    <tr>
                      <td colSpan="2" className="text-end py-3 text-muted text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.75rem' }}>Total Weekly Income:</td>
                      <td className={`text-center py-3 ${isSeasonActive ? 'text-warning text-shadow-sm' : 'text-muted'}`} style={{ textShadow: isSeasonActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                        {totalInSeason}
                      </td>
                      <td className={`text-center py-3 ${!isSeasonActive ? 'text-warning text-shadow-sm' : 'text-muted'}`} style={{ textShadow: !isSeasonActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                        {totalOffSeason}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}