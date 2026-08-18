import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'SmartAquaria Express REST API',
    database: 'SQLite 3 (smart_aquaria.db)',
    timestamp: new Date().toISOString()
  });
});

// 2. GET Telemetry Logs
app.get('/api/telemetry/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 30;
  const sql = `SELECT * FROM telemetry_logs ORDER BY id DESC LIMIT ?`;
  db.all(sql, [limit], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: rows.length, data: rows.reverse() });
  });
});

// 3. POST Log Live Telemetry Sensor Data
app.post('/api/telemetry/log', (req, res) => {
  const { tankId, temperature, ph, dissolvedOxygen, ammonia, nitrate, lightSpectrum, turbidity } = req.body;
  const sql = `
    INSERT INTO telemetry_logs (tank_id, temperature, ph, dissolved_oxygen, ammonia, nitrate, light_spectrum, turbidity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [tankId || 'TANK-01', temperature, ph, dissolvedOxygen, ammonia, nitrate, lightSpectrum, turbidity];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Telemetry reading persisted to SQLite DB' });
  });
});

// 4. GET Spawning Events Timeline
app.get('/api/spawning/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const sql = `SELECT * FROM spawning_events ORDER BY id DESC LIMIT ?`;
  db.all(sql, [limit], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: rows.length, data: rows });
  });
});

// 5. POST New Spawning Behavior Event
app.post('/api/spawning/events', (req, res) => {
  const { tankId, speciesId, behaviorState, eggCount, viabilityScore, fryForecast, logText } = req.body;
  const sql = `
    INSERT INTO spawning_events (tank_id, species_id, behavior_state, egg_count, viability_score, fry_forecast, log_text)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [tankId || 'TANK-01', speciesId || 'discus', behaviorState, eggCount, viabilityScore, fryForecast, logText];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Spawning event logged to SQLite DB' });
  });
});

// 6. POST Actuator Action Log
app.post('/api/actuators/log', (req, res) => {
  const { actuatorName, action, setpoint, triggerType } = req.body;
  const sql = `
    INSERT INTO actuator_logs (actuator_name, action, setpoint, trigger_type)
    VALUES (?, ?, ?, ?)
  `;
  const params = [actuatorName, action, setpoint, triggerType || 'MANUAL'];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Actuator log persisted to SQLite DB' });
  });
});

// 7. Serve Static Frontend Bundle from 'dist' directory
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback route for SPA Routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

// Start Unified Server
app.listen(PORT, () => {
  console.log(`🚀 SmartAquaria Unified Production Server running on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Serving Frontend UI from: ${distPath}`);
});
