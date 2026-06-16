import React from 'react';
// We are bringing BrowserRouter back here to guarantee it wraps the Links!
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'; 
import PrecisionCalculator from './Components/PrecisionCalculator';
import ApcCalculator from './Components/ApcCalculator';

// Quick shell components for your other tabs
const GoldFragmentsCalculator = () => (
  <div className="container py-5 font-monospace">
    <h2 className="fw-bold">Gold Fragments Calculator</h2>
    <p className="text-muted">Module configuration coming soon...</p>
  </div>
);



function App() {
  return (
    // WRAPPING THE ENTIRE APP IN THE ROUTER
    <Router> 
      {/* Global Navigation Layout Bar */}
      <div className="bg-white border-bottom py-3 shadow-sm sticky-top">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <span className="fw-bold font-monospace text-uppercase tracking-wider text-dark" style={{ letterSpacing: '0.05em' }}>
            DWS Calaculators + Guides 🐦‍🔥
          </span>
          
          {/* Simple Top Navigation Links (Now safely inside the Router!) */}
          <nav className="d-flex gap-4 font-monospace small fw-bold">
            <Link to="/precision-parts" className="text-decoration-none text-dark hover-warning">
              Precision Parts
            </Link>
             <Link to="/energy" className="text-decoration-none text-dark hover-warning">
              Apc Upgrades
            </Link>
            <Link to="/gold-fragments" className="text-decoration-none text-dark hover-warning">
              Gold Fragments
            </Link>
    
          </nav>
        </div>
      </div>

      {/* Viewport content changes dynamically based on Route */}
      <main>
        <Routes>
          {/* Default view redirects to the Precision Parts Tracker */}
          <Route path="/" element={<Navigate to="/precision-parts" replace />} />
          
          {/* Active Calculator Routes */}
          <Route path="/precision-parts" element={<PrecisionCalculator />} />
          <Route path="/energy" element={<ApcCalculator />} />
          <Route path="/gold-fragments" element={<GoldFragmentsCalculator />} />
          
        </Routes>
      </main>
      <footer className="bg-light border-top py-3">
        <div className="container text-center text-muted">
          <p>&copy; 2026 DWS Calculators + Guides. Created by DARK PHOENIX 🐦‍🔥.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;