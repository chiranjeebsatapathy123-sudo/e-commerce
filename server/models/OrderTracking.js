const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderTracking = sequelize.define('OrderTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  actor: {
    type: DataTypes.STRING,
    defaultValue: 'System'
  }
});

module.exports = OrderTracking;
