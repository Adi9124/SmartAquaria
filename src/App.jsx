import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { VisionSimulator } from './components/VisionSimulator';
import { TelemetryPanel } from './components/TelemetryPanel';
import { ActuatorControl } from './components/ActuatorControl';
import { AIAdvisor } from './components/AIAdvisor';
import { SpawningAnalytics } from './components/SpawningAnalytics';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { AlertSystem } from './components/AlertSystem';

import { SPECIES_PROFILES, INITIAL_ACTUATOR_STATE } from './data/speciesData';
import { AquariaSimulator } from './utils/simulationEngine';
import { ApiService } from './services/api';

export function App() {
  const [selectedSpecies, setSelectedSpecies] = useState(SPECIES_PROFILES[0]);
  const [aiMode, setAiMode] = useState(true);
  const [actuators, setActuators] = useState(INITIAL_ACTUATOR_STATE);
  const [scenarioMode, setScenarioMode] = useState('NORMAL');
  const [dbStatus, setDbStatus] = useState('Checking...');
  
  // Simulator Instance
  const simulatorRef = useRef(null);
  if (!simulatorRef.current) {
    simulatorRef.current = new AquariaSimulator(selectedSpecies);
  }

  const [telemetry, setTelemetry] = useState(simulatorRef.current.telemetry);
  const [aiLogs, setAiLogs] = useState(simulatorRef.current.eventLogs);
  const [simTime, setSimTime] = useState(0);

  // Check Backend Health on Mount
  useEffect(() => {
    ApiService.checkHealth().then((data) => {
      if (data && data.status === 'HEALTHY') {
        setDbStatus('SQLite DB Connected (Port 8000)');
      } else {
        setDbStatus('Local Memory Mode');
      }
    });
  }, []);

  // Switch species handler
  const handleSpeciesChange = (newSpecies) => {
    setSelectedSpecies(newSpecies);
    simulatorRef.current.setSpecies(newSpecies);
    simulatorRef.current.logEvent('Species Switched', 'system', `Active tank changed to ${newSpecies.name}`);
    setAiLogs([...simulatorRef.current.eventLogs]);

    ApiService.logSpawningEvent({
      tankId: 'TANK-01',
      speciesId: newSpecies.id,
      behaviorState: 'IDLE',
      eggCount: 0,
      viabilityScore: 98,
      fryForecast: 0,
      logText: `Switched species profile to ${newSpecies.name}`
    });
  };

  // Scenario trigger handler
  const handleTriggerScenario = (mode, logText) => {
    setScenarioMode(mode);
    simulatorRef.current.logEvent('Scenario Triggered', 'simulation', logText);
    setAiLogs([...simulatorRef.current.eventLogs]);

    if (mode === 'SIMULATE_TEMP_DROP') {
      simulatorRef.current.telemetry.temperature -= 2.5;
    } else if (mode === 'SIMULATE_AMMONIA_SPIKE') {
      simulatorRef.current.telemetry.ammonia = 0.08;
    } else if (mode === 'SIMULATE_HACKATHON_REPORT') {
      // Auto-select Discus species profile for the report
      const discusProfile = SPECIES_PROFILES.find(s => s.id === 'discus');
      if (discusProfile && selectedSpecies.id !== 'discus') {
        setSelectedSpecies(discusProfile);
        simulatorRef.current.setSpecies(discusProfile);
      }
      // Configure actuators to match report state
      setActuators(prev => ({
        ...prev,
        heater: { ...prev.heater, setpoint: 29.5, power: 65 },
        aerator: { ...prev.aerator, flowRate: 85 },
        ledLighting: { ...prev.ledLighting, brightness: 58 }
      }));
      // Force simulator telemetry & eggs to report snapshot values
      simulatorRef.current.telemetry.temperature = 29.5;
      simulatorRef.current.telemetry.ph = 6.2;
      simulatorRef.current.telemetry.dissolvedOxygen = 7.19;
      simulatorRef.current.telemetry.ammonia = 0.08;
      simulatorRef.current.telemetry.lightSpectrum = 350;
      simulatorRef.current.nest.eggCount = 177;
      simulatorRef.current.spawningProgress = Math.min(100, Math.round((177 / simulatorRef.current.nest.maxEggs) * 100));
      simulatorRef.current.logEvent('Report State Loaded', 'system', 'Team 28 Hackathon Breeding Report snapshot activated – 177 eggs, 0.08ppm NH3 anomaly, Fused Score calibrated.');
      setAiLogs([...simulatorRef.current.eventLogs]);
    }

    ApiService.logSpawningEvent({
      tankId: 'TANK-01',
      speciesId: selectedSpecies.id,
      behaviorState: mode,
      eggCount: simulatorRef.current.nest.eggCount,
      viabilityScore: 90,
      fryForecast: Math.round(simulatorRef.current.nest.eggCount * 0.9),
      logText
    });
  };

  const handleResetScenario = () => {
    setScenarioMode('NORMAL');
    simulatorRef.current.setSpecies(selectedSpecies);
    simulatorRef.current.logEvent('System Reset', 'system', 'Environment restored to baseline parameters.');
    setAiLogs([...simulatorRef.current.eventLogs]);
  };

  const handleEmergencyBoost = () => {
    setActuators(prev => ({
      ...prev,
      aerator: { ...prev.aerator, flowRate: 100 },
      heater: { ...prev.heater, setpoint: selectedSpecies.optimalSensors.temperature.target }
    }));
    simulatorRef.current.logEvent('Emergency O2 Boost', 'alert', 'Emergency O2 aeration forced to 100% capacity.');
    setAiLogs([...simulatorRef.current.eventLogs]);

    ApiService.logActuatorAction({
      actuatorName: 'Aerator / Oxygen Booster',
      action: 'Emergency O2 Boost to 100%',
      setpoint: 100,
      triggerType: 'EMERGENCY_OVERRIDE'
    });
  };

  const handleAutoFix = (actionType) => {
    if (actionType === 'HEATER') {
      setActuators(prev => ({
        ...prev,
        heater: { ...prev.heater, setpoint: selectedSpecies.optimalSensors.temperature.target }
      }));
      simulatorRef.current.telemetry.temperature = selectedSpecies.optimalSensors.temperature.target;
    } else if (actionType === 'PH_DOSING') {
      simulatorRef.current.telemetry.ph = selectedSpecies.optimalSensors.ph.target;
    } else if (actionType === 'AMMONIA_PURGE') {
      simulatorRef.current.telemetry.ammonia = selectedSpecies.optimalSensors.ammonia.target;
    }
    simulatorRef.current.logEvent('Auto-Correct Action Executed', 'actuator', `Auto-correct action executed for ${actionType}`);
    setAiLogs([...simulatorRef.current.eventLogs]);
  };

  const handleManualTrigger = (type, logMessage) => {
    simulatorRef.current.logEvent('Manual Actuator Command', 'actuator', logMessage);
    setAiLogs([...simulatorRef.current.eventLogs]);

    ApiService.logActuatorAction({
      actuatorName: type,
      action: logMessage,
      setpoint: 0,
      triggerType: 'MANUAL'
    });
  };

  // Sync simulator loop state with UI & push to SQLite DB periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulatorRef.current) {
        setTelemetry({ ...simulatorRef.current.telemetry });
        setSimTime(simulatorRef.current.time);
      }
    }, 100);

    const dbPersistInterval = setInterval(() => {
      if (simulatorRef.current) {
        ApiService.logTelemetry(simulatorRef.current.telemetry);
      }
    }, 6000);

    return () => {
      clearInterval(interval);
      clearInterval(dbPersistInterval);
    };
  }, []);

  // Fused score calculation for alerts
  const opt = selectedSpecies.optimalSensors;
  const tempVar = Math.abs(telemetry.temperature - opt.temperature.target);
  const phVar = Math.abs(telemetry.ph - opt.ph.target);
  const envStability = Math.max(0, 100 - (tempVar * 15 + phVar * 25));
  const behaviorScore = simulatorRef.current.aiClassification.courtship * 0.5 + simulatorRef.current.aiClassification.cleaning * 0.5;
  const fusedScore = Math.min(100, Math.round(envStability * 0.45 + behaviorScore * 0.55));

  return (
    <div className="app-container">
      
      {/* Top Navbar */}
      <Navbar
        selectedSpecies={selectedSpecies}
        setSelectedSpecies={handleSpeciesChange}
        aiMode={aiMode}
        setAiMode={setAiMode}
        onEmergencyBoost={handleEmergencyBoost}
        simTime={simTime}
      />

      {/* Database Connection Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
        <span>⚡ <strong>3-Tier Full-Stack Active</strong>: Python FastAPI REST Server (Port 8000) persistent connection to <code>smart_aquaria.db</code></span>
        <span className="badge badge-emerald">{dbStatus}</span>
      </div>

      {/* REAL-TIME IOT & AI ALERT SYSTEM BANNER */}
      <AlertSystem
        telemetry={telemetry}
        species={selectedSpecies}
        behaviorState={simulatorRef.current.behaviorState}
        fusedScore={fusedScore}
        onEmergencyO2={handleEmergencyBoost}
        onAutoFix={handleAutoFix}
      />

      {/* Interactive Scenario Control Toolbar */}
      <ScenarioSimulator
        onTriggerScenario={handleTriggerScenario}
        onReset={handleResetScenario}
      />

      {/* Main Grid */}
      <div className="grid-main">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Computer Vision Live Stream & Classification */}
          <VisionSimulator
            simulator={simulatorRef.current}
            species={selectedSpecies}
            mode={scenarioMode}
            setMode={setScenarioMode}
          />

          {/* Spawning Analytics & Egg Viability Forecast */}
          <SpawningAnalytics
            simulator={simulatorRef.current}
            species={selectedSpecies}
            telemetry={telemetry}
          />

          {/* AI Reasoning Log & Species Breeding Protocol Playbook */}
          <AIAdvisor
            simulator={simulatorRef.current}
            species={selectedSpecies}
            aiLogs={aiLogs}
            telemetry={telemetry}
            onTriggerReportScenario={() => handleTriggerScenario('SIMULATE_HACKATHON_REPORT', 'Loaded Team 28 Hackathon Breeding Report snapshot (177 eggs, 0.08ppm NH3, 29.5°C)')}
          />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Environmental IoT Telemetry Panel */}
          <TelemetryPanel
            telemetry={telemetry}
            species={selectedSpecies}
          />

          {/* Closed-Loop Actuators Hardware Control */}
          <ActuatorControl
            actuators={actuators}
            setActuators={setActuators}
            aiMode={aiMode}
            onManualTrigger={handleManualTrigger}
          />
        </div>

      </div>

    </div>
  );
}

export default App;
