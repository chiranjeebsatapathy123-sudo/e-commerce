// server/services/ai/productContext.js
const { Product } = require('../../models');

/**
 * Format a single product to a string that can be injected into a prompt,
 * saving tokens by excluding heavy fields like images if not needed.
 */
const formatProductForAI = (product) => {
  return JSON.stringify({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewsCount,
    description: product.description
  });
};

/**
 * Retrieves specific products by ID for AI comparison or explanation.
 */
const getProductsContext = async (productIds = []) => {
  if (!productIds || productIds.length === 0) return '[]';
  
  try {
    const products = await Product.findAll({
      where: { id: productIds }
    });
    return products.map(formatProductForAI).join('\n');
  } catch (error) {
    console.error('Error fetching product context:', error);
    return 'Information not available.';
  }
};

/**
 * Retrieves products based on AI structured filters (intent extraction).
 */
const searchProductsForAI = async (filters) => {
  try {
    const whereClause = {};
    
    if (filters.category) {
      whereClause.category = filters.category;
    }
    
    // In a real app we'd use Op.lte for maxPrice, Op.gte for minPrice, etc.
    // Simplifying here to use basic Sequelize methods if available.
    // For now we'll fetch all matching category and filter in memory if needed to avoid deep Sequelize Op deps.
    
    let products = await Product.findAll({ where: whereClause, limit: 50 });
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minPrice) {
      products = products.filter(p => p.price >= filters.minPrice);
    }
    
    // Sort by rating desc by default
    products.sort((a, b) => b.rating - a.rating);
    
    // Limit to top 10 for context window safety
    const topCandidates = products.slice(0, 10);
    
    return {
      candidates: topCandidates,
      contextString: topCandidates.map(formatProductForAI).join('\n')
    };
  } catch (err) {
    console.error('Error searching products for AI:', err);
    return { candidates: [], contextString: 'Information not available.' };
  }
};

module.exports = {
  getProductsContext,
  searchProductsForAI,
  formatProductForAI
};
