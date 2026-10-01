/**
 * Risk Engine
 * Evaluates the risk associated with a given intent or tool action.
 */
class RiskEngine {
  evaluateRisk(intent, requestedAction = null) {
    let taskRisk = 'LOW';
    let limitations = [];

    // Simple rule-based risk evaluation
    const highRiskKeywords = ['delete', 'refund', 'cancel', 'admin', 'update_role', 'archive', 'payment', 'discount'];
    const moderateRiskKeywords = ['order_status', 'address', 'preferences', 'cart', 'compare'];

    const actionString = (intent + ' ' + (requestedAction || '')).toLowerCase();

    if (highRiskKeywords.some(kw => actionString.includes(kw))) {
      taskRisk = 'HIGH';
      limitations.push('Requires explicit authorization');
    } else if (moderateRiskKeywords.some(kw => actionString.includes(kw))) {
      taskRisk = 'MODERATE';
    }

    return {
      taskRisk,
      limitations,
    };
  }
}

module.exports = new RiskEngine();
