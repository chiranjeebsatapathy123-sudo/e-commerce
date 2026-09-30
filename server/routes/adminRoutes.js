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

router.get('/analytics', requirePermission('analytics.read'), getAnalytics);
router.get('/search-intelligence', requirePermission('analytics.read'), getSearchIntelligence);
router.post('/search/reindex', requirePermission('products.update'), reindexProducts);

router.get('/reviews/intelligence', requirePermission('analytics.read'), getReviewIntelligence);
router.put('/reviews/:id/status', requirePermission('products.update'), updateReviewStatus);

router.get('/ai/status', requirePermission('analytics.read'), getAiStatus);
router.post('/ai/jobs', requirePermission('products.update'), triggerJob);

router.post('/products', requirePermission('products.create'), createProduct);
router.put('/products/:id', requirePermission('products.update'), updateProduct);
router.delete('/products/:id', requirePermission('products.delete'), deleteProduct);
router.get('/orders', requirePermission('orders.read'), getAllOrders);
router.put('/orders/:id', requirePermission('orders.update'), updateOrderStatus);
router.get('/users', requirePermission('users.read'), getAllUsers);
router.put('/users/:id', requirePermission('users.update'), updateUserRole);

module.exports = router;
