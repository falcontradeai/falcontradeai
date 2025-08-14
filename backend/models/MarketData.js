const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarketData = sequelize.define('MarketData', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    commodity: { type: DataTypes.STRING, allowNull: false, unique: true },
    historical: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    forecast: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  });
  return MarketData;
};
