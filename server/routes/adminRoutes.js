const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, requirePermission } = require('../middleware/auth');

router.use(protect);

const { getSearchIntelligence, reindexProducts } = require('../controllers/searchAnalyticsController');
const { getReviewIntelligence, updateReviewStatus } = require('../controllers/adminReviewController');
const { getAiStatus, triggerJob } = require('../controllers/adminAiController');
const {
  getRevenueAnalytics,
  getInventoryIntelligence,
  getInventoryForecast,
  getSalesForecast,
  getAnomalies,
  getAllAlerts,
  updateAlertResolution,
  updateAlertAcknowledgement,
  askCopilot
} = require('../controllers/adminIntelligenceController');

// Intelligence & Analytics
router.get('/analytics/revenue', requirePermission('analytics.read'), getRevenueAnalytics);
router.get('/inventory/health', requirePermission('analytics.read'), getInventoryIntelligence);
router.get('/inventory/forecast', requirePermission('analytics.read'), getInventoryForecast);
router.get('/sales/forecast', requirePermission('analytics.read'), getSalesForecast);
router.get('/anomalies', requirePermission('analytics.read'), getAnomalies);

// Alerts
router.get('/alerts', requirePermission('analytics.read'), getAllAlerts);
router.post('/alerts/:id/resolve', requirePermission('products.update'), updateAlertResolution);
router.post('/alerts/:id/acknowledge', requirePermission('products.update'), updateAlertAcknowledgement);

// Copilot
router.post('/copilot', askCopilot); // Copilot handles its own RBAC internally

// Legacy analytics for fallback
router.get('/analytics', requirePermission('analytics.read'), getAnalytics);
router.get('/search-intelligence', requirePermission('analytics.read'), getSearchIntelligence);
router.post('/search/reindex', requirePermission('products.update'), reindexProducts);

router.get('/reviews/intelligence', requirePermission('analytics.read'), getReviewIntelligence);
router.put('/reviews/:id/status', requirePermission('products.update'), updateReviewStatus);

router.get('/ai/status', requirePermission('analytics.read'), getAiStatus);
router.post('/ai/jobs', requirePermission('products.update'), triggerJob);

// Phase 13: Trust, Quality & Opportunities
router.get('/opportunities', requirePermission('analytics.read'), async (req, res) => {
  const oppEngine = require('../services/commerceBrain/opportunityEngine');
  res.json(oppEngine.detectOpportunities({ lowStockItems: [], topFailedSearches: ['example'], lowConversionProducts: [] }));
});

router.get('/ai/quality', requirePermission('analytics.read'), (req, res) => {
  res.json({ status: "Insufficient data to display AI quality metrics at this time." });
});

router.get('/ai/incidents', requirePermission('analytics.read'), (req, res) => {
  res.json({ incidents: [] });
});

router.get('/ai/experiments', requirePermission('analytics.read'), (req, res) => {
  res.json({ experiments: [] });
});

router.get('/ai/traces/:id', requirePermission('analytics.read'), (req, res) => {
  res.json({ id: req.params.id, status: 'mock_trace', duration: 120, confidence: 0.9, risk: 'LOW' });
});

router.post('/products', requirePermission('products.create'), createProduct);
router.put('/products/:id', requirePermission('products.update'), updateProduct);
router.delete('/products/:id', requirePermission('products.delete'), deleteProduct);
router.get('/orders', requirePermission('orders.read'), getAllOrders);
router.put('/orders/:id', requirePermission('orders.update'), updateOrderStatus);
router.get('/users', requirePermission('users.read'), getAllUsers);
router.put('/users/:id', requirePermission('users.update'), updateUserRole);

module.exports = router;
