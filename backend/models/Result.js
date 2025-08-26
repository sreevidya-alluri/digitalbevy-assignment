const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // import your sequelize instance

const Result = sequelize.define('Result', {
  keyword: { type: DataTypes.STRING, allowNull: false, unique: true },
  items: { type: DataTypes.JSON, allowNull: false },
  fetched_at: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Result;
