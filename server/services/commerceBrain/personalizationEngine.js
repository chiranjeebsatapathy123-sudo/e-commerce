const { UserExperiencePreference } = require('../../models');

const getPreferences = async (userId) => {
  let prefs = await UserExperiencePreference.findOne({ where: { userId } });
  if (!prefs) {
    prefs = await UserExperiencePreference.create({ userId });
  }
  return prefs;
};

const updatePreferences = async (userId, updates) => {
  const prefs = await getPreferences(userId);
  await prefs.update(updates);
  return prefs;
};

const resetPreferences = async (userId) => {
  const prefs = await getPreferences(userId);
  await prefs.update({
    personalizedRecommendations: true,
    shoppingMemory: true,
    recentlyViewed: true,
    priceAlerts: true,
    marketingMessages: false,
    aiShoppingContext: true
  });
  return prefs;
};

module.exports = {
  getPreferences,
  updatePreferences,
  resetPreferences
};
