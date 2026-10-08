const evidenceEngine = require('./evidenceEngine');
const riskEngine = require('./riskEngine');
const confidenceEngine = require('./confidenceEngine');
const decisionPolicy = require('./decisionPolicy');

/**
 * Trust Engine
 * The main entry point for evaluating AI outputs.
 */
class TrustEngine {
  /**
   * Evaluate a proposed AI response.
   * @param {Object} context
   * @param {String} context.intent
   * @param {Array} context.evidenceList - e.g. [{ source: 'database', timestamp: '2023-10-25...', data: {} }]
   * @param {String} context.userRole
   */
  evaluate(context) {
    const { intent, evidenceList, userRole } = context;

    const evidenceMetrics = evidenceEngine.evaluateEvidence(evidenceList);
    const riskMetrics = riskEngine.evaluateRisk(intent);
    const confidence = confidenceEngine.calculateConfidence(evidenceMetrics);
    
    let verificationStatus = 'UNVERIFIED';
    if (evidenceMetrics.quality === 'HIGH' && confidence >= 0.8) {
      verificationStatus = 'VERIFIED';
    }

    const decision = decisionPolicy.evaluateDecision(confidence, riskMetrics.taskRisk, userRole);

    return {
      decision,
      trustProfile: {
        confidence: Number(confidence.toFixed(2)),
        evidenceQuality: evidenceMetrics.quality,
        evidenceCount: evidenceMetrics.count,
        dataFreshness: evidenceMetrics.freshness,
        sourceAgreement: evidenceMetrics.agreement,
        verificationStatus,
        taskRisk: riskMetrics.taskRisk,
        limitations: riskMetrics.limitations,
      }
    };
  }
}

module.exports = new TrustEngine();
