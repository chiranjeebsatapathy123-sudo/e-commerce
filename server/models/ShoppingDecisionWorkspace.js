const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ShoppingDecisionWorkspace = sequelize.define('ShoppingDecisionWorkspace', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'New Decision Workspace'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  productIds: {
    type: DataTypes.TEXT, // Comma separated IDs or JSON array
    allowNull: true
  }
});

module.exports = ShoppingDecisionWorkspace;
