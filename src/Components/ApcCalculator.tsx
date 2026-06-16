import React, { useState } from "react";

// --- DATA ---
const apcData = [
  { level: 1, alloys: 15, blueprints: 0 }, { level: 2, alloys: 40, blueprints: 0 }, { level: 3, alloys: 70, blueprints: 0 },
  { level: 4, alloys: 90, blueprints: 0 }, { level: 5, alloys: 0, blueprints: 40 }, { level: 6, alloys: 0, blueprints: 50 },
  { level: 7, alloys: 0, blueprints: 60 }, { level: 8, alloys: 0, blueprints: 70 }, { level: 9, alloys: 60, blueprints: 30 },
  { level: 10, alloys: 80, blueprints: 40 }, { level: 11, alloys: 100, blueprints: 50 }, { level: 12, alloys: 110, blueprints: 55 },
  { level: 13, alloys: 130, blueprints: 65 }, { level: 14, alloys: 160, blueprints: 80 }, { level: 15, alloys: 220, blueprints: 40 },
  { level: 16, alloys: 230, blueprints: 40 }, { level: 17, alloys: 250, blueprints: 45 }, { level: 18, alloys: 260, blueprints: 45 },
  { level: 19, alloys: 280, blueprints: 50 }, { level: 20, alloys: 300, blueprints: 50 }, { level: 21, alloys: 320, blueprints: 55 },
  { level: 22, alloys: 340, blueprints: 55 }, { level: 23, alloys: 360, blueprints: 60 }, { level: 24, alloys: 430, blueprints: 70 },
  { level: 25, alloys: 460, blueprints: 80 }, { level: 26, alloys: 500, blueprints: 90 }, { level: 27, alloys: 520, blueprints: 100 },
  { level: 28, alloys: 540, blueprints: 110 }, { level: 29, alloys: 560, blueprints: 120 }, { level: 30, alloys: 580, blueprints: 130 },
  { level: 31, alloys: 600, blueprints: 140 }, { level: 32, alloys: 620, blueprints: 150 }, { level: 33, alloys: 640, blueprints: 160 },
  { level: 34, alloys: 660, blueprints: 170 }, { level: 35, alloys: 680, blueprints: 180 }, { level: 36, alloys: 700, blueprints: 190 },
  { level: 37, alloys: 720, blueprints: 200 }, { level: 38, alloys: 740, blueprints: 210 }, { level: 39, alloys: 760, blueprints: 220 },
  { level: 40, alloys: 780, blueprints: 230 }, { level: 41, alloys: 800, blueprints: 240 }, { level: 42, alloys: 820, blueprints: 250 },
  { level: 43, alloys: 840, blueprints: 260 }, { level: 44, alloys: 860, blueprints: 270 }, { level: 45, alloys: 880, blueprints: 280 },
  { level: 46, alloys: 900, blueprints: 290 }, { level: 47, alloys: 920, blueprints: 300 }, { level: 48, alloys: 940, blueprints: 310 },
  { level: 49, alloys: 960, blueprints: 320 }, { level: 50, alloys: 980, blueprints: 330 }, { level: 51, alloys: 1000, blueprints: 340 },
  { level: 52, alloys: 1020, blueprints: 350 }, { level: 53, alloys: 1040, blueprints: 360 }, { level: 54, alloys: 1060, blueprints: 370 },
  { level: 55, alloys: 1080, blueprints: 380 }, { level: 56, alloys: 1100, blueprints: 390 }, { level: 57, alloys: 1120, blueprints: 400 },
  { level: 58, alloys: 1140, blueprints: 410 }, { level: 59, alloys: 1160, blueprints: 420 }, { level: 60, alloys: 1180, blueprints: 430 },
  { level: 61, alloys: 1200, blueprints: 440 }, { level: 62, alloys: 1220, blueprints: 450 }, { level: 63, alloys: 1240, blueprints: 460 },
  { level: 64, alloys: 1260, blueprints: 470 }, { level: 65, alloys: 1280, blueprints: 480 }, { level: 66, alloys: 1300, blueprints: 490 },
];

