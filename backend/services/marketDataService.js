const { MarketData } = require('../models');
const { movingAverageForecast } = require('../utils/forecast');

const SOURCES = [
  {
    commodity: 'gold',
    fetch: async () => {
      try {
        const response = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        const data = await response.json();
        const item = data.items[0];
        return {
          currentPrice: item.xauPrice,
          changePercent: item.pcXau,
        };
      } catch (err) {
        console.error('Failed to fetch gold data', err);
        throw err;
      }
    },
  },
  {
    commodity: 'silver',
    fetch: async () => {
      try {
        const response = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
        const data = await response.json();
        const item = data.items[0];
        return {
          currentPrice: item.xagPrice,
          changePercent: item.pcXag,
        };
      } catch (err) {
        console.error('Failed to fetch silver data', err);
        throw err;
      }
    },
  },
  {
    commodity: 'wti',
    fetch: async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${process.env.ALPHAVANTAGE_KEY}`);
        const data = await response.json();
        const series = data.data || data['data'];
        if (!Array.isArray(series) || series.length < 2) throw new Error('No data');
        const latest = series[0];
        const prev = series[1];
        const price = parseFloat(latest.value || latest.price || latest['1. open']);
        const prevPrice = parseFloat(prev.value || prev.price || prev['1. open']);
        const changePercent = ((price - prevPrice) / prevPrice) * 100;
        return {
          currentPrice: price,
          changePercent,
          date: latest.date || latest.timestamp || new Date().toISOString().split('T')[0],
        };
      } catch (err) {
        console.error('Failed to fetch WTI data', err);
        throw err;
      }
    },
  },
  {
    commodity: 'corn',
    fetch: async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=CORN&interval=daily&apikey=${process.env.ALPHAVANTAGE_KEY}`);
        const data = await response.json();
        const series = data.data || data['data'];
        if (!Array.isArray(series) || series.length < 2) throw new Error('No data');
        const latest = series[0];
        const prev = series[1];
        const price = parseFloat(latest.value || latest.price || latest['1. open']);
        const prevPrice = parseFloat(prev.value || prev.price || prev['1. open']);
        const changePercent = ((price - prevPrice) / prevPrice) * 100;
        return {
          currentPrice: price,
          changePercent,
          date: latest.date || latest.timestamp || new Date().toISOString().split('T')[0],
        };
      } catch (err) {
        console.error('Failed to fetch corn data', err);
        throw err;
      }
    },
  },
];

async function fetchCommodity(source) {
  const result = await source.fetch();
  const date = result.date || new Date().toISOString().split('T')[0];
  return {
    commodity: source.commodity,
    currentPrice: result.currentPrice,
    changePercent: result.changePercent,
    entry: { date, price: result.currentPrice },
  };
}

async function refreshMarketData() {
  try {
    const results = await Promise.allSettled(SOURCES.map(fetchCommodity));
    const updates = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    const existing = await MarketData.findAll();
    const payload = updates.map((u) => {
      const match = existing.find((e) => e.commodity === u.commodity);
      const historical = match ? [...(match.historical || []), u.entry] : [u.entry];
      const forecast = movingAverageForecast(historical);
      return {
        commodity: u.commodity,
        currentPrice: u.currentPrice,
        changePercent: u.changePercent,
        historical,
        forecast,
      };
    });

    if (payload.length > 0) {
      await MarketData.bulkCreate(payload, {
        updateOnDuplicate: ['currentPrice', 'changePercent', 'historical', 'forecast'],
      });
    }
  } catch (err) {
    console.error('Failed to refresh market data', err);
  }
}

function scheduleMarketDataRefresh() {
  refreshMarketData();
  const fifteenMinutes = 15 * 60 * 1000;
  setInterval(refreshMarketData, fifteenMinutes);
}

module.exports = { refreshMarketData, scheduleMarketDataRefresh };
