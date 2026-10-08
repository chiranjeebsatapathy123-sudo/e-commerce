const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');

const ProductMultimodalProfile = sequelize.define('ProductMultimodalProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  visualFeatures: {
    type: DataTypes.JSON, // E.g. extracted colors, patterns, object detection
    defaultValue: {}
  },
  textFeatures: {
    type: DataTypes.JSON, // E.g. extracted keywords, intent mappings
    defaultValue: {}
  },
  structuredFeatures: {
    type: DataTypes.JSON, // E.g. standard specs
    defaultValue: {}
  },
  styleAttributes: {
    type: DataTypes.JSON, // E.g. modern, classic, minimalist
    defaultValue: []
  },
  materialAttributes: {
    type: DataTypes.JSON, // E.g. wood, metal, cotton
    defaultValue: []
  },
  confidence: {
    type: DataTypes.FLOAT, // 0.0 to 1.0 indicating how confident the AI is in these features
    defaultValue: 1.0
  },
  completenessScore: {
    type: DataTypes.FLOAT, // Data quality score
    defaultValue: 0.0
  }
}, {
  timestamps: true
});

Product.hasOne(ProductMultimodalProfile, { foreignKey: 'productId' });
ProductMultimodalProfile.belongsTo(Product, { foreignKey: 'productId' });

module.exports = ProductMultimodalProfile;
