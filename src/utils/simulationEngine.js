/**
 * SmartAquaria Simulation Engine
 * Manages 2D real-time fish kinematics, behavioral AI metrics, telemetry sensor dynamics,
 * and closed-loop IoT actuator responses.
 */

export class AquariaSimulator {
  constructor(speciesProfile) {
    this.species = speciesProfile;
    this.time = 0;
    this.behaviorState = 'IDLE'; // IDLE, COURTSHIP, CLEANING, EGG_LAYING, PARENTAL, AGGRESSION
    this.spawningProgress = 0; // 0 to 100%
    
    // Fish entities (Male & Female pair + optional rival)
    this.fishes = [
      {
        id: 'FISH-01',
        type: 'Female',
        label: 'Female (Gravid)',
        x: 220,
        y: 200,
        vx: 0.8,
        vy: 0.2,
        size: 38,
        color: '#00F2FE',
        secondaryColor: '#4FACFE',
        tailAngle: 0,
        shimmy: 0,
        poseSkeleton: [],
        confidence: 0.96
      },
      {
        id: 'FISH-02',
        type: 'Male',
        label: 'Male (Alpha)',
        x: 320,
        y: 210,
        vx: -0.6,
        vy: -0.3,
        size: 42,
        color: '#FF6B6B',
        secondaryColor: '#FFE66D',
        tailAngle: 0,
        shimmy: 0,
        poseSkeleton: [],
        confidence: 0.94
      }
    ];

    // Substrate / Egg Nest Location
    this.nest = {
      x: 270,
      y: 340,
      radius: 45,
      eggCount: 0,
      maxEggs: 240,
      cleaned: 15
    };

    // Telemetry Sensor Values initialized to optimal
    this.telemetry = {
      temperature: speciesProfile.optimalSensors.temperature.target,
      ph: speciesProfile.optimalSensors.ph.target,
      dissolvedOxygen: speciesProfile.optimalSensors.dissolvedOxygen.target,
      ammonia: speciesProfile.optimalSensors.ammonia.target,
      nitrate: speciesProfile.optimalSensors.nitrate.target,
      lightSpectrum: speciesProfile.optimalSensors.lightSpectrum.target,
      turbidity: speciesProfile.optimalSensors.turbidity.target,
      timestamp: new Date()
    };

    // AI Classification Confidences
    this.aiClassification = {
      courtship: 12,
      cleaning: 5,
      eggLaying: 0,
      parentalCare: 2,
      aggression: 4,
      modelName: 'YOLOv8-FishPose-v4',
      fps: 58,
      activeTrackingIds: 2
    };

    // Spawning Timeline Log
    this.eventLogs = [
      { id: 1, time: '10 mins ago', title: 'System Initialized', type: 'system', text: 'IoT Gateway connected to Tank #1 sensors.' }
    ];
  }

  setSpecies(speciesProfile) {
    this.species = speciesProfile;
    this.telemetry.temperature = speciesProfile.optimalSensors.temperature.target;
    this.telemetry.ph = speciesProfile.optimalSensors.ph.target;
    this.telemetry.dissolvedOxygen = speciesProfile.optimalSensors.dissolvedOxygen.target;
    this.nest.eggCount = 0;
    this.spawningProgress = 0;
    this.behaviorState = 'IDLE';
  }

  // Primary tick function (called at ~30 FPS or canvas requestAnimationFrame)
  tick(actuatorState, mode = 'NORMAL') {
    this.time += 0.05;

    // 1. Update Telemetry based on Actuators & Drift
    this.updateTelemetry(actuatorState);

    // 2. Determine Behavior State based on Telemetry & Progress
    this.evaluateAIBehavior(mode);

    // 3. Move Fishes based on current behavior state
    this.updateFishKinematics();

    // 4. Update Spawning progress & eggs if egg laying
    if (this.behaviorState === 'EGG_LAYING') {
      if (this.nest.eggCount < this.nest.maxEggs) {
        this.nest.eggCount += Math.random() < 0.3 ? 1 : 0;
      }
      this.spawningProgress = Math.min(100, Math.round((this.nest.eggCount / this.nest.maxEggs) * 100));
    }
  }

