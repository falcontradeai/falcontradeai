'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Offers', 'orderStatus', {
      type: Sequelize.ENUM('pending', 'shipped', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Offers', 'orderStatus');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Offers_orderStatus";');
  },
};
