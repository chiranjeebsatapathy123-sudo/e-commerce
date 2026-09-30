const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserInteraction = sequelize.define('UserInteraction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  interactionType: {
    type: DataTypes.ENUM('view', 'wishlist_add', 'cart_add', 'purchase', 'search_click', 'recommendation_click'),
    allowNull: false,
  }
});

module.exports = UserInteraction;
