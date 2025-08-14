const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RFQ = sequelize.define('RFQ', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    symbol: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'open' },
  });
  return RFQ;
};