  updateTelemetry(actuators) {
    // Temperature drift towards setpoint if heater is AUTO/ON, else slight ambient drift
    const targetTemp = actuators.heater?.setpoint || this.species.optimalSensors.temperature.target;
    const tempDiff = targetTemp - this.telemetry.temperature;
    this.telemetry.temperature += tempDiff * 0.02 + (Math.random() - 0.5) * 0.01;

    // pH drift
    const targetPh = this.species.optimalSensors.ph.target;
    const phDiff = targetPh - this.telemetry.ph;
    this.telemetry.ph += phDiff * 0.01 + (Math.random() - 0.5) * 0.005;

    // Dissolved Oxygen driven by aerator flow
    const targetDO = (actuators.aerator?.flowRate / 100) * 8.5 || 7.2;
    this.telemetry.dissolvedOxygen += (targetDO - this.telemetry.dissolvedOxygen) * 0.03 + (Math.random() - 0.5) * 0.02;

    // Light
    const targetLight = (actuators.ledLighting?.brightness / 100) * 600 || 350;
    this.telemetry.lightSpectrum += (targetLight - this.telemetry.lightSpectrum) * 0.1;

    // Clamp precision
    this.telemetry.temperature = parseFloat(this.telemetry.temperature.toFixed(2));
    this.telemetry.ph = parseFloat(this.telemetry.ph.toFixed(2));
    this.telemetry.dissolvedOxygen = parseFloat(this.telemetry.dissolvedOxygen.toFixed(2));
    this.telemetry.lightSpectrum = Math.round(this.telemetry.lightSpectrum);
    this.telemetry.timestamp = new Date();
  }

  evaluateAIBehavior(mode) {
    if (mode === 'SIMULATE_SPAWNING_CYCLE') {
      // Step through cycle linearly
      const cycleStep = Math.floor((this.time % 60) / 12);
      if (cycleStep === 0) {
        this.behaviorState = 'COURTSHIP';
        this.aiClassification = { courtship: 94, cleaning: 28, eggLaying: 5, parentalCare: 10, aggression: 8 };
      } else if (cycleStep === 1) {
        this.behaviorState = 'CLEANING';
        this.aiClassification = { courtship: 42, cleaning: 91, eggLaying: 15, parentalCare: 12, aggression: 5 };
      } else if (cycleStep === 2) {
        this.behaviorState = 'EGG_LAYING';
        this.aiClassification = { courtship: 18, cleaning: 35, eggLaying: 96, parentalCare: 45, aggression: 2 };
      } else if (cycleStep === 3) {
        this.behaviorState = 'PARENTAL';
        this.aiClassification = { courtship: 10, cleaning: 8, eggLaying: 12, parentalCare: 93, aggression: 6 };
      } else {
        this.behaviorState = 'COURTSHIP';
        this.aiClassification = { courtship: 88, cleaning: 15, eggLaying: 8, parentalCare: 20, aggression: 11 };
      }
      return;
    }

    if (mode === 'SIMULATE_AGGRESSION') {
      this.behaviorState = 'AGGRESSION';
      this.aiClassification = { courtship: 5, cleaning: 2, eggLaying: 0, parentalCare: 4, aggression: 97 };
      return;
    }

    // Dynamic evaluation based on environmental harmony
    const tempOpt = Math.abs(this.telemetry.temperature - this.species.optimalSensors.temperature.target) < 1.0;
    const phOpt = Math.abs(this.telemetry.ph - this.species.optimalSensors.ph.target) < 0.3;

    if (tempOpt && phOpt) {
      if (this.nest.eggCount > 180) {
        this.behaviorState = 'PARENTAL';
        this.aiClassification = { courtship: 15, cleaning: 10, eggLaying: 20, parentalCare: 92, aggression: 5 };
      } else if (this.nest.cleaned >= 80) {
        this.behaviorState = 'EGG_LAYING';
        this.aiClassification = { courtship: 30, cleaning: 45, eggLaying: 94, parentalCare: 30, aggression: 4 };
      } else if (this.time > 15) {
        this.behaviorState = 'CLEANING';
        this.nest.cleaned = Math.min(100, this.nest.cleaned + 0.2);
        this.aiClassification = { courtship: 45, cleaning: 88, eggLaying: 12, parentalCare: 8, aggression: 6 };
      } else {
        this.behaviorState = 'COURTSHIP';
        this.aiClassification = { courtship: 92, cleaning: 22, eggLaying: 4, parentalCare: 5, aggression: 9 };
      }
    } else {
      this.behaviorState = 'IDLE';
      this.aiClassification = { courtship: 25, cleaning: 12, eggLaying: 2, parentalCare: 10, aggression: 35 };
    }
  }

