/**
 * Opportunity Engine
 * Detects opportunities from real data (inventory, search, sales).
 */
class OpportunityEngine {
  /**
   * Generates a list of business opportunities.
   * In a production system, this would query databases for actual metrics.
   * @param {Object} metrics
   */
  detectOpportunities(metrics = {}) {
    const opportunities = [];

    // 1. High demand + low stock -> inventory opportunity
    if (metrics.lowStockItems && metrics.lowStockItems.length > 0) {
      opportunities.push({
        id: 'opp_' + Date.now(),
        type: 'INVENTORY_RISK',
        evidence: `Found ${metrics.lowStockItems.length} items with low stock but steady sales.`,
        impactEstimate: 'High impact on revenue retention.',
        confidence: 0.9,
        recommendedAction: 'Restock immediately',
        risk: 'LOW'
      });
    }

    // 2. High search volume + zero results -> catalogue opportunity
    if (metrics.topFailedSearches && metrics.topFailedSearches.length > 0) {
      opportunities.push({
        id: 'opp_' + (Date.now() + 1),
        type: 'CATALOGUE_GAP',
        evidence: `Users frequently search for "${metrics.topFailedSearches[0]}" but there are 0 results.`,
        impactEstimate: 'Potential new revenue stream.',
        confidence: 0.85,
        recommendedAction: 'Source new products matching failed searches.',
        risk: 'MODERATE'
      });
    }

    // 3. High views + low conversion -> product page opportunity
    if (metrics.lowConversionProducts && metrics.lowConversionProducts.length > 0) {
      opportunities.push({
        id: 'opp_' + (Date.now() + 2),
        type: 'CONVERSION_DROP',
        evidence: `Product "${metrics.lowConversionProducts[0].name}" has high views but <1% conversion.`,
        impactEstimate: 'Medium impact on overall conversion rate.',
        confidence: 0.8,
        recommendedAction: 'Review pricing, images, and description.',
        risk: 'LOW'
      });
    }

    return opportunities;
  }
}

module.exports = new OpportunityEngine();
