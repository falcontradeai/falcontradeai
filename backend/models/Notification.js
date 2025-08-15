const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    targetRoles: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  });
  return Notification;
};
