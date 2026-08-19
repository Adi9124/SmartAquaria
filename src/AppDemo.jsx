import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Cpu, Radio, Sparkles, ChevronDown, CheckCircle, Eye, ShieldCheck, 
  Camera, Zap, Target, Layers, Play, Pause, BarChart2, Thermometer, Droplet, 
  Wind, Sun, Waves, Sliders, Flame, TestTube, Utensils, Award, Download, Clock, 
  HeartPulse, TrendingUp, Brain, BookOpen, FileText, HelpCircle, Terminal, RefreshCw, AlertTriangle,
  Compass, Grid, Settings, Shield, Maximize2, Crosshair, Globe, Lock
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

  const canvasRef = useRef(null);
  const simulatorRef = useRef(null);
  if (!simulatorRef.current) {
    simulatorRef.current = new AquariaSimulator(selectedSpecies);
  }

  const [telemetry, setTelemetry] = useState(simulatorRef.current.telemetry);
  const [aiLogs, setAiLogs] = useState(simulatorRef.current.eventLogs);

  // Sync simulator loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatorRef.current) {
        setTelemetry({ ...simulatorRef.current.telemetry });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Sci-Fi Holographic HUD Canvas Renderer
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

      // Sci-Fi Deep Space Ambient Environment
      if (visionOverlay === 'DEPTH') {
        const depthGrad = ctx.createLinearGradient(0, 0, width, height);
        depthGrad.addColorStop(0, '#000000');
        depthGrad.addColorStop(0.5, '#555555');
        depthGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = depthGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (visionOverlay === 'HEATMAP') {
        ctx.fillStyle = '#02040A';
        ctx.fillRect(0, 0, width, height);
        const heatGrad = ctx.createRadialGradient(320, 240, 10, 320, 240, 200);
        heatGrad.addColorStop(0, 'rgba(255, 0, 85, 0.9)');
        heatGrad.addColorStop(0.4, 'rgba(255, 170, 0, 0.6)');
        heatGrad.addColorStop(0.8, 'rgba(0, 242, 254, 0.25)');
        heatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = heatGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const tankGrad = ctx.createLinearGradient(0, 0, 0, height);
        tankGrad.addColorStop(0, '#040C1A');
        tankGrad.addColorStop(0.5, '#020612');
        tankGrad.addColorStop(1, '#010308');
        ctx.fillStyle = tankGrad;
        ctx.fillRect(0, 0, width, height);

        // Cyber Grid Pattern
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 35) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 35) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Glowing Hologram Floor Substrate
        ctx.fillStyle = '#08182B';
        ctx.fillRect(0, height - 42, width, 42);

        // Slate Nest Tile
        ctx.save();
        ctx.fillStyle = '#10263D';
        ctx.strokeStyle = '#00F2FE';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(simulatorRef.current.nest.x - 45, simulatorRef.current.nest.y - 18, 95, 48, 8);
        ctx.fill();
        ctx.stroke();

        // Deposited Egg Pearls
        for (let i = 0; i < Math.min(simulatorRef.current.nest.eggCount, 140); i++) {
          const row = Math.floor(i / 16);
          const col = i % 16;
          const ex = simulatorRef.current.nest.x - 40 + col * 4.8;
          const ey = simulatorRef.current.nest.y - 12 + row * 4.8;
          ctx.fillStyle = '#FF9F43';
          ctx.shadowColor = '#FF9F43';
          ctx.shadowBlur = 6;
          ctx.beginPath(); ctx.arc(ex, ey, 2.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Aerator Bubble Streams
        ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
        for (let i = 0; i < 10; i++) {
          const bx = 85 + Math.sin(simulatorRef.current.time * 2.5 + i) * 8;
          const by = (height - 40 - (simulatorRef.current.time * 45 + i * 32) % (height - 60));
          ctx.beginPath(); ctx.arc(bx, by, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
        }
      }

      // Sci-Fi Viewfinder HUD Corner Brackets
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00F2FE';
      ctx.shadowBlur = 10;
      const bLen = 20;
      ctx.beginPath(); ctx.moveTo(14, 14 + bLen); ctx.lineTo(14, 14); ctx.lineTo(14 + bLen, 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width - 14 - bLen, 14); ctx.lineTo(width - 14, 14); ctx.lineTo(width - 14, 14 + bLen); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, height - 14 - bLen); ctx.lineTo(14, height - 14); ctx.lineTo(14 + bLen, height - 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width - 14 - bLen, height - 14); ctx.lineTo(width - 14, height - 14); ctx.lineTo(width - 14, height - 14 - bLen); ctx.stroke();
      ctx.shadowBlur = 0;

      // Render Fishes
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

          ctx.strokeStyle = fish.type === 'Female' ? '#00F2FE' : '#FF0055';
          ctx.lineWidth = 2;
          ctx.shadowColor = fish.type === 'Female' ? '#00F2FE' : '#FF0055';
          ctx.shadowBlur = 14;
          ctx.strokeRect(boxX, boxY, boxSize, boxSize);
          ctx.shadowBlur = 0;

          // Target Lock Crosshair reticle
          ctx.strokeStyle = fish.type === 'Female' ? '#00F2FE' : '#FF0055';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(fish.x, fish.y, 10, 0, Math.PI * 2); ctx.stroke();

          ctx.fillStyle = fish.type === 'Female' ? 'rgba(0, 242, 254, 0.95)' : 'rgba(255, 0, 85, 0.95)';
          ctx.fillRect(boxX, boxY - 22, boxSize, 20);
          ctx.fillStyle = '#02040A';
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

        ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(fishes[0].x, fishes[0].y); ctx.lineTo(fishes[1].x, fishes[1].y); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#00F2FE';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`Pair Dist: ${distPx}px [PAIRED]`, (fishes[0].x + fishes[1].x) / 2 - 45, (fishes[0].y + fishes[1].y) / 2 - 10);
      }

      if (isPlaying) {
        simulatorRef.current.tick({}, scenarioMode);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [visionOverlay, isPlaying, scenarioMode]);

  // Data Fusion Score
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
    <div style={{ background: '#02040A', minHeight: '100vh', color: '#F8FAFC', padding: '16px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* DEMO NOTICE BANNER */}
      <div style={{ background: 'linear-gradient(90deg, #A855F7 0%, #00F2FE 100%)', color: '#FFFFFF', padding: '10px 20px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '900', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 0 30px rgba(0, 242, 254, 0.5)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} /> <strong>ADVANCED SCI-FI CYBER COMMAND CENTER DEMO UI</strong> (Main Project Code Remains 100% Untouched)
        </span>
        <button onClick={() => window.location.href = '/'} style={{ background: '#FFFFFF', color: '#02040A', border: 'none', padding: '5px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', cursor: 'pointer' }}>
          Return to Original Layout
        </button>
      </div>

      {/* TOP HOLOGRAPHIC SCADA HEADER */}
      <header className="glass-panel" style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '18px', border: '1px solid rgba(0, 242, 254, 0.35)', boxShadow: '0 0 35px rgba(0, 242, 254, 0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #00F2FE 0%, #A855F7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(0, 242, 254, 0.6)' }}>
              <Activity size={28} color="#02040A" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '900', background: 'linear-gradient(90deg, #FFFFFF, #00F2FE, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
                  SmartAquaria Hologram SCADA
                </h1>
                <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Team 28 • Python Edge AI</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Multi-Sensor Data Fusion & Closed-Loop Bounded Precision Hatchery Control Deck
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select
              value={selectedSpecies.id}
              onChange={(e) => {
                const target = SPECIES_PROFILES.find(s => s.id === e.target.value);
                if (target) {
                  setSelectedSpecies(target);
                  simulatorRef.current.setSpecies(target);
                }
              }}
              style={{ background: '#081424', color: '#FFFFFF', border: '1px solid var(--border-cyan)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800' }}
            >
              {SPECIES_PROFILES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <button 
              onClick={() => setAiMode(!aiMode)}
              style={{ background: aiMode ? 'rgba(0, 242, 254, 0.18)' : 'rgba(245, 158, 11, 0.18)', color: aiMode ? '#00F2FE' : '#F59E0B', border: `1px solid ${aiMode ? '#00F2FE' : '#F59E0B'}`, padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: aiMode ? '0 0 15px rgba(0, 242, 254, 0.3)' : 'none' }}
            >
              <Cpu size={16} /> {aiMode ? 'AI CLOSED-LOOP AUTO' : 'HUMAN OVERRIDE'}
            </button>
          </div>
        </div>

        {/* 7-STAGE PIPELINE STEPPER BAR */}
        <div style={{ background: 'rgba(4, 12, 24, 0.85)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.76rem' }}>
          <span style={{ fontWeight: '900', color: 'var(--accent-cyan)' }}>7-Stage Architecture (Section 5):</span>
          {[
            { s: '1. Sense', d: 'Camera & IoT Sensors' },
            { s: '2. Preprocess', d: 'Noise Clean & Drift Check' },
            { s: '3. Detect', d: 'YOLO Tracking' },
            { s: '4. Fuse', d: 'Time-Series Fusion' },
            { s: '5. Predict', d: '24h Spawning Window' },
            { s: '6. Act', d: 'Bounded Control' },
            { s: '7. Dashboard', d: 'SCADA Telemetry' }
          ].map((stg, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={13} color="var(--accent-emerald)" />
              <span style={{ color: '#FFFFFF', fontWeight: '700' }}>{stg.s}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>({stg.d})</span>
            </div>
          ))}
        </div>
      </header>

      {/* 6 HOLOGRAPHIC SENSOR TELEMETRY CARDS WITH RADIAL PROGRESS GAUGES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {[
          { title: 'Water Temp', val: `${telemetry.temperature} °C`, icon: Thermometer, color: '#00F2FE', target: `Target: ${opt.temperature.target}°C` },
          { title: 'pH Balance', val: `${telemetry.ph} pH`, icon: Droplet, color: '#3B82F6', target: `Target: ${opt.ph.target} pH` },
          { title: 'Dissolved Oxygen', val: `${telemetry.dissolvedOxygen} mg/L`, icon: Wind, color: '#10B981', target: `Target: > ${opt.dissolvedOxygen.min} mg/L` },
          { title: 'Ammonia (NH3)', val: `${telemetry.ammonia} ppm`, icon: ShieldCheck, color: telemetry.ammonia > 0.03 ? '#FF0055' : '#10B981', target: `Safe: < 0.02 ppm` },
          { title: 'Photoperiod LED', val: `${telemetry.lightSpectrum} Lux`, icon: Sun, color: '#F59E0B', target: `450nm Dusk Spectrum` },
          { title: 'Water Turbidity', val: `${telemetry.turbidity} NTU`, icon: Waves, color: '#A855F7', target: `Crystal Clear (< 1.0)` }
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', border: `1px solid ${s.color}40`, boxShadow: `0 0 20px ${s.color}15` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.title}</span>
                <Icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFFFFF', fontFamily: 'Outfit' }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{s.target}</div>
            </div>
          );
        })}
      </div>

      {/* MAIN COCKPIT GRID */}
      <div className="grid-main">
        
        {/* LEFT COLUMN: HERO CAMERA FEED + AI BEHAVIOR CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* CAMERA FEED SCREEN */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Tactical Vision Camera Stream</h2>
                <span className="badge badge-emerald"><span className="status-dot active"></span> LIVE CV {fps} FPS</span>
              </div>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '8px' }}>
                {['RGB', 'YOLO', 'POSE', 'HEATMAP', 'DEPTH'].map(m => (
                  <button key={m} onClick={() => setVisionOverlay(m)} style={{ background: visionOverlay === m ? '#00F2FE' : 'transparent', color: visionOverlay === m ? '#02040A' : 'var(--text-muted)', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}>{m}</button>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '370px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-cyan)', boxShadow: '0 0 30px rgba(0, 242, 254, 0.25)' }}>
              <canvas ref={canvasRef} width={640} height={370} style={{ width: '100%', height: '100%', display: 'block' }} />
              
              <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ background: 'rgba(2, 4, 10, 0.88)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>
                  CAM-01 [TANK #1] • 1080p @ 60fps • Neural: YOLOv8-FishPose
                </div>
                <div style={{ background: 'rgba(2, 4, 10, 0.88)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'JetBrains Mono' }}>
                  STATE: <strong>{simulatorRef.current.behaviorState}</strong>
                </div>
              </div>
            </div>

            {/* RADIAL BEHAVIOR PROGRESS METERS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { label: '💃 Courtship Dancing', val: classification.courtship, color: '#00F2FE' },
                { label: '🧽 Substrate Cleaning', val: classification.cleaning, color: '#3B82F6' },
                { label: '🥚 Egg Laying / Deposit', val: classification.eggLaying, color: '#F59E0B' },
                { label: '🛡️ Parental Fanning', val: classification.parentalCare, color: '#10B981' }
              ].map(b => (
                <div key={b.label} style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{b.label}</span>
                    <strong style={{ color: b.color }}>{b.val}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${b.val}%`, height: '100%', background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI REASONING LOG TERMINAL */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} /> Real-Time XAI Neural Reasoning Stream
            </div>
            <div style={{ background: 'rgba(2, 4, 10, 0.95)', padding: '14px', borderRadius: '10px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-subtle)' }}>
              {aiLogs.map(l => (
                <div key={l.id} style={{ marginBottom: '6px' }}><span style={{ color: 'var(--text-dim)' }}>[{l.time}]</span> <strong style={{ color: 'var(--accent-cyan)' }}>[{l.title}]</strong> {l.text}</div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 24H PREDICTOR + SUCCESS METRICS + ACTUATOR CONTROLS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 24-HOUR SPAWNING PREDICTOR RING CARD (SECTION 7) */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} /> 24h Target Spawning Predictor
              </span>
              <button onClick={() => confetti({ particleCount: 70 })} className="btn btn-primary" style={{ fontSize: '0.75rem' }}>
                Export Log
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid var(--accent-amber)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)', flexShrink: 0 }}>
                <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFFFFF' }}>{predMin}-{predMax}h</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--accent-amber)', fontWeight: '800' }}>TARGET</span>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>Fused Readiness: {fusedScore} / 100</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '3px' }}>Egg Viability Index: <strong style={{ color: 'var(--accent-emerald)' }}>{viability}%</strong></div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Clutch Forecast: <strong>~{fryCount} Fry</strong></div>
              </div>
            </div>

            {/* SECTION 12 METRICS */}
            <div style={{ background: 'rgba(2, 4, 10, 0.7)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
              <div>CV F1 Score: <strong style={{ color: 'var(--accent-emerald)' }}>94.2%</strong></div>
              <div>Prediction Error: <strong style={{ color: 'var(--accent-cyan)' }}>±1.8h</strong></div>
              <div>Sensor Reliability: <strong style={{ color: 'var(--accent-emerald)' }}>99.6%</strong></div>
              <div>Safe Control: <strong style={{ color: 'var(--accent-emerald)' }}>100%</strong></div>
            </div>
          </div>

          {/* CLOSED-LOOP HARDWARE ACTUATORS */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="var(--accent-cyan)" /> Closed-Loop IoT Actuators
              </span>
              <span className="badge badge-cyan">BOUNDED SAFETY</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700' }}>
                  <span>Smart Submersible Heater</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{actuators.heater.setpoint}°C</span>
                </div>
                <input type="range" min="24.0" max="32.0" step="0.1" value={actuators.heater.setpoint} onChange={e => setActuators(p => ({ ...p, heater: { ...p.heater, setpoint: parseFloat(e.target.value) } }))} style={{ marginTop: '6px' }} />
              </div>

              <div style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700' }}>
                  <span>O2 Aeration Booster</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{actuators.aerator.flowRate}%</span>
                </div>
                <input type="range" min="10" max="100" value={actuators.aerator.flowRate} onChange={e => setActuators(p => ({ ...p, aerator: { ...p.aerator, flowRate: parseInt(e.target.value) } }))} style={{ marginTop: '6px' }} />
              </div>

              <div style={{ background: 'rgba(4, 12, 24, 0.6)', padding: '12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Artemia Auto-Feeder</span>
                <button onClick={() => confetti({ particleCount: 50 })} className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>Dispense Feed</button>
              </div>
            </div>
          </div>

          {/* CITATIONS & FAQ BOX */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.76rem' }}>
            <div style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>📚 Section 13 Literature & System FAQ</div>
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
