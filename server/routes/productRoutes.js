const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProductReview } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { findSimilarProducts } = require('../services/search/searchService');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

router.get('/:id/similar', async (req, res) => {
  try {
    const similar = await findSimilarProducts(req.params.id, 4);
    res.json({ products: similar.map(s => s.product) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching similar products' });
  }
});

const { getProductReviewAnalysis, askAboutProduct } = require('../services/ai/reviewIntelligenceService');

router.get('/:id/review-summary', async (req, res) => {
    try {
        const analysis = await getProductReviewAnalysis(req.params.id);
        res.json({ success: true, analysis });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch review summary' });
    }
});

router.post('/:id/ask', async (req, res) => {
    try {
        const response = await askAboutProduct(req.params.id, req.body.question);
        res.json({ success: true, ...response });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to process question' });
    }
});

module.exports = router;