const MAX_APC_LEVEL = 66;
const generateFullGearData = () => {
  const data = [];
  
  // This helper maps levels to their gear requirements based on your table's progression
  const getGearForLevel = (lvl : number) => {
    if (lvl <= 9) return { gears: [35, 35, 40, 40, 40, 45, 45, 45, 50][lvl-1], upg: 3 };
    if (lvl <= 19) return { gears: [95, 95, 95, 110, 110, 110, 120, 120, 120, 135][lvl-10], upg: 5 };
    if (lvl <= 28) return { gears: [145, 145, 145, 165, 165, 165, 185, 185, 185][lvl-20], upg: 7 };
    if (lvl <= 39) return { gears: [185, 185, 185, 185, 185, 210, 210, 210, 235, 235, 235][lvl-29], upg: 9 };
    // Progression continues with incremental logic for higher tiers:
    const base = 250 + Math.floor((lvl - 40) / 5) * 30;
    const upg = 11 + Math.floor((lvl - 40) / 10) * 2;
    return { gears: base, upg: upg };
  };

  for (let i = 1; i <= 400; i++) {
    const stats = getGearForLevel(i);
    data.push({ 
      level: i, 
      gears: stats.gears, 
      upgrades: stats.upg, 
      total: stats.gears * stats.upg 
    });
  }
  return data;
};

const gearData = generateFullGearData();

const APC_PARTS = [
  { value: "Weapon", label: "Weapon System" },
  { value: "Armor", label: "Hull Armor" },
  { value: "Engine", label: "Engine Core" },
  { value: "Tires", label: "Suspension / Tires" },
];

