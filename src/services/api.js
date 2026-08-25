const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (window.location.origin.includes('localhost') ? 'http://localhost:8000/api' : '/api');

export const ApiService = {
  // Health check
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      console.warn('Backend API connection offline:', err.message);
      return null;
    }
  },

  // Post Telemetry Sensor Reading to SQLite
  async logTelemetry(telemetryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tankId: 'TANK-01',
          temperature: telemetryData.temperature,
          ph: telemetryData.ph,
          dissolvedOxygen: telemetryData.dissolvedOxygen,
          ammonia: telemetryData.ammonia,
          nitrate: telemetryData.nitrate,
          lightSpectrum: telemetryData.lightSpectrum,
          turbidity: telemetryData.turbidity
        })
      });
      return await res.json();
    } catch (err) {
      console.warn('Could not post telemetry to SQLite API:', err.message);
      return null;
    }
  },

  // Get Historical Telemetry
  async getTelemetryHistory(limit = 30) {
    try {
      const res = await fetch(`${API_BASE_URL}/telemetry/history?limit=${limit}`);
      return await res.json();
    } catch (err) {
      console.warn('Could not fetch telemetry history:', err.message);
      return null;
    }
  },

  // Post Spawning Behavior Event to SQLite
  async logSpawningEvent(eventData) {
    try {
      const res = await fetch(`${API_BASE_URL}/spawning/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      return await res.json();
    } catch (err) {
      console.warn('Could not post spawning event:', err.message);
      return null;
    }
  },

  // Post Actuator Command Log to SQLite
  async logActuatorAction(actionData) {
    try {
      const res = await fetch(`${API_BASE_URL}/actuators/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData)
      });
      return await res.json();
    } catch (err) {
      console.warn('Could not post actuator log to SQLite API:', err.message);
      return null;
    }
  },

  // Post Email Alert Notification to Python FastAPI & SQLite
  async sendEmailAlert(alertData) {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      return await res.json();
    } catch (err) {
      console.warn('Could not dispatch email alert notification:', err.message);
      return null;
    }
  },

  // Fetch Team 28 Breeding Report from Python FastAPI
  async getBreedingReport(tankId = 'TANK-01') {
    try {
      const res = await fetch(`${API_BASE_URL}/breeding/report?tankId=${tankId}`);
      return await res.json();
    } catch (err) {
      console.warn('Could not fetch breeding report from API:', err.message);
      return null;
    }
  }
};
