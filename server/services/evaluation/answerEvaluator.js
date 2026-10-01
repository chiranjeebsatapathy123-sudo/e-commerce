/**
 * Answer Evaluator
 * Evaluates textual answers for hallucination risk and factual grounding.
 */
class AnswerEvaluator {
  async evaluate(answerText, evidence = []) {
    let groundedScore = 1.0;
    let hallucinationRisk = 'LOW';

    if (!evidence || evidence.length === 0) {
      if (answerText && answerText.length > 50) {
        // Long answer without evidence is high risk for hallucination
        hallucinationRisk = 'HIGH';
        groundedScore = 0.2;
      }
    } else {
      // Check if key terms in answer exist in evidence
      const hasNumbers = /\d+/.test(answerText);
      // If answer has numbers (prices, specs) they must be grounded
      if (hasNumbers) {
        const evidenceStr = JSON.stringify(evidence);
        const numbers = answerText.match(/\d+(\.\d+)?/g) || [];
        const ungroundedNumbers = numbers.filter(n => !evidenceStr.includes(n));
        
        if (ungroundedNumbers.length > 0) {
          hallucinationRisk = 'MODERATE';
          groundedScore -= (ungroundedNumbers.length * 0.1);
        }
      }
    }

    return {
      groundedScore: Math.max(0, groundedScore),
      hallucinationRisk,
      isFactuallyGrounded: groundedScore > 0.7
    };
  }
}

module.exports = new AnswerEvaluator();
