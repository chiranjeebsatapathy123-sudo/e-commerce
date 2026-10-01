const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ShoppingRadarItem = sequelize.define('ShoppingRadarItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notifyOnRestock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notifyOnPriceDrop: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = ShoppingRadarItem;
