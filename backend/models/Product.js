const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.TEXT, // Comma-separated URLs
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  bulkPricing: {
    type: DataTypes.JSON, // e.g., [{"minQty": 10, "discountPct": 5}, {"minQty": 50, "discountPct": 15}]
    allowNull: true
  },
  isB2B: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  paranoid: true,
  timestamps: true
});

module.exports = Product;
