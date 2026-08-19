import React, { useState } from 'react';
import { Brain, ChevronRight, BookOpen, Sparkles, Terminal, FileText, HelpCircle, ShieldCheck } from 'lucide-react';

export const AIAdvisor = ({ simulator, species, aiLogs }) => {
  const [activeTab, setActiveTab] = useState('REASONING'); // REASONING, PLAYBOOK, RESEARCH, VIVA

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Brain size={20} color="var(--accent-cyan)" />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              AI Decision Engine, Research & Viva Guide
            </h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Team 28 | Smart Automation / Precision Aquaculture (Claude Hackathon 2026)
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('REASONING')}
            style={{
              padding: '6px 10px',
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
            XAI Reasoning Log
          </button>
          
          <button
            onClick={() => setActiveTab('PLAYBOOK')}
            style={{
              padding: '6px 10px',
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
            Species Protocol
          </button>

          <button
            onClick={() => setActiveTab('RESEARCH')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === 'RESEARCH' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'RESEARCH' ? '#060913' : 'var(--text-muted)'
            }}
          >
            <FileText size={12} style={{ marginRight: '4px' }} />
            Research Citations
          </button>

          <button
            onClick={() => setActiveTab('VIVA')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === 'VIVA' ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === 'VIVA' ? '#060913' : 'var(--text-muted)'
            }}
          >
            <HelpCircle size={12} style={{ marginRight: '4px' }} />
            FAQ & Q&A Guide
          </button>
        </div>
      </div>

      {/* Tab Content 1: Realtime Reasoning Log */}
      {activeTab === 'REASONING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Sparkles size={22} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF' }}>
                AI Recommendation: Spawning Preparation Phase
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                YOLOv8 Computer vision tracking detected sustained courtship shimmies and substrate nipping ({simulator.aiClassification.courtship}% confidence). 
                The AI system recommends maintaining temperature at <strong>{species.optimalSensors.temperature.target}°C</strong> and lowering photoperiod to blue dusk spectrum.
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(6, 9, 19, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px',
            maxHeight: '200px',
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
      )}

      {/* Tab Content 2: Species Protocol */}
      {activeTab === 'PLAYBOOK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
            <img 
              src={species.image} 
              alt={species.name}
              style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-cyan)' }} 
            />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800' }}>{species.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{species.description}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                Breeding Difficulty: <strong>{species.difficulty}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
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
      )}

      {/* Tab Content 3: Section 13 Research Basis */}
      {activeTab === 'RESEARCH' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
          <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
            📚 Section 13: Literature & Research Citations Grounding SmartAquaria
          </div>

          {[
            { title: '1. Prapti et al. (2022)', journal: 'Reviews in Aquaculture', doi: '10.1111/raq.12637', text: 'IoT-based aquaculture & water-quality monitoring systems for precision fish farming.' },
            { title: '2. Flores-Iwasaki et al. (2025)', journal: 'AgriEngineering', doi: '10.3390/agriengineering7030078', text: 'IoT sensors for real-time water-quality parameter monitoring in intensive aquaculture.' },
            { title: '3. He et al. (2026)', journal: 'Computer Science Review', doi: '10.1016/j.cosrev.2026.100896', text: 'Deep learning-based computer vision for multi-fish behavior recognition and posture estimation.' },
            { title: '4. FAO TECA (2022)', journal: 'FAO Technology Brief', doi: 'N/A', text: 'Using IoT sensors to measure dissolved oxygen, pH and temperature in fish breeding hatcheries.' },
            { title: '5. Project Brief (2026)', journal: 'SmartAquaria Brief #17', doi: 'Dr Y. Nayak & Dr S. Chakravarty', text: 'Integrating Edge AI, computer vision tracking, and environmental time-series data fusion.' }
          ].map((paper, i) => (
            <div key={i} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '700', color: '#FFFFFF' }}>{paper.title} • <span style={{ color: 'var(--accent-cyan)' }}>{paper.journal}</span></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: '2px 0' }}>{paper.text}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono' }}>DOI: {paper.doi}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: System FAQ & Q&A Guide */}
      {activeTab === 'VIVA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
          <div style={{ fontWeight: '700', color: 'var(--accent-amber)', fontSize: '0.85rem' }}>
            ❓ System FAQ & Project Q&A Guide
          </div>

          {[
            { q: 'Q: What is SmartAquaria in 1 sentence?', a: 'SmartAquaria is an AI + IoT system that monitors fish breeding behavior and water parameters, predicts a likely 24h egg-laying window, and controls actuators safely.' },
            { q: 'Q: Why use both Camera and Water Sensors?', a: 'Cameras observe physical movement, shimmying, and substrate nipping; sensors measure invisible parameters like pH, temperature, and dissolved oxygen.' },
            { q: 'Q: What is Closed-Loop Control with Safety Limits?', a: 'Observe → Predict → Execute safe bounded action → Observe again. Always guarded by hard safety limits, confidence thresholds, and human override.' },
            { q: 'Q: Why Edge AI (FastAPI + Raspberry Pi / ESP32)?', a: 'To process video frames and sensor readings locally near the tank, reducing latency and avoiding cloud dependence.' },
            { q: 'Q: Is 24h prediction guaranteed?', a: 'No, 24-hour prediction is our target metric that requires staged trial validation across fish species.' }
          ].map((qa, i) => (
            <div key={i} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{qa.q}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{qa.a}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
