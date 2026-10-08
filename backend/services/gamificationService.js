const User = require('../models/User');

class GamificationService {
  static TIERS = {
    BRONZE: { name: 'Bronze', threshold: 0, multiplier: 1.0 },
    SILVER: { name: 'Silver', threshold: 500, multiplier: 1.2 },
    GOLD: { name: 'Gold', threshold: 2000, multiplier: 1.5 },
    PLATINUM: { name: 'Platinum', threshold: 5000, multiplier: 2.0 }
  };

  static async addPoints(userId, action) {
    const user = await User.findByPk(userId);
    if (!user) return null;

    let pointsToAdd = 0;
    switch (action) {
      case 'PURCHASE':
        pointsToAdd = 100; // Simplified
        break;
      case 'REVIEW':
        pointsToAdd = 50;
        break;
      case 'DAILY_LOGIN':
        pointsToAdd = 10;
        break;
      default:
        pointsToAdd = 0;
    }

    // Apply tier multiplier
    const currentTierConfig = Object.values(this.TIERS).find(t => t.name === user.loyaltyTier) || this.TIERS.BRONZE;
    const finalPoints = Math.floor(pointsToAdd * currentTierConfig.multiplier);

    user.points += finalPoints;

    // Check for tier upgrade
    let newTier = user.loyaltyTier;
    for (const [key, tier] of Object.entries(this.TIERS).reverse()) {
      if (user.points >= tier.threshold) {
        newTier = tier.name;
        break;
      }
    }

    if (newTier !== user.loyaltyTier) {
      user.loyaltyTier = newTier;
      // Optional: Broadcast tier upgrade via Socket.io
    }

    await user.save();
    return user;
  }

  static async getUserStatus(userId) {
    const user = await User.findByPk(userId, { attributes: ['points', 'loyaltyTier'] });
    if (!user) return null;

    // Calculate next tier progress
    const tiers = Object.values(this.TIERS);
    let nextTier = null;
    let progress = 100; // maxed out

    for (let i = 0; i < tiers.length; i++) {
      if (tiers[i].name === user.loyaltyTier && i < tiers.length - 1) {
        nextTier = tiers[i + 1];
        const pointsNeeded = nextTier.threshold - user.points;
        const totalPointsInTier = nextTier.threshold - tiers[i].threshold;
        progress = ((totalPointsInTier - pointsNeeded) / totalPointsInTier) * 100;
        break;
      }
    }

    return {
      points: user.points,
      tier: user.loyaltyTier,
      nextTier: nextTier ? nextTier.name : null,
      progressToNextTier: progress
    };
  }
}

module.exports = GamificationService;
