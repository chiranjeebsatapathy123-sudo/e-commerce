const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AdminAuditLog = sequelize.define('AdminAuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  actorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  actorEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target: {
    type: DataTypes.STRING,
    allowNull: true
  },
  result: {
    type: DataTypes.STRING,
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true
  }
});

module.exports = AdminAuditLog;
