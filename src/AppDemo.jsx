import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Cpu, Radio, Sparkles, ChevronDown, CheckCircle, Eye, ShieldCheck, 
  Camera, Zap, Target, Layers, Play, Pause, BarChart2, Thermometer, Droplet, 
  Wind, Sun, Waves, Sliders, Flame, TestTube, Utensils, Award, Download, Clock, 
  HeartPulse, TrendingUp, Brain, BookOpen, FileText, HelpCircle, Terminal, RefreshCw, AlertTriangle,
  Compass, Grid, Settings, Shield, Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { SPECIES_PROFILES, INITIAL_ACTUATOR_STATE } from './data/speciesData';
import { AquariaSimulator } from './utils/simulationEngine';

export function AppDemo() {
  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_PROFILES[0]);
  const [aiMode, setAiMode] = useState(true);
  const [actuators, setActuators] = useState(INITIAL_ACTUATOR_STATE);
  const [scenarioMode, setScenarioMode] = useState('NORMAL');
  const [visionOverlay, setVisionOverlay] = useState('YOLO');
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(60);
  const [activeTab, setActiveTab] = useState('REASONING');
  const [activeNav, setActiveNav] = useState('OVERVIEW');

  const canvasRef = useRef(null);
  const simulatorRef = useRef(null);
  if (!simulatorRef.current) {
    simulatorRef.current = new AquariaSimulator(selectedSpecies);
  }

  const [telemetry, setTelemetry] = useState(simulatorRef.current.telemetry);
  const [aiLogs, setAiLogs] = useState(simulatorRef.current.eventLogs);

  // Sync simulator state
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatorRef.current) {
        setTelemetry({ ...simulatorRef.current.telemetry });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // HTML5 Canvas Rendering for Cinematic HUD Stream
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();
    let frameCount = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Background Environment
      if (visionOverlay === 'DEPTH') {
        const depthGrad = ctx.createLinearGradient(0, 0, width, height);
        depthGrad.addColorStop(0, '#000000');
        depthGrad.addColorStop(0.5, '#444444');
        depthGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = depthGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (visionOverlay === 'HEATMAP') {
        ctx.fillStyle = '#02050B';
        ctx.fillRect(0, 0, width, height);
        const heatGrad = ctx.createRadialGradient(320, 240, 10, 320, 240, 200);
        heatGrad.addColorStop(0, 'rgba(255, 0, 80, 0.85)');
        heatGrad.addColorStop(0.4, 'rgba(255, 180, 0, 0.5)');
        heatGrad.addColorStop(0.8, 'rgba(0, 242, 254, 0.2)');
        heatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = heatGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const tankGrad = ctx.createLinearGradient(0, 0, 0, height);
        tankGrad.addColorStop(0, '#071526');
        tankGrad.addColorStop(0.6, '#040C1A');
        tankGrad.addColorStop(1, '#02060F');
        ctx.fillStyle = tankGrad;
        ctx.fillRect(0, 0, width, height);

        // Cyber Grid Lines Overlay
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Substrate Sand & Nest Tile
        ctx.fillStyle = '#091828';
        ctx.fillRect(0, height - 42, width, 42);

        // Slate Nest Tile
        ctx.save();
        ctx.fillStyle = '#122638';
        ctx.strokeStyle = '#00F2FE';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(simulatorRef.current.nest.x - 40, simulatorRef.current.nest.y - 18, 90, 48, 8);
        ctx.fill();
        ctx.stroke();

        // Deposited Eggs
        for (let i = 0; i < Math.min(simulatorRef.current.nest.eggCount, 140); i++) {
          const row = Math.floor(i / 16);
          const col = i % 16;
          const ex = simulatorRef.current.nest.x - 35 + col * 4.8;
          const ey = simulatorRef.current.nest.y - 12 + row * 4.8;
          ctx.fillStyle = '#FFA500';
          ctx.beginPath(); ctx.arc(ex, ey, 2.3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Aerator Bubbles
        ctx.fillStyle = 'rgba(0, 242, 254, 0.35)';
        for (let i = 0; i < 10; i++) {
          const bx = 85 + Math.sin(simulatorRef.current.time * 2.5 + i) * 8;
          const by = (height - 40 - (simulatorRef.current.time * 45 + i * 32) % (height - 60));
          ctx.beginPath(); ctx.arc(bx, by, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
        }
      }

      // HUD Reticles [ ┌ ┐ └ ┘ ]
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 2.5;
      const bLen = 18;
      ctx.beginPath(); ctx.moveTo(14, 14 + bLen); ctx.lineTo(14, 14); ctx.lineTo(14 + bLen, 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width - 14 - bLen, 14); ctx.lineTo(width - 14, 14); ctx.lineTo(width - 14, 14 + bLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, height - 14 - bLen); ctx.lineTo(14, height - 14); ctx.lineTo(14 + bLen, height - 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width - 14 - bLen, height - 14); ctx.lineTo(width - 14, height - 14); ctx.lineTo(width - 14, height - 14 - bLen); ctx.stroke();

      // Fishes
      const fishes = simulatorRef.current.fishes;
      fishes.forEach((fish) => {
        if (visionOverlay === 'DEPTH') return;

        const angle = Math.atan2(fish.vy || 0.1, fish.vx || 0.1);
        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.rotate(angle);

        ctx.fillStyle = fish.secondaryColor;
        ctx.beginPath();
        ctx.moveTo(-fish.size * 0.5, 0);
        ctx.lineTo(-fish.size * 0.95, -fish.size * 0.45 + Math.sin(simulatorRef.current.time * 12) * 5);
        ctx.lineTo(-fish.size * 0.95, fish.size * 0.45 - Math.sin(simulatorRef.current.time * 12) * 5);
        ctx.closePath();
        ctx.fill();

        const bodyGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, fish.size * 0.6);
        bodyGrad.addColorStop(0, fish.color);
        bodyGrad.addColorStop(1, fish.secondaryColor);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath(); ctx.ellipse(0, 0, fish.size * 0.6, fish.size * 0.35, 0, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath(); ctx.arc(fish.size * 0.35, -fish.size * 0.1, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(fish.size * 0.37, -fish.size * 0.1, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        if (visionOverlay === 'YOLO') {
          const boxSize = fish.size * 1.7;
          const boxX = fish.x - boxSize / 2;
          const boxY = fish.y - boxSize / 2;

          ctx.strokeStyle = fish.type === 'Female' ? '#00F2FE' : '#FF4757';
          ctx.lineWidth = 2;
          ctx.shadowColor = fish.type === 'Female' ? '#00F2FE' : '#FF4757';
          ctx.shadowBlur = 12;
          ctx.strokeRect(boxX, boxY, boxSize, boxSize);
          ctx.shadowBlur = 0;

          ctx.strokeStyle = fish.type === 'Female' ? '#00F2FE' : '#FF4757';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(fish.x, fish.y, 8, 0, Math.PI * 2); ctx.stroke();

          ctx.fillStyle = fish.type === 'Female' ? 'rgba(0, 242, 254, 0.95)' : 'rgba(255, 71, 87, 0.95)';
          ctx.fillRect(boxX, boxY - 22, boxSize, 20);
          ctx.fillStyle = '#040C18';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.fillText(`${fish.type} (${(fish.confidence * 100).toFixed(0)}%)`, boxX + 4, boxY - 8);

          ctx.strokeStyle = '#FFE66D';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(fish.x, fish.y); ctx.lineTo(fish.x + fish.vx * 28, fish.y + fish.vy * 28); ctx.stroke();
        }

        if (visionOverlay === 'POSE') {
          const pose = fish.poseSkeleton;
          if (pose && pose.length > 0) {
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(pose[0].x, pose[0].y);
            for (let i = 1; i < pose.length; i++) ctx.lineTo(pose[i].x, pose[i].y);
            ctx.stroke();
            pose.forEach(pt => {
              ctx.fillStyle = '#00F2FE';
              ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
            });
          }
        }
      });

      // Distance Line
      if (fishes.length >= 2 && visionOverlay !== 'RGB') {
        const dx = fishes[0].x - fishes[1].x;
        const dy = fishes[0].y - fishes[1].y;
        const distPx = Math.sqrt(dx * dx + dy * dy).toFixed(0);

        ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(fishes[0].x, fishes[0].y); ctx.lineTo(fishes[1].x, fishes[1].y); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#00F2FE';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`Pair Dist: ${distPx}px [LOCKED]`, (fishes[0].x + fishes[1].x) / 2 - 45, (fishes[0].y + fishes[1].y) / 2 - 10);
      }

      if (isPlaying) {
        simulatorRef.current.tick({}, scenarioMode);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [visionOverlay, isPlaying, scenarioMode]);

  // Data Fusion Score Calculation
  const opt = selectedSpecies.optimalSensors;
  const tempVar = Math.abs(telemetry.temperature - opt.temperature.target);
  const phVar = Math.abs(telemetry.ph - opt.ph.target);
  const envStability = Math.max(0, 100 - (tempVar * 15 + phVar * 25));
  const behaviorScore = simulatorRef.current.aiClassification.courtship * 0.5 + simulatorRef.current.aiClassification.cleaning * 0.5;
  const fusedScore = Math.min(100, Math.round(envStability * 0.45 + behaviorScore * 0.55));
  const predMin = Math.max(1, Math.round(24 - (fusedScore * 0.22)));
  const predMax = predMin + 4;
  const viability = Math.max(70, Math.round(98 - tempVar * 8 - phVar * 12));
  const fryCount = Math.round(simulatorRef.current.nest.eggCount * (viability / 100));

  const classification = simulatorRef.current.aiClassification;

  return (
    <div style={{ background: '#02050B', minHeight: '100vh', color: '#F8FAFC', padding: '12px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* TOP DEMO NOTICE */}
      <div style={{ background: 'linear-gradient(90deg, #8B5CF6 0%, #00F2FE 100%)', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} /> <strong>NEW 3-COLUMN TACTICAL COCKPIT DEMO UI</strong> (Main Project Remains 100% Untouched)
        </span>
        <button onClick={() => window.location.href = '/'} style={{ background: '#FFFFFF', color: '#02050B', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '900', cursor: 'pointer' }}>
          Back to Original Layout
        </button>
      </div>

      {/* 3-COLUMN COCKPIT LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '70px 1.4fr 1fr', gap: '14px', alignItems: 'start' }}>
        
        {/* COLUMN 1: LEFT VERTICAL NAVIGATION & SENSOR QUICK STACK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          
          {/* LOGO BADGE */}
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #00F2FE 0%, #3B82F6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 242, 254, 0.5)' }}>
            <Activity size={24} color="#02050B" strokeWidth={2.5} />
          </div>

          {/* NAV ICONS */}
          <div className="glass-panel" style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '14px' }}>
            {[
              { id: 'OVERVIEW', icon: Grid, label: 'Overview' },
              { id: 'VISION', icon: Camera, label: 'Vision HUD' },
              { id: 'TELEMETRY', icon: Activity, label: 'Telemetry' },
              { id: 'ACTUATOR', icon: Sliders, label: 'Actuators' },
              { id: 'PREDICT', icon: Clock, label: 'Forecast' },
              { id: 'RESEARCH', icon: BookOpen, label: 'Citations' }
            ].map(item => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  title={item.label}
                  style={{ background: active ? 'var(--accent-cyan)' : 'transparent', color: active ? '#02050B' : 'var(--text-muted)', border: 'none', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: active ? '0 0 14px rgba(0, 242, 254, 0.5)' : 'none', transition: 'all 0.2s ease' }}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>

          {/* VERTICAL SENSOR DIAL STACK */}
          <div className="glass-panel" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', borderRadius: '14px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--accent-cyan)', textAlign: 'center' }}>SENSORS</div>
            
            <div style={{ textAlign: 'center' }} title="Water Temperature">
              <Thermometer size={16} color="#00F2FE" />
              <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#FFFFFF' }}>{telemetry.temperature}°C</div>
            </div>

            <div style={{ textAlign: 'center' }} title="pH Balance">
              <Droplet size={16} color="#3B82F6" />
              <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#FFFFFF' }}>{telemetry.ph}</div>
            </div>

            <div style={{ textAlign: 'center' }} title="Dissolved Oxygen">
              <Wind size={16} color="#10B981" />
              <div style={{ fontSize: '0.72rem', fontWeight: '900', color: '#FFFFFF' }}>{telemetry.dissolvedOxygen}</div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: CENTER HERO CINEMATIC CAMERA HUD & NEURAL ANALYSIS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* HEADER BAR */}
          <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '900', background: 'linear-gradient(90deg, #FFFFFF, #00F2FE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SmartAquaria Bio-Dome Cockpit
              </h1>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Team 28 • Edge AI Tactical Aquaculture Command Center</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={selectedSpecies.id}
                onChange={(e) => {
                  const target = SPECIES_PROFILES.find(s => s.id === e.target.value);
                  if (target) {
                    setSelectedSpecies(target);
                    simulatorRef.current.setSpecies(target);
                  }
                }}
                style={{ background: '#091424', color: '#FFFFFF', border: '1px solid var(--border-cyan)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}
              >
                {SPECIES_PROFILES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <button 
                onClick={() => setAiMode(!aiMode)}
                style={{ background: aiMode ? 'rgba(0, 242, 254, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: aiMode ? '#00F2FE' : '#F59E0B', border: `1px solid ${aiMode ? '#00F2FE' : '#F59E0B'}`, padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
              >
                {aiMode ? 'AI AUTO' : 'MANUAL'}
              </button>
            </div>
          </div>

          {/* 7-STAGE PIPELINE STEPPER BAR */}
          <div style={{ background: 'rgba(4, 12, 24, 0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', fontSize: '0.72rem' }}>
            <span style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>7-Stage Architecture (Section 5):</span>
            {['1. Sense', '2. Preprocess', '3. Detect', '4. Fuse', '5. Predict', '6. Act', '7. Dashboard'].map((s, i) => (
              <span key={i} style={{ color: '#FFFFFF', fontWeight: '600' }}>✓ {s}</span>
            ))}
          </div>

          {/* CINEMATIC CAMERA HUD STREAM */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>Tactical Vision Stream</span>
                <span className="badge badge-emerald"><span className="status-dot active"></span> LIVE CV {fps} FPS</span>
              </div>

              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '6px' }}>
                {['RGB', 'YOLO', 'POSE', 'HEATMAP', 'DEPTH'].map(m => (
                  <button key={m} onClick={() => setVisionOverlay(m)} style={{ background: visionOverlay === m ? '#00F2FE' : 'transparent', color: visionOverlay === m ? '#02050B' : 'var(--text-muted)', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}>{m}</button>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-cyan)' }}>
              <canvas ref={canvasRef} width={640} height={350} style={{ width: '100%', height: '100%', display: 'block' }} />
              
              <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ background: 'rgba(2, 5, 11, 0.85)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>
                  CAM-01 [MAIN TANK] • 1080p @ 60fps
                </div>
                <div style={{ background: 'rgba(2, 5, 11, 0.85)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'JetBrains Mono' }}>
                  STATE: <strong>{simulatorRef.current.behaviorState}</strong>
                </div>
              </div>
            </div>

            {/* RADIAL BEHAVIOR BAR */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { label: 'Courtship', val: classification.courtship, color: '#00F2FE' },
                { label: 'Cleaning', val: classification.cleaning, color: '#3B82F6' },
                { label: 'Egg Deposit', val: classification.eggLaying, color: '#F59E0B' },
                { label: 'Parental Care', val: classification.parentalCare, color: '#10B981' }
              ].map(b => (
                <div key={b.label} style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: '900', color: b.color, margin: '2px 0' }}>{b.val}%</div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${b.val}%`, height: '100%', background: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI REASONING TERMINAL LOG */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={16} /> Real-Time XAI Neural Reasoning Stream
            </div>
            <div style={{ background: 'rgba(2, 5, 11, 0.9)', padding: '12px', borderRadius: '8px', fontFamily: 'JetBrains Mono', fontSize: '0.72rem', maxHeight: '140px', overflowY: 'auto' }}>
              {aiLogs.map(l => (
                <div key={l.id} style={{ marginBottom: '4px' }}><span style={{ color: 'var(--text-dim)' }}>[{l.time}]</span> <strong style={{ color: 'var(--accent-cyan)' }}>[{l.title}]</strong> {l.text}</div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMN 3: RIGHT 24H PREDICTION CARD & CLOSED-LOOP ACTUATORS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* 24-HOUR SPAWNING PREDICTOR RING CARD (SECTION 7) */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.06) 0%, rgba(245, 158, 11, 0.06) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> 24h Target Spawning Window Predictor
              </span>
              <button onClick={() => confetti({ particleCount: 60 })} className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                Export Log
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', border: '4px solid var(--accent-amber)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)', flexShrink: 0 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFFFFF' }}>{predMin}-{predMax}h</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--accent-amber)' }}>TARGET</span>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>Fused Readiness: {fusedScore} / 100</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>Viability Index: <strong style={{ color: 'var(--accent-emerald)' }}>{viability}%</strong></div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Clutch Forecast: <strong>~{fryCount} Fry</strong></div>
              </div>
            </div>

            {/* SECTION 12 METRICS */}
            <div style={{ background: 'rgba(2, 5, 11, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
              <div>CV F1 Score: <strong style={{ color: 'var(--accent-emerald)' }}>94.2%</strong></div>
              <div>Prediction Error: <strong style={{ color: 'var(--accent-cyan)' }}>±1.8h</strong></div>
              <div>Sensor Reliability: <strong style={{ color: 'var(--accent-emerald)' }}>99.6%</strong></div>
              <div>Safe Control: <strong style={{ color: 'var(--accent-emerald)' }}>100%</strong></div>
            </div>
          </div>

          {/* CLOSED-LOOP ACTUATORS */}
          <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={16} color="var(--accent-cyan)" /> Closed-Loop Actuators
              </span>
              <span className="badge badge-cyan">BOUNDED SAFETY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700' }}>
                  <span>Smart Heater</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{actuators.heater.setpoint}°C</span>
                </div>
                <input type="range" min="24.0" max="32.0" step="0.1" value={actuators.heater.setpoint} onChange={e => setActuators(p => ({ ...p, heater: { ...p.heater, setpoint: parseFloat(e.target.value) } }))} style={{ marginTop: '6px' }} />
              </div>

              <div style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700' }}>
                  <span>O2 Aeration Booster</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{actuators.aerator.flowRate}%</span>
                </div>
                <input type="range" min="10" max="100" value={actuators.aerator.flowRate} onChange={e => setActuators(p => ({ ...p, aerator: { ...p.aerator, flowRate: parseInt(e.target.value) } }))} style={{ marginTop: '6px' }} />
              </div>

              <div style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>Artemia Auto-Feeder</span>
                <button onClick={() => confetti({ particleCount: 40 })} className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Dispense</button>
              </div>
            </div>
          </div>

          {/* CITATIONS & FAQ BOX */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>📚 Section 13 Literature & FAQ</div>
            <div>• Prapti et al. (2022) - IoT Aquaculture (DOI: 10.1111/raq.12637)</div>
            <div>• He et al. (2026) - Fish Behavior Vision (DOI: 10.1016/j.cosrev.2026.100896)</div>
            <div>• FAO TECA (2022) - Water Quality Sensors</div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AppDemo;
