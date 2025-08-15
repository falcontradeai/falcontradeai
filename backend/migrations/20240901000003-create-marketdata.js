'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MarketData', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      commodity: { type: Sequelize.STRING, allowNull: false, unique: true },
      currentPrice: { type: Sequelize.FLOAT, allowNull: true },
      changePercent: { type: Sequelize.FLOAT, allowNull: true },
      historical: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
      forecast: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
      category: { type: Sequelize.STRING, allowNull: false },
      lastUpdated: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MarketData');
  },
};
