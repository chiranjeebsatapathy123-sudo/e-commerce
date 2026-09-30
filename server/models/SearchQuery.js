const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SearchQuery = sequelize.define('SearchQuery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resultCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isAiAssisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = SearchQuery;
