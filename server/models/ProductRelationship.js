const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProductRelationship = sequelize.define('ProductRelationship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sourceProductId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetProductId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  relationshipType: {
    type: DataTypes.STRING, // SIMILAR, ALTERNATIVE, COMPLEMENTARY, FREQUENTLY_BOUGHT_TOGETHER, SAME_CATEGORY, SAME_BRAND, LOWER_PRICE, PREMIUM_ALTERNATIVE, COMPATIBLE
    allowNull: false
  },
  confidenceScore: {
    type: DataTypes.FLOAT, // 0.0 to 1.0
    allowNull: false,
    defaultValue: 1.0
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = ProductRelationship;
