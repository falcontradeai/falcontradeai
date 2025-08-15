'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('RFQs', 'orderStatus', {
      type: Sequelize.ENUM('pending', 'shipped', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('RFQs', 'orderStatus');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_RFQs_orderStatus";');
  },
};
