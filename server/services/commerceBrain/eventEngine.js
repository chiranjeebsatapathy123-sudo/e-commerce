const { CommerceEvent } = require('../../models');

/**
 * Validates, timestamps, and persists a commerce event asynchronously.
 */
const publishEvent = async (eventType, userId, sessionId, targetId, payload = {}) => {
  try {
    // In a real system, you would push this to a queue (e.g. RabbitMQ, Kafka) 
    // before persisting, or use a background worker.
    const event = await CommerceEvent.create({
      eventType,
      userId,
      sessionId,
      targetId,
      payload: JSON.stringify(payload)
    });
    
    // Optionally trigger sub-engines
    // processEventContext(event);

    return event;
  } catch (error) {
    console.error(`Failed to publish event ${eventType}:`, error);
  }
};

const getEventsForUser = async (userId, limit = 50) => {
  return await CommerceEvent.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit
  });
};

module.exports = {
  publishEvent,
  getEventsForUser
};
