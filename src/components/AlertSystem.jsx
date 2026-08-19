import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, Bell, BellOff, Volume2, VolumeX, ShieldAlert, Zap, X, ChevronRight } from 'lucide-react';

export const AlertSystem = ({ telemetry, species, behaviorState, fusedScore, onEmergencyO2, onAutoFix }) => {
  const [alerts, setAlerts] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Generate active alerts dynamically based on real-time telemetry & AI metrics
  useEffect(() => {
    const activeList = [];
    const opt = species.optimalSensors;

    // 1. Temperature Anomaly Check
    if (telemetry.temperature < opt.temperature.min) {
      activeList.push({
        id: 'TEMP_LOW',
        severity: 'CRITICAL',
        title: 'Thermal Drop Shock Alert',
        message: `Water temperature dropped to ${telemetry.temperature.toFixed(1)}°C (Below ${opt.temperature.min}°C threshold). Risk of breeding failure!`,
        actionText: 'Stabilize Heater',
        actionType: 'HEATER'
      });
    } else if (telemetry.temperature > opt.temperature.max) {
      activeList.push({
        id: 'TEMP_HIGH',
        severity: 'WARNING',
        title: 'Elevated Thermal Warning',
        message: `Water temperature risen to ${telemetry.temperature.toFixed(1)}°C (Above ${opt.temperature.max}°C threshold).`,
        actionText: 'Cool Tank',
        actionType: 'HEATER'
      });
    }

    // 2. pH Anomaly Check
    if (telemetry.ph < opt.ph.min) {
      activeList.push({
        id: 'PH_LOW',
        severity: 'CRITICAL',
        title: 'Acidic pH Shift Shock',
        message: `Water pH dropped to ${telemetry.ph.toFixed(2)} pH (Acidic shock risk for ${species.name}).`,
        actionText: 'Dose pH Buffer',
        actionType: 'PH_DOSING'
      });
    } else if (telemetry.ph > opt.ph.max) {
      activeList.push({
        id: 'PH_HIGH',
        severity: 'WARNING',
        title: 'Alkaline pH Shift Warning',
        message: `Water pH rose to ${telemetry.ph.toFixed(2)} pH (Target: ${opt.ph.target} pH).`,
        actionText: 'Adjust Buffer',
        actionType: 'PH_DOSING'
      });
    }

    // 3. Low Oxygen (Hypoxia) Danger Check
    if (telemetry.dissolvedOxygen < opt.dissolvedOxygen.min) {
      activeList.push({
        id: 'O2_LOW',
        severity: 'CRITICAL',
        title: 'Hypoxia / Low Oxygen Danger',
        message: `Dissolved Oxygen critically low at ${telemetry.dissolvedOxygen.toFixed(1)} mg/L (Below ${opt.dissolvedOxygen.min} mg/L safety line).`,
        actionText: 'Emergency O2 Boost',
        actionType: 'EMERGENCY_O2'
      });
    }

    // 4. Ammonia Toxicity Spike Check
    if (telemetry.ammonia > opt.ammonia.max) {
      activeList.push({
        id: 'AMMONIA_SPIKE',
        severity: 'CRITICAL',
        title: 'Toxic Ammonia (NH3) Anomaly Spike',
        message: `Ammonia level reached ${telemetry.ammonia.toFixed(3)} ppm! Toxic spike detected!`,
        actionText: 'Trigger Purifier Dosing',
        actionType: 'AMMONIA_PURGE'
      });
    }

    // 5. Spawning Imminent High Readiness Alert
    if (fusedScore >= 85) {
      activeList.push({
        id: 'SPAWNING_IMMINENT',
        severity: 'SUCCESS',
        title: 'High Breeding Readiness Detected',
        message: `Fused Readiness Score: ${fusedScore}/100. Target 24h egg-laying window active! Prepare substrate tile.`,
        actionText: 'View 24h Predictor',
        actionType: 'VIEW_PREDICTION'
      });
    }

    // Filter out user-dismissed alert IDs
    const filtered = activeList.filter(a => !dismissedAlerts.includes(a.id));
    setAlerts(filtered);

    // Play synthesized Web Audio chime for critical alerts
    if (audioEnabled && filtered.some(a => a.severity === 'CRITICAL')) {
      playAlertChime();
    }
  }, [telemetry, species, fusedScore, dismissedAlerts, audioEnabled]);

  // Synthesize soft alert chime using browser Web Audio API
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context policy fallback
    }
  };

  const handleDismiss = (id) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  const handleActionClick = (alert) => {
    if (alert.actionType === 'EMERGENCY_O2') {
      onEmergencyO2();
    } else if (onAutoFix) {
      onAutoFix(alert.actionType);
    }
    handleDismiss(alert.id);
  };

  if (alerts.length === 0) {
    return (
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--accent-emerald)',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} color="var(--accent-emerald)" />
          <span><strong>All Systems Nominal</strong>: Water chemistry & fish behavior parameters within optimal species safety bounds.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-emerald">6/6 Sensors Normal</span>
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={audioEnabled ? "Mute alert audio chimes" : "Enable alert audio chimes"}
          >
            {audioEnabled ? <Volume2 size={16} color="var(--accent-cyan)" /> : <VolumeX size={16} color="var(--text-dim)" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL';
        const isWarning = alert.severity === 'WARNING';
        const isSuccess = alert.severity === 'SUCCESS';

        const bgColor = isCritical ? 'rgba(239, 68, 68, 0.14)' : isWarning ? 'rgba(245, 158, 11, 0.14)' : 'rgba(16, 185, 129, 0.14)';
        const borderColor = isCritical ? 'rgba(239, 68, 68, 0.45)' : isWarning ? 'rgba(245, 158, 11, 0.45)' : 'rgba(16, 185, 129, 0.45)';
        const textColor = isCritical ? 'var(--accent-rose)' : isWarning ? 'var(--accent-amber)' : 'var(--accent-emerald)';
        const Icon = isCritical ? ShieldAlert : isWarning ? AlertTriangle : CheckCircle;

        return (
          <div
            key={alert.id}
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: isCritical ? '0 0 20px rgba(239, 68, 68, 0.25)' : 'none',
              animation: isCritical ? 'pulse-alert 2s infinite ease-in-out' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
              <div style={{
                background: borderColor,
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} color="#FFFFFF" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: textColor }}>
                    {alert.title}
                  </span>
                  <span className={`badge ${isCritical ? 'badge-rose' : isWarning ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                    {alert.severity}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {alert.message}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleActionClick(alert)}
                className={`btn ${isCritical ? 'btn-danger' : 'btn-primary'}`}
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              >
                <Zap size={14} /> {alert.actionText}
              </button>

              <button
                onClick={() => handleDismiss(alert.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Dismiss alert notification"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
