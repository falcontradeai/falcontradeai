'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const password1 = await bcrypt.hash('password123', 10);
    const password2 = await bcrypt.hash('securepassword', 10);
    await queryInterface.bulkInsert('Users', [
      {
        username: 'alice',
        password: password1,
        role: 'buyer',
        status: 'active',
        subscriptionStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'bob',
        password: password2,
        role: 'seller',
        status: 'active',
        subscriptionStatus: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', { username: ['alice', 'bob'] });
  },
};
