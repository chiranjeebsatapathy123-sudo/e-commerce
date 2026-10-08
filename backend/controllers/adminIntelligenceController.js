const { getSalesMetrics } = require('../services/intelligence/salesAnalyticsService');
const { getInventoryHealth } = require('../services/intelligence/inventoryAnalyticsService');
const { getDemandForecast, getStockoutRisk } = require('../services/intelligence/forecastService');
const { detectSalesAnomalies } = require('../services/intelligence/anomalyService');
const { getAlerts, resolveAlert, acknowledgeAlert } = require('../services/intelligence/alertService');
const { handleCopilotQuery } = require('../services/intelligence/businessCopilotService');

const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to 30 days if not provided
    const start = startDate ? new Date(startDate) : (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d; })();
    const end = endDate ? new Date(endDate) : new Date();

    const metrics = await getSalesMetrics(start, end);
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInventoryIntelligence = async (req, res) => {
  try {
    const health = await getInventoryHealth();
    res.json(health);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInventoryForecast = async (req, res) => {
  try {
    const risk = await getStockoutRisk();
    res.json(risk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSalesForecast = async (req, res) => {
  try {
    // Basic forecasting placeholder for API - moving average approach already in forecastService
    // For now we can return anomalies as part of the sales forecast insight
    const anomalies = await detectSalesAnomalies();
    res.json({ anomalies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnomalies = async (req, res) => {
  try {
    const anomalies = await detectSalesAnomalies();
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAlerts = async (req, res) => {
  try {
    const alerts = await getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAlertResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;
    const alert = await resolveAlert(id, resolved);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAlertAcknowledgement = async (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledged } = req.body;
    const alert = await acknowledgeAlert(id, acknowledged);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const askCopilot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    
    // Pass req.user for RBAC checking within copilot service
    const response = await handleCopilotQuery(req.user, message);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRevenueAnalytics,
  getInventoryIntelligence,
  getInventoryForecast,
  getSalesForecast,
  getAnomalies,
  getAllAlerts,
  updateAlertResolution,
  updateAlertAcknowledgement,
  askCopilot
};
