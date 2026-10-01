const { AIAction } = require('../../models');

const getPendingActions = async () => {
  return await AIAction.findAll({
    where: { status: 'pending' },
    order: [['createdAt', 'DESC']]
  });
};

const getActionHistory = async () => {
  return await AIAction.findAll({
    where: { status: ['approved', 'rejected', 'executed', 'failed'] },
    order: [['reviewedAt', 'DESC']],
    limit: 100
  });
};

const proposeAction = async (actionType, proposedBy, targetEntity, targetId, payload, reason, confidence = 0.8) => {
  return await AIAction.create({
    actionType,
    proposedBy,
    targetEntity,
    targetId,
    payload: JSON.stringify(payload),
    reason,
    confidence
  });
};

const reviewAction = async (id, adminUserId, status, executeActionCallback) => {
  const action = await AIAction.findByPk(id);
  if (!action) throw new Error('Action not found');

  action.status = status;
  action.reviewedBy = adminUserId;
  action.reviewedAt = new Date();
  
  if (status === 'approved' && executeActionCallback) {
    try {
      const result = await executeActionCallback(action);
      action.status = 'executed';
      action.resultPayload = JSON.stringify(result);
    } catch (e) {
      action.status = 'failed';
      action.resultPayload = JSON.stringify({ error: e.message });
    }
  }

  await action.save();
  return action;
};

module.exports = {
  getPendingActions,
  getActionHistory,
  proposeAction,
  reviewAction
};
