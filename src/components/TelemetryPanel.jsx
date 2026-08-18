import React from 'react';
import { Thermometer, Droplet, Wind, Activity, Sun, ShieldAlert, Sparkles, Waves } from 'lucide-react';

export const TelemetryPanel = ({ telemetry, species }) => {
  const opt = species.optimalSensors;

  // Sensor evaluation helpers
  const getStatus = (val, target, min, max) => {
    if (val < min) return { label: 'LOW ALERT', color: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.12)' };
    if (val > max) return { label: 'HIGH ALERT', color: 'var(--accent-rose)', bg: 'rgba(239, 68, 68, 0.12)' };
    return { label: 'OPTIMAL', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)' };
  };

  const tempStatus = getStatus(telemetry.temperature, opt.temperature.target, opt.temperature.min, opt.temperature.max);
  const phStatus = getStatus(telemetry.ph, opt.ph.target, opt.ph.min, opt.ph.max);
  const doStatus = getStatus(telemetry.dissolvedOxygen, opt.dissolvedOxygen.target, opt.dissolvedOxygen.min, opt.dissolvedOxygen.max);

  const sensors = [
    {
      id: 'temp',
      title: 'Water Temperature',
      val: `${telemetry.temperature} °C`,
      target: `Target: ${opt.temperature.target}°C (${opt.temperature.min}-${opt.temperature.max})`,
      icon: Thermometer,
      status: tempStatus,
      progress: Math.min(100, Math.max(0, ((telemetry.temperature - 20) / 15) * 100))
    },
    {
      id: 'ph',
      title: 'pH Level',
      val: `${telemetry.ph} pH`,
      target: `Target: ${opt.ph.target} pH (${opt.ph.min}-${opt.ph.max})`,
      icon: Droplet,
      status: phStatus,
      progress: Math.min(100, Math.max(0, ((telemetry.ph - 5) / 5) * 100))
    },
    {
      id: 'do',
      title: 'Dissolved Oxygen (DO)',
      val: `${telemetry.dissolvedOxygen} mg/L`,
      target: `Target: ${opt.dissolvedOxygen.target} mg/L (> ${opt.dissolvedOxygen.min})`,
      icon: Wind,
      status: doStatus,
      progress: Math.min(100, Math.max(0, (telemetry.dissolvedOxygen / 10) * 100))
    },
    {
      id: 'ammonia',
      title: 'Ammonia (NH3)',
      val: `${telemetry.ammonia} ppm`,
      target: `Max safe: ${opt.ammonia.max} ppm`,
      icon: ShieldAlert,
      status: telemetry.ammonia > opt.ammonia.max 
        ? { label: 'TOXIC', color: 'var(--accent-rose)', bg: 'rgba(239, 68, 68, 0.12)' }
        : { label: 'SAFE', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)' },
      progress: Math.min(100, (telemetry.ammonia / 0.1) * 100)
    },
    {
      id: 'light',
      title: 'Photoperiod & Spectrum',
      val: `${telemetry.lightSpectrum} Lux`,
      target: `Spectrum: 450nm Moon Phase`,
      icon: Sun,
      status: { label: 'ACTIVE', color: 'var(--accent-cyan)', bg: 'rgba(0, 242, 254, 0.12)' },
      progress: Math.min(100, (telemetry.lightSpectrum / 1000) * 100)
    },
    {
      id: 'turbidity',
      title: 'Water Clarity / Turbidity',
      val: `${telemetry.turbidity} NTU`,
      target: `Crystal clear (< 1.0 NTU)`,
      icon: Waves,
      status: { label: 'CLEAR', color: 'var(--accent-cyan)', bg: 'rgba(0, 242, 254, 0.12)' },
      progress: Math.min(100, (telemetry.turbidity / 2) * 100)
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={20} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            Multi-Parameter Environmental IoT Telemetry
          </h2>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>
          Sampling Rate: 10 Hz (Realtime)
        </span>
      </div>

      {/* Grid of Sensor Telemetry Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div
              key={sensor.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ padding: '6px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.08)', color: 'var(--accent-cyan)' }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {sensor.title}
                  </span>
                </div>
                
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    color: sensor.status.color,
                    background: sensor.status.bg,
                    border: `1px solid ${sensor.status.color}33`
                  }}
                >
                  {sensor.status.label}
                </span>
              </div>

              {/* Sensor Reading Value */}
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                  {sensor.val}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {sensor.target}
                </div>
              </div>

              {/* Dynamic Range Bar */}
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${sensor.progress}%`,
                    height: '100%',
                    background: sensor.status.color,
                    borderRadius: '2px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
