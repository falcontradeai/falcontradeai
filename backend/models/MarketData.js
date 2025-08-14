const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarketData = sequelize.define('MarketData', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    symbol: { type: DataTypes.STRING, allowNull: false },
    bid: { type: DataTypes.FLOAT, allowNull: false },
    ask: { type: DataTypes.FLOAT, allowNull: false },
  });
  return MarketData;
};
