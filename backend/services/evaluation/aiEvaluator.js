/**
 * AI Evaluator (Root Evaluator)
 * Coordinates evaluation of different AI subsystems.
 */
const answerEvaluator = require('./answerEvaluator');
const searchEvaluator = require('./searchEvaluator');
const recommendationEvaluator = require('./recommendationEvaluator');
const agentEvaluator = require('./agentEvaluator');

class AIEvaluator {
  /**
   * Evaluates a completed AI trace.
   * @param {Object} trace 
   */
  async evaluateTrace(trace) {
    const evaluation = {
      timestamp: new Date(),
      traceId: trace.id,
      agentEvaluation: await agentEvaluator.evaluate(trace),
      answerEvaluation: await answerEvaluator.evaluate(trace.answer, trace.evidence),
    };

    // In a real system, we would persist this to an AIQualityLog table
    return evaluation;
  }
}

module.exports = new AIEvaluator();
