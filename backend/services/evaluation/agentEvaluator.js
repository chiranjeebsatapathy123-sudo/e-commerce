/**
 * Agent Evaluator
 * Evaluates agent performance, tool correctness, and permission correctness.
 */
class AgentEvaluator {
  async evaluate(trace) {
    let toolCorrectness = 1.0;
    let failureDetected = false;

    if (trace.error || trace.decision === 'REFUSE') {
      failureDetected = true;
    }

    if (trace.toolsCalled && trace.toolsCalled.length > 0) {
      // Check for redundant tools
      const uniqueTools = new Set(trace.toolsCalled);
      if (uniqueTools.size < trace.toolsCalled.length) {
        toolCorrectness -= 0.2; // Penalize for calling the same tool multiple times unnecessarily
      }
    }

    // Confidence calibration: Did the agent express high confidence on a failed task?
    let calibration = 'WELL_CALIBRATED';
    if (failureDetected && trace.confidence > 0.8) {
      calibration = 'OVERCONFIDENT';
    } else if (!failureDetected && trace.confidence < 0.4) {
      calibration = 'UNDERCONFIDENT';
    }

    return {
      toolCorrectness: Math.max(0, toolCorrectness),
      actionCorrectness: failureDetected ? 0 : 1,
      calibration,
      success: !failureDetected
    };
  }
}

module.exports = new AgentEvaluator();
