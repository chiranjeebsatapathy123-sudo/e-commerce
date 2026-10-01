const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const User = require('./User');

const Collection = sequelize.define('Collection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  products: {
    type: DataTypes.TEXT, // Storing JSON string array of product IDs for simplicity
    allowNull: false,
    defaultValue: '[]'
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  affiliateCode: {
    type: DataTypes.STRING,
    unique: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  earnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
});

module.exports = Collection;
