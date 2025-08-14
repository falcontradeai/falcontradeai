const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WatchlistItem = sequelize.define('WatchlistItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    symbol: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  });
  return WatchlistItem;
};
