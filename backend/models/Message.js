const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromUserId: { type: DataTypes.INTEGER, allowNull: false },
    toUserId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    offerId: { type: DataTypes.INTEGER, allowNull: true },
    rfqId: { type: DataTypes.INTEGER, allowNull: true },
  });
  return Message;
};
