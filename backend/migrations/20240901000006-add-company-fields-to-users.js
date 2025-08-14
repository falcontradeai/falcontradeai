'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'companyName', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Users', 'companyWebsite', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Users', 'logoUrl', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'logoUrl');
    await queryInterface.removeColumn('Users', 'companyWebsite');
    await queryInterface.removeColumn('Users', 'companyName');
  },
};
