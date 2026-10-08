const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductReviewAnalysis = sequelize.define('ProductReviewAnalysis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  summary: {
    type: DataTypes.JSON, // { positive: [...], negative: [...] }
    allowNull: true
  },
  sentimentDistribution: {
    type: DataTypes.JSON, // { positive: 80, neutral: 10, negative: 10 }
    allowNull: true
  },
  themes: {
    type: DataTypes.JSON, // { 'Battery': 85, 'Comfort': 90 }
    allowNull: true
  },
  analyzedReviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isStale: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = ProductReviewAnalysis;
