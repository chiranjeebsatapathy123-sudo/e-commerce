const { BusinessAlert } = require('../../models');

/**
 * Creates an alert if it doesn't recently exist.
 */
const createAlert = async (category, severity, message, fingerprint, metadata = {}) => {
  try {
    // Deduplication check: Has this fingerprint been alerted and unresolved?
    const existing = await BusinessAlert.findOne({
      where: {
        fingerprint,
        resolved: false
      }
    });

    if (existing) {
      // Cooldown/Deduplication logic
      // For now, if an unresolved alert exists, we do not create a duplicate.
      return { status: 'deduplicated', alert: existing };
    }

    const newAlert = await BusinessAlert.create({
      category,
      severity,
      message,
      fingerprint,
      metadata: JSON.stringify(metadata)
    });

    return { status: 'created', alert: newAlert };
  } catch (err) {
    console.error('Error creating business alert:', err);
    return null;
  }
};

const getAlerts = async () => {
  return await BusinessAlert.findAll({
    order: [['createdAt', 'DESC']],
    limit: 100
  });
};

const resolveAlert = async (id, resolvedState) => {
  const alert = await BusinessAlert.findByPk(id);
  if (alert) {
    alert.resolved = resolvedState;
    await alert.save();
    return alert;
  }
  return null;
};

const acknowledgeAlert = async (id, ackState) => {
  const alert = await BusinessAlert.findByPk(id);
  if (alert) {
    alert.acknowledged = ackState;
    await alert.save();
    return alert;
  }
  return null;
};

module.exports = {
  createAlert,
  getAlerts,
  resolveAlert,
  acknowledgeAlert
};
