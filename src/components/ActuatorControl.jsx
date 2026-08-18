import React from 'react';
import { Sliders, Flame, Wind, TestTube, Sun, Utensils, Cpu, RefreshCw, Power } from 'lucide-react';

export const ActuatorControl = ({ actuators, setActuators, aiMode, onManualTrigger }) => {

  const updateActuator = (key, field, value) => {
    setActuators(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            Closed-Loop IoT Actuators & Environmental Control
          </h2>
        </div>
        <span className={`badge ${aiMode ? 'badge-cyan' : 'badge-amber'}`}>
          <Cpu size={12} /> {aiMode ? 'AI FEEDBACK LOOP ACTIVE' : 'MANUAL OVERRIDE'}
        </span>
      </div>

      {/* Actuators Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        
        {/* 1. Precision Heater */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B' }}>
                <Flame size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Smart Submersible Heater</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Precision PID Thermal Regulator</div>
              </div>
            </div>
            <span className="badge badge-emerald">HEATING 65%</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Target Temperature Setpoint:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{actuators.heater.setpoint}°C</span>
            </div>
            <input
              type="range"
              min="24.0"
              max="32.0"
              step="0.1"
              value={actuators.heater.setpoint}
              onChange={(e) => updateActuator('heater', 'setpoint', parseFloat(e.target.value))}
              style={{ accentColor: 'var(--accent-cyan)', width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 2. Aeration Oxygen Booster */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)' }}>
                <Wind size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>O2 Aeration & Microbubble Pump</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Dissolved Oxygen Maximizer</div>
              </div>
            </div>
            <span className="badge badge-cyan">{actuators.aerator.flowRate}% FLOW</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Aeration Output Rate:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{actuators.aerator.flowRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={actuators.aerator.flowRate}
              onChange={(e) => updateActuator('aerator', 'flowRate', parseInt(e.target.value))}
              style={{ accentColor: 'var(--accent-cyan)', width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 3. Micro-Dosing Buffer Pump */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)' }}>
                <TestTube size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Peristaltic Dosing Pump</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>pH Buffer / Conditioning Dosage</div>
              </div>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => onManualTrigger('DOSE_PH', 'Triggered 2.5ml pH buffer dosing')}
              style={{ fontSize: '0.7rem', padding: '4px 8px' }}
            >
              Dose 2.5ml Now
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Agent:</span>
            <span style={{ fontWeight: '600', color: '#FFFFFF' }}>Acid Buffer Solution A</span>
          </div>
        </div>

        {/* 4. Spectrum LED Controller */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)' }}>
                <Sun size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Spectrum Photoperiod LED</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Moonlight / Dusk Trigger Spectrum</div>
              </div>
            </div>
            <span className="badge badge-amber">{actuators.ledLighting.brightness}% LUX</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Light Intensity:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>{actuators.ledLighting.brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={actuators.ledLighting.brightness}
              onChange={(e) => updateActuator('ledLighting', 'brightness', parseInt(e.target.value))}
              style={{ accentColor: 'var(--accent-amber)', width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 5. Live Food Auto-Feeder */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
                <Utensils size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>High-Protein Auto-Feeder</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Conditioning Live Artemia Trigger</div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => onManualTrigger('DISPENSE_FEED', 'Dispensed 2.5g Live Artemia conditioning feed')}
              style={{ fontSize: '0.7rem', padding: '4px 10px' }}
            >
              Dispense Feed
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Next Scheduled Feed:</span>
            <span style={{ fontWeight: '600', color: 'var(--accent-emerald)' }}>In {actuators.autoFeeder.nextFeedInMins} mins</span>
          </div>
        </div>

      </div>

    </div>
  );
};
