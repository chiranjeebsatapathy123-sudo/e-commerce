/**
 * Experiment Engine
 * Support controlled experiments for AI response styles, ranking, etc.
 */
class ExperimentEngine {
  constructor() {
    this.experiments = new Map();
  }

  /**
   * Evaluates which variant a user should receive for a given experiment.
   * @param {String} experimentId
   * @param {String} userId
   * @returns {String} variantId
   */
  getVariant(experimentId, userId) {
    if (!this.experiments.has(experimentId)) {
      return 'control'; // Default to control if experiment doesn't exist
    }

    const exp = this.experiments.get(experimentId);
    if (exp.status !== 'RUNNING') {
      return 'control';
    }

    // Simple deterministic hash for consistent routing
    const hash = this._hashString(userId + experimentId);
    return hash % 2 === 0 ? 'variant_a' : 'control';
  }

  /**
   * Tracks an event for an experiment
   */
  trackEvent(experimentId, variantId, metric, value) {
    // In production, this persists to analytics DB
    // console.log(`[Experiment] ${experimentId} - ${variantId} -> ${metric}: ${value}`);
  }

  _hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

module.exports = new ExperimentEngine();
