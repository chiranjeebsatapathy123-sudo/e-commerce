const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BusinessAlert = sequelize.define('BusinessAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING, // Inventory, Sales, Orders, Products, Reviews, Search, System, AI
    allowNull: false
  },
  severity: {
    type: DataTypes.STRING, // Info, Warning, Critical
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fingerprint: {
    type: DataTypes.STRING, // Used for deduplication
    allowNull: false
  },
  resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.TEXT, // JSON string for structured data
    allowNull: true
  }
});

module.exports = BusinessAlert;
