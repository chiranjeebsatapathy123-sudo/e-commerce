const express = require('express');
const router = express.Router();
const { handleShoppingChat } = require('../services/ai/aiService');
const { Product } = require('../models');

// Rate limiting is theoretically applied globally or here
// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message is required' });
    }

    // In a real app, userId is extracted from req.user
    const userId = req.user ? req.user.id : null;

    const aiResponse = await handleShoppingChat(userId, message, history || []);
    
    res.json(aiResponse);
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ status: 'error', message: 'Spark AI is temporarily unavailable.', products: [] });
  }
});

// GET /api/ai/recommendations (mock for now, could use the actual recommendation service)
router.get('/recommendations', async (req, res) => {
  try {
    // Just fetch some top-rated products as a placeholder for actual ML recommendations
    const topProducts = await Product.findAll({
      order: [['rating', 'DESC']],
      limit: 4
    });
    res.json({ products: topProducts.map(p => p.id) });
  } catch (err) {
    console.error('AI Recommendations Error:', err);
    res.status(500).json({ status: 'error', message: 'Unavailable', products: [] });
  }
});

const { compareProducts } = require('../services/ai/reviewIntelligenceService');

router.post('/compare', async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ error: "Please provide at least 2 product IDs to compare" });
    }
    const result = await compareProducts(productIds.slice(0, 4));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Comparison failed' });
  }
});

module.exports = router;
