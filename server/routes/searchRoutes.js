const express = require('express');
const router = express.Router();
const { handleSearch, getRecommendationsForUser, findSimilarProducts } = require('../services/search/searchService');

// GET /api/search
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, useAI } = req.query;
    
    if (!q) {
      return res.json({ success: true, metadata: {}, products: [] });
    }

    const options = {
      useAI: useAI === 'true',
      filters: {}
    };

    if (category && category !== 'All') options.filters.category = category;
    if (minPrice) options.filters.minPrice = parseFloat(minPrice);
    if (maxPrice) options.filters.maxPrice = parseFloat(maxPrice);
    if (sort) options.filters.sort = sort;

    const userId = req.user ? req.user.id : null;
    const sessionId = req.headers['x-session-id'] || req.ip;

    const results = await handleSearch(q, options, userId, sessionId);
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// GET /api/search/suggestions
router.get('/suggestions', async (req, res) => {
  // Simple autocomplete implementation based on categories and popular queries.
  // In a real DB we'd query SearchQuery grouping by text
  const { q } = req.query;
  if (!q) return res.json({ suggestions: [] });
  
  const suggestions = [];
  const lowerQ = q.toLowerCase();
  
  if ("electronics".includes(lowerQ)) suggestions.push("Electronics");
  if ("fashion".includes(lowerQ)) suggestions.push("Fashion");
  if ("smartwatch".includes(lowerQ)) suggestions.push("Smartwatch");
  if ("laptop".includes(lowerQ)) suggestions.push("Laptops under 50000");
  
  res.json({ suggestions });
});

// GET /api/search/recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = parseInt(req.query.limit) || 8;
    const recs = await getRecommendationsForUser(userId, limit);
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    console.error('Rec error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
