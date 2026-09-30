const { executeHybridSearch } = require('./hybridSearch');
const { getRecommendationsForUser, getPopularProducts, logInteraction } = require('./recommendationService');
const { findSimilarProducts } = require('./semanticSearch');
const { SearchQuery } = require('../../models');

const handleSearch = async (rawQuery, options, userId, sessionId) => {
  const startTime = Date.now();
  
  const searchResult = await executeHybridSearch(rawQuery, options);
  
  // Log search query for analytics and zero-result tracking
  try {
    await SearchQuery.create({
      query: rawQuery,
      resultCount: searchResult.results.length,
      isAiAssisted: options.useAI || false,
      userId: userId || null,
      sessionId: sessionId || null
    });
  } catch (err) {
    console.error('Failed to log search query:', err);
  }

  // Format response
  return {
    success: true,
    metadata: {
      latencyMs: Date.now() - startTime,
      totalResults: searchResult.results.length,
      intent: searchResult.parsedIntent
    },
    products: searchResult.results.map(r => ({
      ...r.product.toJSON(),
      _searchScore: r.score,
      _explanation: r.explanation
    }))
  };
};

module.exports = {
  handleSearch,
  getRecommendationsForUser,
  getPopularProducts,
  findSimilarProducts,
  logInteraction
};
