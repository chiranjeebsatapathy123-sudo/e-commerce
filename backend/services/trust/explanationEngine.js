/**
 * Explanation Engine
 * Generates human-readable explanations for AI recommendations, search results, and actions.
 */
class ExplanationEngine {
  /**
   * Generates a bulleted explanation for why a product was recommended.
   * @param {Object} product
   * @param {Object} context
   * @returns {Array<String>}
   */
  explainRecommendation(product, context) {
    const reasons = [];

    if (context.query && product.name.toLowerCase().includes(context.query.toLowerCase())) {
      reasons.push(`Direct match for your search "${context.query}"`);
    }

    if (context.preferences) {
      if (context.preferences.categories?.includes(product.category)) {
        reasons.push(`Matches your preferred category (${product.category})`);
      }
      if (context.preferences.budget && product.price <= context.preferences.budget) {
        reasons.push('Fits within your specified budget');
      }
    }

    if (product.stock > 0) {
      reasons.push('Currently in stock and ready to ship');
    }

    if (product.rating >= 4) {
      reasons.push(`Highly rated by verified buyers (${product.rating} stars)`);
    }

    if (context.recentViews?.includes(product.id)) {
      reasons.push('Based on items you recently viewed');
    }

    if (reasons.length === 0) {
      reasons.push('Selected by Spark AI for its overall value and relevance.');
    }

    return reasons;
  }

  /**
   * Generates a transparent explanation for AI action usage.
   * @param {String} action 
   */
  explainAction(action) {
    return `Executing autonomous action: ${action}. This action is governed by strict authorization policies.`;
  }
}

module.exports = new ExplanationEngine();
