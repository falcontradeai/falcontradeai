'use strict';

const fs = require('fs');
const path = require('path');
const { movingAverageForecast } = require('../utils/forecast');

module.exports = {
  async up(queryInterface) {
    const filePath = path.join(__dirname, '..', 'data', 'marketData.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(raw);

    const categoryMap = {
      gold: 'metals',
      silver: 'metals',
      crude_oil: 'energy',
    };

    const records = Object.entries(json).map(([commodity, historical]) => {
      const last = historical[historical.length - 1];
      const prev = historical[historical.length - 2] || last;
      const currentPrice = last.price;
      const changePercent = ((currentPrice - prev.price) / prev.price) * 100;
      return {
        commodity,
        category: categoryMap[commodity] || 'other',
        currentPrice,
        changePercent,
        historical,
        forecast: movingAverageForecast(historical),
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert('MarketData', records);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('MarketData', {
      commodity: ['gold', 'silver', 'crude_oil'],
    });
  },
};

