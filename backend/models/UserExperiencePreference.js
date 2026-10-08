const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserExperiencePreference = sequelize.define('UserExperiencePreference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  personalizedRecommendations: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  shoppingMemory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  recentlyViewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  priceAlerts: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  marketingMessages: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiShoppingContext: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = UserExperiencePreference;
