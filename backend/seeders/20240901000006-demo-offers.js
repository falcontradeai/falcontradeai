'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Offers', [
      {
        userId: 1,
        symbol: 'GOLD',
        price: 1900,
        quantity: 10,
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        symbol: 'SILVER',
        price: 25,
        quantity: 100,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Offers', null, {});
  },
};
