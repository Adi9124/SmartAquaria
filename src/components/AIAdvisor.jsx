import React, { useState } from 'react';
import { Brain, CheckCircle2, ChevronRight, BookOpen, AlertCircle, Sparkles, Terminal } from 'lucide-react';

export const AIAdvisor = ({ simulator, species, aiLogs }) => {
  const [activeTab, setActiveTab] = useState('REASONING'); // REASONING, PLAYBOOK

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            AI Decision Engine & Breeding Playbook
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setActiveTab('REASONING')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === 'REASONING' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'REASONING' ? '#060913' : 'var(--text-muted)'
            }}
          >
            <Terminal size={12} style={{ marginRight: '4px' }} />
            XAI Realtime Reasoning Log
          </button>
          <button
            onClick={() => setActiveTab('PLAYBOOK')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === 'PLAYBOOK' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'PLAYBOOK' ? '#060913' : 'var(--text-muted)'
            }}
          >
            <BookOpen size={12} style={{ marginRight: '4px' }} />
            Species Breeding Protocol
          </button>
        </div>
      </div>

      {activeTab === 'REASONING' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Active AI Recommendation Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Sparkles size={22} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF' }}>
                AI Recommendation: Spawning Preparation Stage Active
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Computer vision neural net detected sustained courtship shimmies and substrate nipping ({simulator.aiClassification.courtship}% confidence). 
                The AI system recommends raising temperature to <strong>{species.optimalSensors.temperature.target}°C</strong> and lowering ambient photoperiod to simulate Amazonian twilight.
              </div>
            </div>
          </div>

          {/* Event Log Stream */}
          <div style={{
            background: 'rgba(6, 9, 19, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            maxHeight: '220px',
            overflowY: 'auto',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {aiLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>[{log.time}]</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: '700', flexShrink: 0 }}>[{log.title}]</span>
                <span style={{ color: 'var(--text-muted)' }}>{log.text}</span>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Species Overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <img 
              src={species.image} 
              alt={species.name}
              style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-cyan)' }} 
            />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{species.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{species.description}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                Breeding Difficulty: <strong>{species.difficulty}</strong>
              </div>
            </div>
          </div>

          {/* Behavioral Signatures */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px' }}>
              Recognized Behavioral Signatures
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {species.behavioralSignatures.map((sig, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    <span>{sig.name}</span>
                    <span>{sig.probability}% Prob</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {sig.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
