const { Product, UserInteraction, OrderItem } = require('../../models');
const { semanticSearch } = require('./semanticSearch');

const getPopularProducts = async (limit = 4) => {
  const products = await Product.findAll({
    order: [['rating', 'DESC'], ['reviewsCount', 'DESC']],
    limit
  });
  return products.map(p => ({ product: p, reason: 'Popular across our store' }));
};

const getRecentInteractions = async (userId) => {
  return await UserInteraction.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: 10,
    include: [{ model: Product }]
  });
};

const getRecommendationsForUser = async (userId, limit = 8) => {
  if (!userId) {
    return await getPopularProducts(limit);
  }

  const interactions = await getRecentInteractions(userId);
  
  if (interactions.length === 0) {
    return await getPopularProducts(limit);
  }

  // Content-based approach based on recent interactions
  const recentCategories = [...new Set(interactions.map(i => i.Product?.category).filter(Boolean))];
  const recentProductIds = interactions.map(i => i.productId);

  const recommendations = [];
  
  // Strategy 1: Same categories, highly rated
  if (recentCategories.length > 0) {
    const categoryRecs = await Product.findAll({
      where: { category: recentCategories },
      order: [['rating', 'DESC']],
      limit: 4
    });
    
    for (const p of categoryRecs) {
      if (!recentProductIds.includes(p.id) && !recommendations.find(r => r.product.id === p.id)) {
        recommendations.push({ product: p, reason: `Popular in ${p.category}` });
      }
    }
  }

  // Strategy 2: Semantic Similarity (Fallback or Expansion)
  if (recommendations.length < limit && interactions[0]?.Product) {
    // Search based on the last viewed item
    const semanticRecs = await semanticSearch(`${interactions[0].Product.name} ${interactions[0].Product.category}`, 5);
    for (const sr of semanticRecs) {
      if (!recentProductIds.includes(sr.product.id) && !recommendations.find(r => r.product.id === sr.product.id)) {
        recommendations.push({ product: sr.product, reason: `Because you viewed ${interactions[0].Product.name}` });
      }
    }
  }

  // Ensure limit
  let finalRecs = recommendations.slice(0, limit);

  // Fill up if still empty
  if (finalRecs.length < limit) {
    const popularFallback = await getPopularProducts(limit - finalRecs.length);
    for (const fb of popularFallback) {
      if (!recentProductIds.includes(fb.product.id) && !finalRecs.find(r => r.product.id === fb.product.id)) {
        finalRecs.push(fb);
      }
    }
  }

  return finalRecs;
};

const logInteraction = async (userId, sessionId, productId, type) => {
  try {
    await UserInteraction.create({
      userId: userId || null,
      sessionId: sessionId || null,
      productId,
      interactionType: type
    });
  } catch (err) {
    console.error('Error logging user interaction', err);
  }
};

module.exports = {
  getRecommendationsForUser,
  getPopularProducts,
  logInteraction
};
