import React from 'react';
import { Activity, Cpu, Radio, Sparkles, ChevronDown, CheckCircle, Eye, ShieldCheck } from 'lucide-react';
import { SPECIES_PROFILES } from '../data/speciesData';

export const Navbar = ({ 
  selectedSpecies, 
  setSelectedSpecies, 
  aiMode, 
  setAiMode, 
  onEmergencyBoost,
  simTime 
}) => {
  return (
    <header className="glass-panel" style={{ padding: '14px 24px', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* Main Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <Activity size={24} color="#060913" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(90deg, #FFFFFF, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartAquaria
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                <Sparkles size={10} /> Team 28 • Python FastAPI
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              AI-IoT System for Intelligent Detection & Management of Fish Breeding Behaviour
            </p>
          </div>
        </div>

        {/* Species / Tank Selector & AI Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              Active Tank & Species
            </span>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedSpecies.id}
                onChange={(e) => {
                  const target = SPECIES_PROFILES.find(s => s.id === e.target.value);
                  if (target) setSelectedSpecies(target);
                }}
                style={{
                  background: 'rgba(20, 31, 50, 0.9)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 36px 8px 12px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  minWidth: '240px'
                }}
              >
                {SPECIES_PROFILES.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name} ({spec.category})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--accent-cyan)' }} />
            </div>
          </div>

          {/* AI Mode Toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              Closed-Loop Control
            </span>
            <div 
              onClick={() => setAiMode(!aiMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: aiMode ? 'rgba(0, 242, 254, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${aiMode ? 'rgba(0, 242, 254, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                cursor: 'pointer'
              }}
            >
              <Cpu size={16} color={aiMode ? 'var(--accent-cyan)' : 'var(--accent-amber)'} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: aiMode ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
                {aiMode ? 'AI SAFE AUTOMATION' : 'HUMAN OVERRIDE'}
              </span>
              <div className={`toggle-switch ${aiMode ? 'on' : ''}`} style={{ width: '32px', height: '18px' }}>
                <div className="toggle-switch-handle" style={{ width: '14px', height: '14px', transform: aiMode ? 'translateX(14px)' : 'translateX(0)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* System Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Radio size={14} color="var(--accent-emerald)" className="animate-pulse" />
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>FastAPI Gateway</div>
              <div style={{ fontWeight: '600', color: 'var(--accent-emerald)' }}>CONNECTED (Port 8000)</div>
            </div>
          </div>

          <button 
            className="btn btn-danger"
            onClick={onEmergencyBoost}
            title="Trigger high aeration & safe temperature lock"
            style={{ fontSize: '0.78rem' }}
          >
            Emergency O2 Boost
          </button>
        </div>

      </div>

      {/* 7-Stage Working Model Pipeline Bar (Section 5 of Hackathon Document) */}
      <div style={{
        background: 'rgba(6, 9, 19, 0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.72rem'
      }}>
        <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
          7-Stage Pipeline (Section 5):
        </span>
        {[
          { stage: '1. Sense', desc: 'Camera & IoT Sensors' },
          { stage: '2. Preprocess', desc: 'Frame Clean & Drift Check' },
          { stage: '3. Detect', desc: 'YOLO Tracking' },
          { stage: '4. Fuse', desc: 'Behavior + Water Fusion' },
          { stage: '5. Predict', desc: '24h Window Model' },
          { stage: '6. Act', desc: 'Bounded Safety Layer' },
          { stage: '7. Dashboard', desc: 'Alerts & History' }
        ].map((stg, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <CheckCircle size={11} color="var(--accent-emerald)" />
            <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{stg.stage}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>({stg.desc})</span>
          </div>
        ))}
      </div>

    </header>
  );
};
