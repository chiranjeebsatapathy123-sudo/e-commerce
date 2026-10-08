const { Product, Review, ProductReviewAnalysis } = require('../models');

const getAiStatus = async (req, res) => {
  try {
    // Generate pseudo-metrics for the AI Control Center (with real DB counts)
    const productCount = await Product.count();
    const staleAnalyses = await ProductReviewAnalysis.count({ where: { isStale: true } });

    res.json({
      systemHealth: 'Healthy',
      metrics: {
        aiProvider: 'SparkAI Hybrid Engine',
        modelStatus: 'Online',
        searchAiStatus: 'Online',
        embeddingStatus: 'Operational',
        recommendationStatus: 'Operational',
        reviewAnalysisQueue: staleAnalyses,
        voiceStatus: 'Ready',
        imageSearchStatus: 'Ready',
        averageLatency: '142ms'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const triggerJob = async (req, res) => {
  const { jobName } = req.body;
  try {
    if (jobName === 'regenerate_embeddings') {
      // In a real app this would queue a job
      return res.json({ message: 'Embedding generation job queued successfully.' });
    }
    if (jobName === 'reanalyze_reviews') {
      await ProductReviewAnalysis.update({ isStale: true }, { where: {} });
      return res.json({ message: 'Review re-analysis queued successfully.' });
    }
    if (jobName === 'clear_ai_cache') {
      return res.json({ message: 'AI Context cache cleared.' });
    }
    res.status(400).json({ message: 'Unknown job type' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAiStatus,
  triggerJob
};
