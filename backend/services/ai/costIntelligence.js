/**
 * Cost Intelligence Engine
 * Tracks AI provider usage and costs.
 */
class CostIntelligence {
  constructor() {
    this.usage = {
      requests: 0,
      totalCost: 0.0,
      modelUsage: {}
    };
  }

  track(modelId, requestType, inputTokens = 0, outputTokens = 0, costPer1k = 0) {
    const cost = ((inputTokens + outputTokens) / 1000) * costPer1k;
    
    this.usage.requests++;
    this.usage.totalCost += cost;

    if (!this.usage.modelUsage[modelId]) {
      this.usage.modelUsage[modelId] = { requests: 0, cost: 0.0 };
    }
    this.usage.modelUsage[modelId].requests++;
    this.usage.modelUsage[modelId].cost += cost;

    // In a real system, persist this to a database
    // console.log(`[CostIntel] Model: ${modelId}, Cost: $${cost.toFixed(4)}`);
  }
}

module.exports = new CostIntelligence();
