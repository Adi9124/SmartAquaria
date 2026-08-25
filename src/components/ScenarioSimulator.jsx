import React from 'react';
import { PlayCircle, AlertTriangle, ThermometerSnowflake, ShieldAlert, RotateCcw, Sparkles, Award } from 'lucide-react';

export const ScenarioSimulator = ({ onTriggerScenario, onReset }) => {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles size={20} color="var(--accent-cyan)" />
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>AI-IoT Interactive Scenario Simulator</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inject real-world aquaculture events to observe automated AI detection & closed-loop response</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        
        {/* Scenario 1: Full Cycle */}
        <button
          className="btn btn-primary"
          onClick={() => onTriggerScenario('SIMULATE_SPAWNING_CYCLE', 'Initiated 60s Full Spawning Cycle Simulation')}
          style={{ fontSize: '0.78rem' }}
        >
          <PlayCircle size={14} /> Run Full Spawning Cycle
        </button>

        {/* Scenario 2: Temp Drop */}
        <button
          className="btn btn-secondary"
          onClick={() => onTriggerScenario('SIMULATE_TEMP_DROP', 'Injected Sudden -2.5°C Temperature Drop Shock')}
          style={{ fontSize: '0.78rem' }}
        >
          <ThermometerSnowflake size={14} color="var(--accent-cyan)" /> Temp Drop Shock (-2.5°C)
        </button>

        {/* Scenario 3: Ammonia Spike */}
        <button
          className="btn btn-secondary"
          onClick={() => onTriggerScenario('SIMULATE_AMMONIA_SPIKE', 'Injected 0.08ppm Toxic Ammonia Anomaly')}
          style={{ fontSize: '0.78rem' }}
        >
          <AlertTriangle size={14} color="var(--accent-amber)" /> Ammonia Anomaly Spike
        </button>

        {/* Scenario 4: Male Conflict */}
        <button
          className="btn btn-secondary"
          onClick={() => onTriggerScenario('SIMULATE_AGGRESSION', 'Simulated Inter-Male Territorial Conflict')}
          style={{ fontSize: '0.78rem' }}
        >
          <ShieldAlert size={14} color="var(--accent-rose)" /> Inter-Male Conflict
        </button>

        {/* Scenario 5: Load Team 28 Hackathon Report State */}
        <button
          className="btn btn-secondary"
          onClick={() => onTriggerScenario('SIMULATE_HACKATHON_REPORT', 'Loaded Team 28 Hackathon Breeding Report snapshot (177 eggs, 0.08ppm NH3, 29.5°C)')}
          style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.4)', color: 'var(--accent-amber)' }}
        >
          <Award size={14} color="var(--accent-amber)" /> Load Team 28 Report
        </button>

        {/* Reset */}
        <button
          className="btn btn-secondary"
          onClick={onReset}
          style={{ fontSize: '0.78rem' }}
          title="Reset environment to baseline"
        >
          <RotateCcw size={14} /> Reset
        </button>

      </div>

    </div>
  );
};
