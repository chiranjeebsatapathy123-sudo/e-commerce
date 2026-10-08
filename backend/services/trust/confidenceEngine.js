/**
 * Confidence Engine
 * Calculates a numerical confidence score (0.0 to 1.0) based on evidence.
 */
class ConfidenceEngine {
  calculateConfidence(evidenceMetrics) {
    let baseScore = 0.5;

    // Adjust based on evidence count
    if (evidenceMetrics.count === 0) return 0.1;
    if (evidenceMetrics.count >= 3) baseScore += 0.2;
    else if (evidenceMetrics.count >= 1) baseScore += 0.1;

    // Adjust based on quality
    if (evidenceMetrics.quality === 'HIGH') baseScore += 0.2;
    else if (evidenceMetrics.quality === 'LOW') baseScore -= 0.2;

    // Adjust based on freshness
    if (evidenceMetrics.freshness === 'CURRENT') baseScore += 0.1;
    else if (evidenceMetrics.freshness === 'STALE') baseScore -= 0.1;

    // Adjust based on agreement
    if (evidenceMetrics.agreement === 'STRONG') baseScore += 0.1;
    else if (evidenceMetrics.agreement === 'WEAK') baseScore -= 0.1;

    // Ensure within bounds
    return Math.max(0.01, Math.min(0.99, baseScore));
  }
}

module.exports = new ConfidenceEngine();
