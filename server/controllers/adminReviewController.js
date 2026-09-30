const { Review, Product, ProductReviewAnalysis } = require('../models');

const getReviewIntelligence = async (req, res) => {
  try {
    const totalReviews = await Review.count();
    const pendingReviews = await Review.count({ where: { status: 'Pending' } });
    const flaggedReviews = await Review.count({ where: { status: 'Flagged' } });
    
    const allAnalyses = await ProductReviewAnalysis.findAll();
    let totalPositiveThemes = 0;
    let totalNegativeThemes = 0;
    
    allAnalyses.forEach(a => {
        if (a.summary && a.summary.positive) totalPositiveThemes += a.summary.positive.length;
        if (a.summary && a.summary.negative) totalNegativeThemes += a.summary.negative.length;
    });

    const flaggedList = await Review.findAll({
        where: { status: ['Pending', 'Flagged'] },
        include: [{ model: Product, attributes: ['name'] }],
        order: [['createdAt', 'DESC']],
        limit: 50
    });

    res.json({
        metrics: {
            totalReviews,
            pendingReviews,
            flaggedReviews,
            totalPositiveThemes,
            totalNegativeThemes
        },
        flaggedList
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        
        review.status = status;
        await review.save();
        
        // Invalidate product review cache
        await ProductReviewAnalysis.update({ isStale: true }, { where: { ProductId: review.ProductId } });
        
        res.json({ success: true, message: 'Review updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  getReviewIntelligence,
  updateReviewStatus
};
