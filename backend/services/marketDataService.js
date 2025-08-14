const { MarketData } = require('../models');
const { movingAverageForecast } = require('../utils/forecast');

async function fetchGoldPrice() {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/pax-gold');
  const data = await response.json();
  const price = data.market_data.current_price.usd;
  return { date: new Date().toISOString().split('T')[0], price };
}

async function refreshGoldData() {
  try {
    const entry = await fetchGoldPrice();
    let record = await MarketData.findOne({ where: { commodity: 'gold' } });
    if (!record) {
      const forecast = movingAverageForecast([entry]);
      await MarketData.create({ commodity: 'gold', historical: [entry], forecast });
    } else {
      const historical = record.historical || [];
      historical.push(entry);
      record.historical = historical;
      record.forecast = movingAverageForecast(historical);
      await record.save();
    }
  } catch (err) {
    console.error('Failed to refresh market data', err);
  }
}

function scheduleMarketDataRefresh() {
  refreshGoldData();
  const sixHours = 6 * 60 * 60 * 1000;
  setInterval(refreshGoldData, sixHours);
}

module.exports = { refreshGoldData, scheduleMarketDataRefresh };
