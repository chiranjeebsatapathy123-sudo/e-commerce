const { Product, ProductRelationship } = require('../../models');
const { Op } = require('sequelize');
const sequelize = require('../../config/db');
const explanationEngine = require('../trust/explanationEngine');

/**
 * Seed basic relationships based on categories.
 * In a real-world system, this would be populated asynchronously via ML jobs.
 */
const seedRelationships = async () => {
  const count = await ProductRelationship.count();
  if (count > 0) return; // Already seeded

  const products = await Product.findAll();
  
  for (const product of products) {
    const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id);
    
    // Add 2 SIMILAR, 2 ALTERNATIVE, 1 LOWER_PRICE
    const rels = [];
    
    // Pick similar
    if (sameCategory.length > 0) {
      rels.push({
        sourceProductId: product.id,
        targetProductId: sameCategory[0].id,
        relationshipType: 'SIMILAR',
        confidenceScore: 0.9,
        reason: 'Similar category and specifications'
      });
    }

    if (sameCategory.length > 1) {
      rels.push({
        sourceProductId: product.id,
        targetProductId: sameCategory[1].id,
        relationshipType: 'ALTERNATIVE',
        confidenceScore: 0.8,
        reason: 'Popular alternative in the same category'
      });
    }

    // Lower price
    const lowerPrice = sameCategory.find(p => parseFloat(p.price) < parseFloat(product.price));
    if (lowerPrice) {
      rels.push({
        sourceProductId: product.id,
        targetProductId: lowerPrice.id,
        relationshipType: 'LOWER_PRICE',
        confidenceScore: 0.95,
        reason: 'A more budget-friendly option'
      });
    }

    await ProductRelationship.bulkCreate(rels);
  }
};

const getRecommendations = async (productId, userId, personalizationPrefs = {}) => {
  if (!personalizationPrefs.personalizedRecommendations && Object.keys(personalizationPrefs).length > 0) {
    // Return empty or neutral catalog if disabled
    return [];
  }

  const rels = await ProductRelationship.findAll({
    where: { sourceProductId: productId },
    order: [['confidenceScore', 'DESC']]
  });

  const targetIds = rels.map(r => r.targetProductId);
  
  const products = await Product.findAll({
    where: { id: { [Op.in]: targetIds } }
  });

  return products.map(p => {
    const rel = rels.find(r => r.targetProductId === p.id);
    return {
      product: p,
      score: rel.confidenceScore,
      relationship: rel.relationshipType,
      reason: rel.reason,
      detailedExplanation: explanationEngine.explainRecommendation(p, { preferences: personalizationPrefs })
    };
  });
};

const getHomeRecommendations = async (userId, personalizationPrefs = {}) => {
  if (!personalizationPrefs.personalizedRecommendations && Object.keys(personalizationPrefs).length > 0) {
    return [];
  }

  // Generic recommendation for home feed based on random or popular relationships
  const rels = await ProductRelationship.findAll({
    order: sequelize.random(),
    limit: 4
  });

  const targetIds = rels.map(r => r.targetProductId);
  
  const products = await Product.findAll({
    where: { id: { [Op.in]: targetIds } }
  });

  return products.map(p => {
    const rel = rels.find(r => r.targetProductId === p.id);
    return {
      product: p,
      score: rel.confidenceScore,
      relationship: rel.relationshipType,
      reason: 'Recommended for you based on shopping trends',
      detailedExplanation: explanationEngine.explainRecommendation(p, { preferences: personalizationPrefs })
    };
  });
};

module.exports = {
  seedRelationships,
  getRecommendations,
  getHomeRecommendations
};
