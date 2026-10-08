/**
 * Model Router
 * Routes tasks to appropriate AI models based on risk, complexity, and capability.
 */
class ModelRouter {
  constructor() {
    this.models = {
      lightweight: { id: 'spark-nano-1.0', costPer1k: 0.01, latency: 'fast' },
      standard: { id: 'spark-base-2.0', costPer1k: 0.05, latency: 'medium' },
      heavy: { id: 'spark-pro-3.0', costPer1k: 0.15, latency: 'slow' }
    };
  }

  /**
   * Determine best model
   * @param {Object} task
   * @param {String} task.type - e.g. 'classification', 'chat', 'comparison', 'high-risk'
   */
  route(task) {
    if (task.type === 'classification' || task.type === 'intent') {
      return this.models.lightweight;
    }
    
    if (task.type === 'high-risk' || task.type === 'comparison' || task.type === 'complex-reasoning') {
      return this.models.heavy;
    }

    return this.models.standard;
  }
}

module.exports = new ModelRouter();
