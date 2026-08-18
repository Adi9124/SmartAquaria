import React, { useRef, useEffect, useState } from 'react';
import { Camera, Eye, Zap, Target, Layers, Play, Pause, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

export const VisionSimulator = ({ simulator, species, mode, setMode }) => {
  const canvasRef = useRef(null);
  const [visionOverlay, setVisionOverlay] = useState('YOLO'); // RGB, YOLO, POSE, HEATMAP, DEPTH
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(60);

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

      // Calculate FPS
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // 1. Draw Background Water Environment / Aquarium Scene
      if (visionOverlay === 'DEPTH') {
        const depthGrad = ctx.createLinearGradient(0, 0, width, height);
        depthGrad.addColorStop(0, '#000000');
        depthGrad.addColorStop(0.5, '#444444');
        depthGrad.addColorStop(1, '#FFFFFF');
        ctx.fillStyle = depthGrad;
        ctx.fillRect(0, 0, width, height);
      } else if (visionOverlay === 'HEATMAP') {
        ctx.fillStyle = '#050B14';
        ctx.fillRect(0, 0, width, height);
        // Draw activity heat map around nest & courtship area
        const heatGrad = ctx.createRadialGradient(280, 260, 10, 280, 260, 180);
        heatGrad.addColorStop(0, 'rgba(255, 0, 80, 0.6)');
        heatGrad.addColorStop(0.4, 'rgba(255, 180, 0, 0.4)');
        heatGrad.addColorStop(0.8, 'rgba(0, 242, 254, 0.15)');
        heatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = heatGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Natural Dark Aquatic Tank Gradient
        const tankGrad = ctx.createLinearGradient(0, 0, 0, height);
        tankGrad.addColorStop(0, '#0B1C2D');
        tankGrad.addColorStop(0.7, '#071320');
        tankGrad.addColorStop(1, '#040A12');
        ctx.fillStyle = tankGrad;
        ctx.fillRect(0, 0, width, height);

        // Substrate Sand & Breeding Tile Slate
        ctx.fillStyle = '#0F2636';
        ctx.fillRect(0, height - 40, width, 40);

        // Slate Breeding Tile (for Discus/Clownfish)
        ctx.save();
        ctx.fillStyle = '#1C3144';
        ctx.strokeStyle = '#00F2FE';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(simulator.nest.x - 35, simulator.nest.y - 15, 80, 45, 6);
        ctx.fill();
        ctx.stroke();

        // Render Eggs deposited on tile
        for (let i = 0; i < Math.min(simulator.nest.eggCount, 120); i++) {
          const row = Math.floor(i / 15);
          const col = i % 15;
          const ex = simulator.nest.x - 30 + col * 4.5;
          const ey = simulator.nest.y - 10 + row * 4.5;

          ctx.fillStyle = '#FF9F43';
          ctx.beginPath();
          ctx.arc(ex, ey, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Air Bubbles Rising from Aerator Valve
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        for (let i = 0; i < 8; i++) {
          const bx = 80 + Math.sin(simulator.time * 2 + i) * 6;
          const by = (height - 40 - (simulator.time * 40 + i * 35) % (height - 60));
          ctx.beginPath();
          ctx.arc(bx, by, 2 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Render Fishes & AI Overlays
      const fishes = simulator.fishes;

      fishes.forEach((fish) => {
        if (visionOverlay === 'DEPTH') {
          // Render depth silouhette
          ctx.fillStyle = fish.type === 'Female' ? '#BBBBBB' : '#DDDDDD';
          ctx.beginPath();
          ctx.ellipse(fish.x, fish.y, fish.size * 0.8, fish.size * 0.4, Math.atan2(fish.vy, fish.vx), 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        // Calculate body angle
        const angle = Math.atan2(fish.vy || 0.1, fish.vx || 0.1);

        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.rotate(angle);

        // Fish Body Drawing (Crisp Vector Graphic)
        // Tail Fin
        ctx.fillStyle = fish.secondaryColor;
        ctx.beginPath();
        ctx.moveTo(-fish.size * 0.5, 0);
        ctx.lineTo(-fish.size * 0.9, -fish.size * 0.4 + Math.sin(simulator.time * 10) * 4);
        ctx.lineTo(-fish.size * 0.9, fish.size * 0.4 - Math.sin(simulator.time * 10) * 4);
        ctx.closePath();
        ctx.fill();

        // Body Oval
        const bodyGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, fish.size * 0.6);
        bodyGrad.addColorStop(0, fish.color);
        bodyGrad.addColorStop(1, fish.secondaryColor);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, fish.size * 0.6, fish.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(fish.size * 0.35, -fish.size * 0.1, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(fish.size * 0.37, -fish.size * 0.1, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 3. Vision Overlays
        if (visionOverlay === 'YOLO') {
          // Bounding Box
          const boxSize = fish.size * 1.6;
          const boxX = fish.x - boxSize / 2;
          const boxY = fish.y - boxSize / 2;

          ctx.strokeStyle = fish.type === 'Female' ? '#00F2FE' : '#FF6B6B';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(boxX, boxY, boxSize, boxSize);

          // Bounding Box Tag Label
          ctx.fillStyle = fish.type === 'Female' ? 'rgba(0, 242, 254, 0.85)' : 'rgba(255, 107, 107, 0.85)';
          ctx.fillRect(boxX, boxY - 20, boxSize, 18);
          ctx.fillStyle = '#060913';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.fillText(`${fish.type} (${(fish.confidence * 100).toFixed(0)}%)`, boxX + 4, boxY - 7);

          // Velocity Vector Arrow
          ctx.strokeStyle = '#FFE66D';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(fish.x, fish.y);
          ctx.lineTo(fish.x + fish.vx * 25, fish.y + fish.vy * 25);
          ctx.stroke();
        }

        if (visionOverlay === 'POSE') {
          // Render Pose Skeleton Skeleton
          const pose = fish.poseSkeleton;
          if (pose && pose.length > 0) {
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(pose[0].x, pose[0].y);
            for (let i = 1; i < pose.length; i++) {
              ctx.lineTo(pose[i].x, pose[i].y);
            }
            ctx.stroke();

            // Keypoint circles
            pose.forEach((pt) => {
              ctx.fillStyle = '#00F2FE';
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }
      });

      // Distance line between female & male pair
      if (fishes.length >= 2 && visionOverlay !== 'RGB') {
        const dx = fishes[0].x - fishes[1].x;
        const dy = fishes[0].y - fishes[1].y;
        const distPx = Math.sqrt(dx * dx + dy * dy).toFixed(0);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(fishes[0].x, fishes[0].y);
        ctx.lineTo(fishes[1].x, fishes[1].y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label distance
        ctx.fillStyle = '#00F2FE';
        ctx.font = '11px JetBrains Mono';
        ctx.fillText(`Pair Dist: ${distPx}px`, (fishes[0].x + fishes[1].x) / 2 - 25, (fishes[0].y + fishes[1].y) / 2 - 8);
      }

      if (isPlaying) {
        simulator.tick({}, mode);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [simulator, visionOverlay, isPlaying, mode]);

  const classification = simulator.aiClassification;

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header & Vision Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Camera size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            Real-Time AI Computer Vision Camera Feed
          </h2>
          <span className="badge badge-emerald">
            <span className="status-dot active"></span> LIVE CV {fps} FPS
          </span>
        </div>

        {/* Vision Overlay Modes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'RGB', label: 'RGB Stream', icon: Eye },
            { id: 'YOLO', label: 'YOLO Boxes', icon: Target },
            { id: 'POSE', label: 'Pose Estimation', icon: Layers },
            { id: 'HEATMAP', label: 'Activity Heatmap', icon: BarChart2 },
            { id: 'DEPTH', label: 'Depth Perception', icon: Zap }
          ].map((modeBtn) => {
            const Icon = modeBtn.icon;
            const active = visionOverlay === modeBtn.id;
            return (
              <button
                key={modeBtn.id}
                onClick={() => setVisionOverlay(modeBtn.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: active ? 'var(--accent-cyan)' : 'transparent',
                  color: active ? '#060913' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} />
                {modeBtn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Video Screen Canvas Container */}
      <div style={{ position: 'relative', width: '100%', height: '360px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-cyan)' }}>
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          style={{ width: '100%', height: '100%', display: 'block', background: '#060913' }}
        />

        {/* Top Camera Overlay HUD */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ background: 'rgba(6, 9, 19, 0.75)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)', border: '1px solid var(--border-cyan)' }}>
            CAM-01 [TANK #1] • 1080p @ 60fps • Neural Model: {classification.modelName}
          </div>

          <div style={{ background: 'rgba(6, 9, 19, 0.75)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'JetBrains Mono', border: '1px solid var(--border-cyan)' }}>
            BEHAVIOR: <span style={{ fontWeight: '800', color: '#FFFFFF' }}>{simulator.behaviorState}</span>
          </div>
        </div>

        {/* Bottom Play/Pause & Telemetry Controls HUD */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'rgba(6, 9, 19, 0.8)' }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause Feed' : 'Resume Feed'}
          </button>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(6, 9, 19, 0.8)', padding: '4px 12px', borderRadius: '6px' }}>
            Eggs Deposited: <span style={{ color: 'var(--accent-amber)', fontWeight: '700' }}>{simulator.nest.eggCount} / {simulator.nest.maxEggs}</span> ({simulator.spawningProgress}%)
          </div>
        </div>
      </div>

      {/* AI Behavioral Classifier Confidence Meters */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color="var(--accent-cyan)" /> AI Neural Behavioral Classification Breakdown
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Confidence Interval: 98.4%
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {[
            { key: 'courtship', label: '💃 Courtship Dancing', val: classification.courtship, color: '#00F2FE' },
            { key: 'cleaning', label: '🧽 Substrate Cleaning', val: classification.cleaning, color: '#3B82F6' },
            { key: 'eggLaying', label: '🥚 Egg Laying / Deposit', val: classification.eggLaying, color: '#F59E0B' },
            { key: 'parentalCare', label: '🛡️ Parental Fanning', val: classification.parentalCare, color: '#10B981' },
            { key: 'aggression', label: '⚔️ Territorial Aggression', val: classification.aggression, color: '#EF4444' }
          ].map((item) => (
            <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: '700', color: item.color }}>{item.val}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${item.val}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
