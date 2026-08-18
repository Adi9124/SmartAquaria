import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { VisionSimulator } from './components/VisionSimulator';
import { TelemetryPanel } from './components/TelemetryPanel';
import { ActuatorControl } from './components/ActuatorControl';
import { AIAdvisor } from './components/AIAdvisor';
import { SpawningAnalytics } from './components/SpawningAnalytics';
import { ScenarioSimulator } from './components/ScenarioSimulator';

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
        setDbStatus('SQLite DB Connected (Port 5000)');
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

    // Sync event with SQLite DB
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

    // Periodic telemetry persistence to Express REST API & SQLite DB every 6 seconds
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
        <span>⚡ <strong>3-Tier Full-Stack Active</strong>: Express REST API (Port 5000) persistent connection to <code>smart_aquaria.db</code></span>
        <span className="badge badge-emerald">{dbStatus}</span>
      </div>

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
