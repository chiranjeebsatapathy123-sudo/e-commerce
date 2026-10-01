/**
 * Decision Policy
 * Centralized decision gate for AI output based on risk and confidence.
 */
class DecisionPolicy {
  evaluateDecision(confidence, taskRisk, userRole = 'user') {
    let decision = 'REFUSE';

    if (taskRisk === 'HIGH') {
      if (userRole === 'admin' || userRole === 'Super Admin') {
        decision = 'REQUIRE_ADMIN_APPROVAL';
      } else {
        decision = 'REFUSE'; // Users cannot perform high risk actions
      }
    } else if (taskRisk === 'MODERATE') {
      if (confidence >= 0.7) {
        decision = 'REQUIRE_CONFIRMATION';
      } else {
        decision = 'ASK_USER'; // Need more clarification
      }
    } else {
      // LOW risk
      if (confidence >= 0.8) {
        decision = 'ANSWER';
      } else if (confidence >= 0.5) {
        decision = 'VERIFY'; // Ask user to verify or add disclaimer
      } else {
        decision = 'DELEGATE'; // Delegate to human support if available, or refuse politely
      }
    }

    return decision;
  }
}

module.exports = new DecisionPolicy();
