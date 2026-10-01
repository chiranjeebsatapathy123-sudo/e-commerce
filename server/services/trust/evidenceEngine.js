/**
 * Evidence Engine
 * Evaluates the quality, freshness, and count of evidence supporting an AI response.
 */
class EvidenceEngine {
  evaluateEvidence(evidenceList = []) {
    if (!evidenceList || evidenceList.length === 0) {
      return {
        quality: 'NONE',
        count: 0,
        freshness: 'UNKNOWN',
        agreement: 'NONE',
      };
    }

    const count = evidenceList.length;
    let qualityScore = 0;
    let freshnessScore = 0;

    evidenceList.forEach((ev) => {
      // Evaluate source authority
      if (ev.source === 'database' || ev.source === 'verified_review' || ev.source === 'policy') {
        qualityScore += 1;
      } else if (ev.source === 'user_history') {
        qualityScore += 0.8;
      } else {
        qualityScore += 0.5;
      }

      // Evaluate freshness
      const ageHours = ev.timestamp ? (Date.now() - new Date(ev.timestamp).getTime()) / (1000 * 60 * 60) : 24;
      if (ageHours < 1) freshnessScore += 1;
      else if (ageHours < 24) freshnessScore += 0.8;
      else freshnessScore += 0.5;
    });

    const avgQuality = qualityScore / count;
    const avgFreshness = freshnessScore / count;

    let quality = 'LOW';
    if (avgQuality >= 0.8) quality = 'HIGH';
    else if (avgQuality >= 0.5) quality = 'MEDIUM';

    let freshness = 'STALE';
    if (avgFreshness >= 0.8) freshness = 'CURRENT';
    else if (avgFreshness >= 0.5) freshness = 'RECENT';

    // Source agreement mock (in a real system, we would calculate semantic similarity between evidence pieces)
    const agreement = count > 1 ? 'STRONG' : 'WEAK';

    return {
      quality,
      count,
      freshness,
      agreement,
    };
  }
}

module.exports = new EvidenceEngine();
