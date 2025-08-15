const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Offer = sequelize.define('Offer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    symbol: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceTier: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
    deliveryTerms: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'featured', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    orderStatus: {
      type: DataTypes.ENUM('pending', 'shipped', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    attachments: { type: DataTypes.JSON, allowNull: true },
  });
  return Offer;
};
