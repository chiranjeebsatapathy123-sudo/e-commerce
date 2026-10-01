const { getPreferences, updatePreferences, resetPreferences } = require('../services/commerceBrain/personalizationEngine');
const { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } = require('../services/commerceBrain/decisionEngine');
const { getRadarItems, addToRadar, removeFromRadar } = require('../services/commerceBrain/radarEngine');
const { getPendingActions, getActionHistory, reviewAction } = require('../services/commerceBrain/actionEngine');
const { getRecommendations, getHomeRecommendations } = require('../services/commerceBrain/recommendationEngine');

// --- Personalization Center ---
const getUserPreferences = async (req, res) => {
  try {
    const prefs = await getPreferences(req.user.id);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserPreferences = async (req, res) => {
  try {
    const prefs = await updatePreferences(req.user.id, req.body);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetUserPreferences = async (req, res) => {
  try {
    const prefs = await resetPreferences(req.user.id);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Decision Workspace ---
const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await getWorkspaces(req.user.id);
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewWorkspace = async (req, res) => {
  try {
    const { title, productIds } = req.body;
    const workspace = await createWorkspace(req.user.id, title, productIds);
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const modifyWorkspace = async (req, res) => {
  try {
    const workspace = await updateWorkspace(req.params.id, req.user.id, req.body);
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeWorkspace = async (req, res) => {
  try {
    await deleteWorkspace(req.params.id, req.user.id);
    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Shopping Radar ---
const getUserRadarItems = async (req, res) => {
  try {
    const items = await getRadarItems(req.user.id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addRadarItem = async (req, res) => {
  try {
    const { productId, targetPrice, notifyOnRestock, notifyOnPriceDrop } = req.body;
    const item = await addToRadar(req.user.id, productId, targetPrice, notifyOnRestock, notifyOnPriceDrop);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeRadarItem = async (req, res) => {
  try {
    await removeFromRadar(req.params.id, req.user.id);
    res.json({ message: 'Radar item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- AI Action Approval (Admin) ---
const getAdminPendingActions = async (req, res) => {
  try {
    const actions = await getPendingActions();
    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdminActionHistory = async (req, res) => {
  try {
    const history = await getActionHistory();
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const reviewAdminAction = async (req, res) => {
  try {
    const { status } = req.body;
    // Mock execute function for now
    const action = await reviewAction(req.params.id, req.user.id, status, async (act) => {
      // Mock execution based on action type
      return { success: true, timestamp: new Date() };
    });
    res.json(action);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Recommendations ---
const getProductRecommendations = async (req, res) => {
  try {
    const prefs = req.user ? await getPreferences(req.user.id) : {};
    const recs = await getRecommendations(req.params.productId, req.user?.id, prefs);
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHomeFeedRecommendations = async (req, res) => {
  try {
    const prefs = req.user ? await getPreferences(req.user.id) : {};
    const recs = await getHomeRecommendations(req.user?.id, prefs);
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
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
};
