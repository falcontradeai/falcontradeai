'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Messages', 'offerId', 'listingId');
    await queryInterface.addColumn('Messages', 'read', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Messages', 'listingId', 'offerId');
    await queryInterface.removeColumn('Messages', 'read');
  }
};
