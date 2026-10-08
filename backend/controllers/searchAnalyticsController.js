const { SearchQuery, ProductEmbedding, Product } = require('../models');
const { Op } = require('sequelize');

const getSearchIntelligence = async (req, res) => {
  try {
    const totalSearches = await SearchQuery.count();
    const uniqueQueries = await SearchQuery.count({ distinct: true, col: 'query' });
    const aiAssistedCount = await SearchQuery.count({ where: { isAiAssisted: true } });
    
    // Zero-result queries
    const zeroResultQueries = await SearchQuery.findAll({
      where: { resultCount: 0 },
      attributes: ['query', [Product.sequelize.fn('COUNT', 'id'), 'occurrences'], [Product.sequelize.fn('MAX', 'createdAt'), 'lastSeen']],
      group: ['query'],
      order: [[Product.sequelize.fn('COUNT', 'id'), 'DESC']],
      limit: 10
    });

    const topQueries = await SearchQuery.findAll({
      attributes: ['query', [Product.sequelize.fn('COUNT', 'id'), 'occurrences']],
      group: ['query'],
      order: [[Product.sequelize.fn('COUNT', 'id'), 'DESC']],
      limit: 10
    });

    // Embedding coverage
    const totalProducts = await Product.count();
    const embeddedProducts = await ProductEmbedding.count({ where: { isStale: false } });

    res.json({
      success: true,
      metrics: {
        totalSearches,
        uniqueQueries,
        aiAssistedCount,
        zeroResultRate: totalSearches > 0 ? (await SearchQuery.count({ where: { resultCount: 0 } }) / totalSearches).toFixed(2) : 0,
        embeddingCoverage: totalProducts > 0 ? (embeddedProducts / totalProducts).toFixed(2) : 0
      },
      topQueries,
      zeroResultQueries
    });
  } catch (err) {
    console.error('Search Intelligence Error:', err);
    res.status(500).json({ success: false, error: 'Failed to load search analytics' });
  }
};

const reindexProducts = async (req, res) => {
  try {
    // In a real app this would trigger a background job to rebuild embeddings.
    // For now, we'll just invalidate all existing embeddings so they rebuild on next search.
    await ProductEmbedding.update({ isStale: true }, { where: {} });
    res.json({ success: true, message: 'Reindexing started' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to start reindexing' });
  }
};

module.exports = {
  getSearchIntelligence,
  reindexProducts
};
