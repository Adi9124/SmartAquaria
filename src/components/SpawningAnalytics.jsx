import React from 'react';
import { Award, Download, Clock, HeartPulse, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SpawningAnalytics = ({ simulator, species, telemetry }) => {

  const eggCount = simulator.nest.eggCount;
  const progress = simulator.spawningProgress;

  // Egg Viability Scoring Logic
  const tempVariance = Math.abs(telemetry.temperature - species.optimalSensors.temperature.target);
  const phVariance = Math.abs(telemetry.ph - species.optimalSensors.ph.target);
  const viabilityScore = Math.max(70, Math.round(98 - tempVariance * 8 - phVariance * 12));
  const estimatedFryCount = Math.round(eggCount * (viabilityScore / 100));

  const handleExportReport = () => {
    // Trigger festive celebration if eggs laid
    if (eggCount > 20) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }

    const reportContent = `
================================================================
           SMARTAQUARIA BREEDING REPORT & ANALYTICS             
================================================================
Generated: ${new Date().toLocaleString()}
Species: ${species.name} (${species.category})
System Status: AI-IoT Closed Loop Active

1. EGG DEPOSITION & SPAWNING PROGRESS
- Eggs Deposited: ${eggCount} / ${simulator.nest.maxEggs}
- Spawning Stage Progress: ${progress}%
- Current Behavior State: ${simulator.behaviorState}

2. ENVIRONMENTAL TELEMETRY METRICS
- Water Temperature: ${telemetry.temperature} °C (Target: ${species.optimalSensors.temperature.target}°C)
- pH Level: ${telemetry.ph} pH (Target: ${species.optimalSensors.ph.target} pH)
- Dissolved Oxygen: ${telemetry.dissolvedOxygen} mg/L
- Ammonia (NH3): ${telemetry.ammonia} ppm
- Photoperiod Spectrum: ${telemetry.lightSpectrum} Lux

3. AI VIABILITY & FRY FORECAST
- Calculated Egg Viability Index: ${viabilityScore}%
- Estimated Healthy Fry Hatch: ${estimatedFryCount} fry
- Estimated Time to Hatch: 48 - 56 Hours

================================================================
    SmartAquaria - Empowering Aquaculture with AI & IoT        
================================================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartAquaria_Breeding_Report_${species.id}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            Spawning Analytics, Egg Viability & Fry Yield Forecast
          </h2>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleExportReport}
          style={{ fontSize: '0.78rem' }}
        >
          <Download size={14} /> Export Aquaculture Log
        </button>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        
        {/* Card 1: Eggs Deposited */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deposited Egg Clutch</div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--accent-amber)', margin: '4px 0' }}>
            {eggCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ {simulator.nest.maxEggs}</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-amber)' }} />
          </div>
        </div>

        {/* Card 2: Egg Viability Score */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HeartPulse size={14} color="var(--accent-emerald)" /> Egg Viability Index
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--accent-emerald)', margin: '4px 0' }}>
            {viabilityScore}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            High stability across pH & temp
          </div>
        </div>

        {/* Card 3: Forecasted Fry Hatch */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} color="var(--accent-cyan)" /> Forecasted Healthy Fry
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--accent-cyan)', margin: '4px 0' }}>
            ~{estimatedFryCount} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fry</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            Based on 98.4% fertilization rate
          </div>
        </div>

        {/* Card 4: Estimated Hatch Window */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="var(--accent-purple)" /> Time to Hatch
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'Outfit', color: '#FFFFFF', margin: '4px 0' }}>
            52.5 Hours
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            Stage 3 Incubation Phase
          </div>
        </div>

      </div>

    </div>
  );
};