  updateFishKinematics() {
    const f1 = this.fishes[0];
    const f2 = this.fishes[1];

    if (this.behaviorState === 'COURTSHIP') {
      // Synchronized circular swimming pattern around center
      const centerX = 280;
      const centerY = 200;
      const radius = 60;
      const speed = 0.04;

      f1.x = centerX + Math.cos(this.time * speed) * radius;
      f1.y = centerY + Math.sin(this.time * speed) * radius;
      f1.vx = -Math.sin(this.time * speed) * 1.5;
      f1.vy = Math.cos(this.time * speed) * 1.5;
      f1.shimmy = Math.sin(this.time * 8) * 12;

      f2.x = centerX + Math.cos(this.time * speed + Math.PI * 0.75) * (radius + 20);
      f2.y = centerY + Math.sin(this.time * speed + Math.PI * 0.75) * (radius + 20);
      f2.vx = -Math.sin(this.time * speed + Math.PI * 0.75) * 1.5;
      f2.vy = Math.cos(this.time * speed + Math.PI * 0.75) * 1.5;
      f2.shimmy = Math.sin(this.time * 8 + 1) * 14;
    } else if (this.behaviorState === 'CLEANING' || this.behaviorState === 'EGG_LAYING') {
      // Hovering closely near the substrate nest
      f1.x = this.nest.x - 20 + Math.sin(this.time * 2) * 15;
      f1.y = this.nest.y - 45 + Math.cos(this.time * 3) * 10;
      f1.shimmy = Math.sin(this.time * 12) * 5;

      f2.x = this.nest.x + 25 + Math.cos(this.time * 2) * 15;
      f2.y = this.nest.y - 40 + Math.sin(this.time * 2.5) * 10;
      f2.shimmy = Math.sin(this.time * 10) * 6;
    } else if (this.behaviorState === 'PARENTAL') {
      // Female directly over nest fanning pectoral fins, Male patrolling perimeter
      f1.x = this.nest.x;
      f1.y = this.nest.y - 35 + Math.sin(this.time * 4) * 4;
      f1.shimmy = Math.sin(this.time * 15) * 8; // high fin fanning

      f2.x = 280 + Math.cos(this.time * 0.5) * 140;
      f2.y = 180 + Math.sin(this.time * 0.7) * 40;
      f2.vx = -Math.sin(this.time * 0.5) * 2;
    } else if (this.behaviorState === 'AGGRESSION') {
      // Rapid erratic darting and fin flaring facing each other
      const dist = Math.sin(this.time * 6) * 30;
      f1.x = 240 + dist;
      f1.y = 200 + Math.cos(this.time * 8) * 15;
      f1.shimmy = 25;

      f2.x = 320 - dist;
      f2.y = 200 + Math.sin(this.time * 8) * 15;
      f2.shimmy = -25;
    } else {
      // Idle natural swimming with boundary reflection
      this.fishes.forEach((fish) => {
        fish.x += fish.vx;
        fish.y += fish.vy;
        fish.shimmy = Math.sin(this.time * 3) * 4;

        if (fish.x < 60 || fish.x > 500) fish.vx *= -1;
        if (fish.y < 80 || fish.y > 330) fish.vy *= -1;
      });
    }

    // Build synthetic 8-point skeleton pose for each fish
    this.fishes.forEach((fish) => {
      const angle = Math.atan2(fish.vy || 0.1, fish.vx || 0.1);
      const len = fish.size;
      fish.poseSkeleton = [
        { x: fish.x + Math.cos(angle) * (len * 0.5), y: fish.y + Math.sin(angle) * (len * 0.5) }, // Snout
        { x: fish.x, y: fish.y }, // Center
        { x: fish.x - Math.cos(angle) * (len * 0.4), y: fish.y - Math.sin(angle) * (len * 0.4) }, // Spine
        { x: fish.x - Math.cos(angle) * (len * 0.7), y: fish.y - Math.sin(angle) * (len * 0.7) }, // Tail Root
        { x: fish.x - Math.cos(angle + fish.shimmy * 0.05) * (len * 1.0), y: fish.y - Math.sin(angle + fish.shimmy * 0.05) * (len * 1.0) } // Tail Fin Tip
      ];
    });
  }

  logEvent(title, type, text) {
    this.eventLogs.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      title,
      type,
      text
    });
    if (this.eventLogs.length > 25) this.eventLogs.pop();
  }
}
