'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifications', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      message: { type: Sequelize.TEXT, allowNull: false },
      targetRoles: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
      read: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Notifications');
  },
};
