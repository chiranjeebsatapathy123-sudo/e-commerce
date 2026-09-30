const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductEmbedding = sequelize.define('ProductEmbedding', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  embedding: {
    // Standard approach when pgvector is unavailable: store as JSON and compute in JS.
    // In a real pgvector db, we'd use DataTypes.STRING or specialized extension types.
    type: DataTypes.JSON,
    allowNull: true,
  },
  isStale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastEmbeddedAt: {
    type: DataTypes.DATE,
  }
});

module.exports = ProductEmbedding;