// ── Stepper ────────────────────────────────────────────────────────────────
interface StepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function Stepper({ value, onDecrement, onIncrement }: StepperProps) {
  return (
    <div className="d-flex align-items-center bg-light rounded-3 border p-1 border-primary border-opacity-25">
      <button
        onClick={onDecrement}
        className="btn btn-light border shadow-sm"
        style={{ width: "40px" }}
      >
        <strong>−</strong>
      </button>
      <span className="flex-grow-1 text-center fs-5 fw-bold text-primary">
        {value}
      </span>
      <button
        onClick={onIncrement}
        className="btn btn-light border shadow-sm"
        style={{ width: "40px" }}
      >
        <strong>+</strong>
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ApcCalculator() {
  const [activeTab, setActiveTab] = useState<"apc" | "gear">("apc");

  // APC state
  const [selectedPart, setSelectedPart] = useState("Weapon");
  const [cur, setCur] = useState(0);
  const [tgt, setTgt] = useState(10);
  const [alloyInventory, setAlloyInventory] = useState(0);
  const [dbInventory, setDbInventory] = useState(0);

  // Gear state
  const [gearCur, setGearCur] = useState(1);
  const [gearTgt, setGearTgt] = useState(10);

  // ── APC derived values ───────────────────────────────────────────────────
  const slice = apcData.slice(cur, tgt);
  const totalAlloys = slice.reduce((s, d) => s + d.alloys, 0);
  const totalDBs = slice.reduce((s, d) => s + d.blueprints, 0);
  const remainingAlloys = Math.max(0, totalAlloys - alloyInventory);
  const remainingDBs = Math.max(0, totalDBs - dbInventory);
  const journeyProgress = Math.round((cur / MAX_APC_LEVEL) * 100);

  // ── APC level adjusters ──────────────────────────────────────────────────
  function adjustCur(delta: number) {
    setCur((prev) => {
      const next = Math.max(0, Math.min(prev + delta, MAX_APC_LEVEL));
      if (next >= tgt) setTgt(Math.min(next + 1, MAX_APC_LEVEL));
      return next;
    });
  }

  function adjustTgt(delta: number) {
    setTgt((prev) => {
      const next = Math.max(1, Math.min(prev + delta, MAX_APC_LEVEL));
      if (next <= cur) setCur(Math.max(next - 1, 0));
      return next;
    });
  }

  // ── Gear derived values ──────────────────────────────────────────────────
  const safeGearCur = Math.max(1, Math.min(gearCur, 400));
  const safeGearTgt = Math.max(safeGearCur, Math.min(gearTgt, 400));
  const gearSlice = gearData.slice(safeGearCur - 1, safeGearTgt);
  const totalGears = gearSlice.reduce((s, d) => s + d.gears, 0);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-vh-100 py-5"
      style={{ backgroundColor: "#f0f4f8", fontFamily: "system-ui, sans-serif" }}
    >
      <div className="container">
        {/* Tab Switcher */}
        <div className="btn-group d-flex justify-content-center mb-5 shadow-sm">
          <button
            className={`btn ${activeTab === "apc" ? "btn-primary" : "btn-light border"}`}
            onClick={() => setActiveTab("apc")}
          >
            APC Parts
          </button>
          <button
            className={`btn ${activeTab === "gear" ? "btn-primary" : "btn-light border"}`}
            onClick={() => setActiveTab("gear")}
          >
            Gear Leveling
          </button>
        </div>

        {/* ── APC Tab ─────────────────────────────────────────────────── */}
        {activeTab === "apc" && (
          <div>
            {/* Header */}
            <div className="row mb-4">
              <div className="col-12 text-center text-lg-start">
                <h1 className="fw-bold mb-2 d-flex align-items-center justify-content-center justify-content-lg-start gap-2 text-dark">
                  <svg
                    viewBox="0 0 120 120"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: "48px",
                      height: "48px",
                      filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
                    }}
                  >
                    <defs>
                      <linearGradient id="blueprintBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#1e40af" />
                      </linearGradient>
                      <linearGradient id="steelMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="56" fill="url(#blueprintBg)" stroke="url(#steelMetal)" strokeWidth="4" />
                    <path d="M 20 0 L 20 120 M 40 0 L 40 120 M 60 0 L 60 120 M 80 0 L 80 120 M 100 0 L 100 120" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <path d="M 0 20 L 120 20 M 0 40 L 120 40 M 0 60 L 120 60 M 0 80 L 120 80 M 0 100 L 120 100" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <circle cx="60" cy="60" r="30" fill="none" stroke="url(#steelMetal)" strokeWidth="8" strokeDasharray="10 6" />
                    <circle cx="60" cy="60" r="18" fill="url(#steelMetal)" />
                    <circle cx="60" cy="60" r="6" fill="#0f172a" />
                  </svg>
                  APC Parts Calculator
                </h1>
                <p className="text-muted">
                  Plan your Alloys and Design Blueprints across {MAX_APC_LEVEL} upgrade levels.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* ── Left Column ── */}
              <div className="col-lg-7">

                {/* Part Selector */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                  <div className="card-body p-4">
                    <label
                      className="form-label text-uppercase text-muted fw-bold"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                    >
                      Select APC Component
                    </label>
                    <select
                      value={selectedPart}
                      onChange={(e) => setSelectedPart(e.target.value)}
                      className="form-select form-select-lg bg-light border-0 fw-medium"
                      style={{ cursor: "pointer" }}
                    >
                      {APC_PARTS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Level Configuration */}
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <h6
                      className="text-uppercase text-muted fw-bold mb-3"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                    >
                      Upgrade Path
                    </h6>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between small text-muted fw-bold mb-1">
                        <span>Lvl 0</span>
                        <span className="text-primary">Current: {cur}</span>
                        <span>Max Lvl {MAX_APC_LEVEL}</span>
                      </div>
                      <div className="progress bg-light" style={{ height: "12px" }}>
                        <div
                          className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                          style={{ width: `${journeyProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Steppers */}
                    <div className="row g-3 mb-4">
                      <div className="col-12 col-sm-6">
                        <p className="mb-2 text-muted fw-medium small">Current Level</p>
                        <Stepper
                          value={cur}
                          onDecrement={() => adjustCur(-1)}
                          onIncrement={() => adjustCur(1)}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <p className="mb-2 text-muted fw-medium small">Target Level</p>
                        <Stepper
                          value={tgt}
                          onDecrement={() => adjustTgt(-1)}
                          onIncrement={() => adjustTgt(1)}
                        />
                      </div>
                    </div>

                    {/* Inventory Inputs */}
                    <div className="pt-3 border-top border-primary border-opacity-25 row g-3">
                      <div className="col-12 col-md-6">
                        <label
                          className="form-label text-uppercase text-muted fw-bold mb-2"
                          style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                        >
                          Alloy Inventory
                        </label>
                        <div className="input-group input-group-lg shadow-sm rounded-3">
                          <span className="input-group-text bg-white border-secondary border-opacity-25 border-end-0">
                            🛡️
                          </span>
                          <input
                            type="number"
                            min="0"
                            className="form-control border-secondary border-opacity-25 border-start-0 ps-0 fw-bold"
                            placeholder="Owned Alloys..."
                            value={alloyInventory === 0 ? "" : alloyInventory}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setAlloyInventory(isNaN(val) ? 0 : Math.max(0, val));
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <label
                          className="form-label text-uppercase text-muted fw-bold mb-2"
                          style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                        >
                          Blueprint Inventory
                        </label>
                        <div className="input-group input-group-lg shadow-sm rounded-3">
                          <span className="input-group-text bg-white border-primary border-opacity-25 border-end-0">
                            📄
                          </span>
                          <input
                            type="number"
                            min="0"
                            className="form-control border-primary border-opacity-25 border-start-0 ps-0 fw-bold"
                            placeholder="Owned DBs..."
                            value={dbInventory === 0 ? "" : dbInventory}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setDbInventory(isNaN(val) ? 0 : Math.max(0, val));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right Column ── */}
              <div className="col-lg-5 d-flex flex-column gap-4">

                {/* Summary Card */}
                <div
                  className="card border-0 shadow rounded-4 text-white overflow-hidden"
                  style={{ backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
                >
                  <div className="card-body p-4 p-lg-5 d-flex flex-column justify-content-between position-relative">
                    {/* BG decoration */}
                    <svg
                      className="position-absolute top-0 end-0 text-white opacity-10"
                      style={{ width: "120px", height: "120px", transform: "translate(20px, -20px)" }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>

                    <div className="position-relative z-1 mb-4">
                      <h6
                        className="text-uppercase fw-bold text-white-50 mb-1"
                        style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                      >
                        Requirement Summary
                      </h6>
                      <p className="small text-white-50 mb-0">
                        {selectedPart} &mdash; Level {cur} &rarr; Level {tgt}
                      </p>
                    </div>

                    {/* Alloys block */}
                    <div className="position-relative z-1 d-flex flex-column gap-2 mb-4 bg-dark bg-opacity-25 p-3 rounded-3 border border-white border-opacity-10">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-white-50 small text-uppercase">🛡️ Alloys Base:</span>
                        <span className="fw-medium">{totalAlloys.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-white border-opacity-10">
                        <span className="text-white-50 small text-uppercase">Inventory:</span>
                        <span className="fw-medium text-secondary opacity-75">
                          − {alloyInventory.toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white-50 fw-medium">Alloys Needed:</span>
                        <span
                          className="fs-4 fw-bold"
                          style={{ color: remainingAlloys === 0 ? "#4ade80" : "#fff" }}
                        >
                          {remainingAlloys.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Blueprints block */}
                    <div className="position-relative z-1 d-flex flex-column gap-2 bg-primary bg-opacity-25 p-3 rounded-3 border border-info border-opacity-25">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-white-50 small text-uppercase">📄 DB Base:</span>
                        <span className="fw-medium">{totalDBs.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-info border-opacity-25">
                        <span className="text-white-50 small text-uppercase">Inventory:</span>
                        <span className="fw-medium text-info opacity-75">
                          − {dbInventory.toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-white-50 fw-medium">DBs Needed:</span>
                        <span
                          className="fs-4 fw-bold"
                          style={{
                            color: remainingDBs === 0 ? "#4ade80" : "#67e8f9",
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          {remainingDBs.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Card */}
                <div className="card border-0 shadow-sm rounded-4 flex-grow-1 mb-5">
                  <div className="card-body p-4">
                    <h6
                      className="text-uppercase text-muted fw-bold mb-4"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
                    >
                      Level Cost Breakdown
                    </h6>

                    {slice.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted fw-medium mb-0">No upgrades selected.</p>
                      </div>
                    ) : (
                      <div
                        className="d-flex flex-column gap-3"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      >
                        {slice.map((data, i) => {
                          const from = cur + i;
                          const to = from + 1;
                          return (
                            <div key={i} className="border-bottom pb-2">
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <span className="small text-dark fw-bold">
                                  Lvl {from} <span className="mx-1 text-muted">&rarr;</span> {to}
                                </span>
                              </div>
                              <div className="d-flex gap-3 small">
                                {data.alloys > 0 && (
                                  <span className="text-secondary fw-medium">
                                    🛡️ {data.alloys.toLocaleString()} Alloys
                                  </span>
                                )}
                                {data.blueprints > 0 && (
                                  <span className="text-primary fw-medium">
                                    📄 {data.blueprints.toLocaleString()} DBs
                                  </span>
                                )}
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
          </div>
        )}

        {/* ── Gear Tab ────────────────────────────────────────────────── */}
        {activeTab === "gear" && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold text-primary mb-4">Gear Leveling Calculator</h4>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="small fw-bold text-muted d-block mb-1">CURRENT LEVEL</label>
                    <input
                      type="number"
                      min={1}
                      max={400}
                      className="form-control form-control-lg"
                      value={gearCur}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(400, Number(e.target.value)));
                        setGearCur(val);
                        if (val >= gearTgt) setGearTgt(Math.min(val + 1, 400));
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <label className="small fw-bold text-muted d-block mb-1">TARGET LEVEL</label>
                    <input
                      type="number"
                      min={1}
                      max={400}
                      className="form-control form-control-lg"
                      value={gearTgt}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(400, Number(e.target.value)));
                        setGearTgt(val);
                        if (val <= gearCur) setGearCur(Math.max(val - 1, 1));
                      }}
                    />
                  </div>
                </div>

                {/* Gear breakdown preview */}
                <div className="mt-4">
                  <p className="small text-muted fw-bold text-uppercase mb-2">
                    Gears per level (first 10)
                  </p>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {gearSlice.slice(0, 10).map((d, i) => (
                      <div
                        key={i}
                        className="d-flex justify-content-between border-bottom pb-1 mb-1 small"
                      >
                        <span className="text-muted">
                          Lvl {safeGearCur + i} &rarr; {safeGearCur + i + 1}
                        </span>
                        <span className="fw-bold text-primary">⚙️ {d.gears}</span>
                      </div>
                    ))}
                    {gearSlice.length > 10 && (
                      <p className="small text-muted text-center mt-1 mb-0">
                        + {gearSlice.length - 10} more levels…
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className="card border-0 shadow rounded-4 text-white p-4 h-100 d-flex flex-column justify-content-center"
                style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
              >
                <p className="text-white-50 text-uppercase fw-bold mb-1" style={{ fontSize: "0.75rem" }}>
                  Total Gears Required
                </p>
                <div className="display-4 fw-bold mb-3">{totalGears.toLocaleString()}</div>
                <p className="text-white-50 small mb-0">
                  ⚙️ From level {safeGearCur} to {safeGearTgt} ({gearSlice.length} upgrades)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}