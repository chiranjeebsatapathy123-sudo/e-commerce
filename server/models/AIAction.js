const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AIAction = sequelize.define('AIAction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  actionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proposedBy: {
    type: DataTypes.STRING, // Engine name, e.g. 'opportunityEngine'
    allowNull: false
  },
  targetEntity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  targetId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payload: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'executed', 'failed'),
    defaultValue: 'pending'
  },
  reviewedBy: {
    type: DataTypes.INTEGER, // User ID of Admin
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resultPayload: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = AIAction;
