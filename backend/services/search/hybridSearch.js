const { Op } = require('sequelize');
const { Product } = require('../../models');
const { parseQueryWithAI } = require('./queryParser');
const { semanticSearch, cosineSimilarity } = require('./semanticSearch');

/**
 * Perform keyword-based retrieval with SQL filters
 */
const keywordRetrieval = async (parsedIntent) => {
  const queryOptions = {
    where: {}
  };

  const orConditions = [];

  // Match the original raw query just in case intent extraction stripped context
  if (parsedIntent.query) {
    const rawTokens = parsedIntent.query.split(' ').filter(t => t.length > 2);
    rawTokens.forEach(token => {
      orConditions.push({ name: { [Op.like]: `%${token}%` } });
      orConditions.push({ description: { [Op.like]: `%${token}%` } });
    });
  }

  // Exact attributes extracted by AI
  if (parsedIntent.searchTerms) {
    orConditions.push({ name: { [Op.like]: `%${parsedIntent.searchTerms}%` } });
  }

  if (orConditions.length > 0) {
    queryOptions.where[Op.or] = orConditions;
  }

  if (parsedIntent.category && parsedIntent.category !== 'All') {
    queryOptions.where.category = parsedIntent.category;
  }

  if (parsedIntent.minPrice || parsedIntent.maxPrice) {
    queryOptions.where.price = {};
    if (parsedIntent.minPrice) queryOptions.where.price[Op.gte] = parsedIntent.minPrice;
    if (parsedIntent.maxPrice) queryOptions.where.price[Op.lte] = parsedIntent.maxPrice;
  }

  // Hard cap to prevent memory bloat during candidate re-ranking
  queryOptions.limit = 50; 
  
  return await Product.findAll(queryOptions);
};

const rankCandidates = (candidates, parsedIntent, semanticResults = []) => {
  return candidates.map(product => {
    let keywordScore = 1.0;
    let semanticScore = 0.0;
    
    // Check if product was found in semantic search
    const semHit = semanticResults.find(sr => sr.product.id === product.id);
    if (semHit) {
      semanticScore = semHit.score;
    }

    // Boost if exact category matches extracted category
    if (parsedIntent.category && product.category.toLowerCase() === parsedIntent.category.toLowerCase()) {
      keywordScore += 0.5;
    }

    // Popularity/Quality signals
    const qualityScore = (product.rating || 0) * 0.1;
    const availabilityScore = product.stock > 0 ? 0.2 : 0;

    const finalScore = (keywordScore * 0.4) + (semanticScore * 0.4) + qualityScore + availabilityScore;

    return {
      product,
      score: finalScore,
      explanation: generateExplanation(product, parsedIntent)
    };
  }).sort((a, b) => b.score - a.score);
};

const generateExplanation = (product, parsedIntent) => {
  const reasons = [];
  if (parsedIntent.maxPrice && product.price <= parsedIntent.maxPrice) {
    reasons.push(`Within your $${parsedIntent.maxPrice} budget`);
  }
  if (parsedIntent.category && product.category.toLowerCase() === parsedIntent.category.toLowerCase()) {
    reasons.push(`Matches your ${parsedIntent.category} preference`);
  }
  
  if (reasons.length > 0) return reasons.join(' • ');
  return null;
};

const executeHybridSearch = async (rawQuery, options = {}) => {
  // 1. Understand Intent
  const parsedIntent = await parseQueryWithAI(rawQuery);
  if (options.filters) {
    Object.assign(parsedIntent, options.filters);
  }

  // 2. Keyword Retrieval (Database bounds)
  const keywordCandidates = await keywordRetrieval(parsedIntent);
  
  // 3. Semantic Retrieval (Fallback/Broadening)
  const semanticCandidates = await semanticSearch(rawQuery, 20);

  // Combine unique candidates
  const allCandidatesMap = new Map();
  keywordCandidates.forEach(p => allCandidatesMap.set(p.id, p));
  semanticCandidates.forEach(sr => allCandidatesMap.set(sr.product.id, sr.product));

  const uniqueCandidates = Array.from(allCandidatesMap.values());

  // 4. Rank Candidates
  const ranked = rankCandidates(uniqueCandidates, parsedIntent, semanticCandidates);
  
  // 5. Apply sorting override if user explicitly selected sorting (priceAsc etc)
  let finalResults = ranked;
  if (parsedIntent.sort) {
    if (parsedIntent.sort === 'priceAsc') {
      finalResults = finalResults.sort((a, b) => a.product.price - b.product.price);
    } else if (parsedIntent.sort === 'priceDesc') {
      finalResults = finalResults.sort((a, b) => b.product.price - a.product.price);
    } else if (parsedIntent.sort === 'rating') {
      finalResults = finalResults.sort((a, b) => b.product.rating - a.product.rating);
    }
  }

  return {
    parsedIntent,
    results: finalResults
  };
};

module.exports = {
  executeHybridSearch
};
