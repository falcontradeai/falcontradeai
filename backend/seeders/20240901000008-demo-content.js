'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Contents', [
      {
        slug: 'about',
        body: 'FalconTrade helps you stay informed and manage your investments with ease.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'faq',
        body: 'Find answers to common questions about FalconTrade.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Contents', { slug: ['about', 'faq'] });
  },
};
