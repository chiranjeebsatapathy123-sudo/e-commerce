const express = require('express');
const router = express.Router();
const { protect, requirePermission } = require('../middleware/auth');
const {
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
  getUserWorkspaces,
  createNewWorkspace,
  modifyWorkspace,
  removeWorkspace,
  getUserRadarItems,
  addRadarItem,
  removeRadarItem,
  getAdminPendingActions,
  getAdminActionHistory,
  reviewAdminAction,
  getProductRecommendations,
  getHomeFeedRecommendations
} = require('../controllers/commerceBrainController');

const { optionalAuth } = require('../middleware/auth');

// Personalization
router.get('/preferences', protect, getUserPreferences);
router.put('/preferences', protect, updateUserPreferences);
router.post('/preferences/reset', protect, resetUserPreferences);

// Decision Workspace
router.get('/workspaces', protect, getUserWorkspaces);
router.post('/workspaces', protect, createNewWorkspace);
router.put('/workspaces/:id', protect, modifyWorkspace);
router.delete('/workspaces/:id', protect, removeWorkspace);

// Shopping Radar
router.get('/radar', protect, getUserRadarItems);
router.post('/radar', protect, addRadarItem);
router.delete('/radar/:id', protect, removeRadarItem);

// Recommendations
router.get('/recommendations/home', optionalAuth, getHomeFeedRecommendations);
router.get('/recommendations/:productId', optionalAuth, getProductRecommendations);

// Admin Action Approval
router.get('/actions/pending', requirePermission('analytics.read'), getAdminPendingActions);
router.get('/actions/history', requirePermission('analytics.read'), getAdminActionHistory);
router.post('/actions/:id/review', requirePermission('products.update'), reviewAdminAction);

module.exports = router;
