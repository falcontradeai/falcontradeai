'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Offers', 'priceTier', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Offers', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Offers', 'deliveryTerms', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('RFQs', 'specs', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('RFQs', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Offers', 'priceTier');
    await queryInterface.removeColumn('Offers', 'location');
    await queryInterface.removeColumn('Offers', 'deliveryTerms');
    await queryInterface.removeColumn('RFQs', 'specs');
    await queryInterface.removeColumn('RFQs', 'location');
  },
};
