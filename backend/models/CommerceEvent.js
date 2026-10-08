const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CommerceEvent = sequelize.define('CommerceEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false // e.g. product.viewed, cart.created, checkout.started
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  targetId: {
    type: DataTypes.STRING, // e.g. ProductID, OrderID
    allowNull: true
  },
  payload: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true
  }
});

module.exports = CommerceEvent;
