const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NewsItem = sequelize.define('NewsItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
  });
  return NewsItem;
};
