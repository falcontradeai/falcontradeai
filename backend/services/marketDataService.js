const { MarketData } = require('../models');
const { movingAverageForecast } = require('../utils/forecast');
const cron = require('node-cron');

const SOURCES = [
  {
    commodity: 'gold',
    category: 'metals',
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
        console.error('Failed to fetch gold data:', err.message);
        return null;
      }
    },
  },
  {
    commodity: 'silver',
    category: 'metals',
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
        console.error('Failed to fetch silver data:', err.message);
        return null;
      }
    },
  },
  {
    commodity: 'crude_oil',
    category: 'energy',
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
        console.error('Failed to fetch crude oil data:', err.message);
        return null;
      }
    },
  },
  {
    commodity: 'corn',
    category: 'agriculture',
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
        console.error('Failed to fetch corn data:', err.message);
        return null;
      }
    },
  },
];

async function fetchCommodity(source) {
  try {
    const result = await source.fetch();
    if (!result) return null;
    const date = result.date || new Date().toISOString().split('T')[0];
    return {
      commodity: source.commodity,
      category: source.category,
      currentPrice: result.currentPrice,
      changePercent: result.changePercent,
      entry: { date, price: result.currentPrice },
    };
  } catch (err) {
    console.error(`Failed to fetch ${source.commodity} data:`, err.message);
    return null;
  }
}

async function refreshMarketData() {
  try {
    const results = await Promise.all(SOURCES.map(fetchCommodity));
    const updates = results.filter(Boolean);

    const existing = await MarketData.findAll();
    const payload = updates.map((u) => {
      const match = existing.find((e) => e.commodity === u.commodity);
      const historical = match ? [...(match.historical || []), u.entry] : [u.entry];
      const forecast = movingAverageForecast(historical);
      return {
        commodity: u.commodity,
        category: u.category,
        currentPrice: u.currentPrice,
        changePercent: u.changePercent,
        historical,
        forecast,
        lastUpdated: new Date(),
      };
    });

    if (payload.length > 0) {
      await MarketData.bulkCreate(payload, {
        updateOnDuplicate: [
          'category',
          'currentPrice',
          'changePercent',
          'historical',
          'forecast',
          'lastUpdated',
        ],
      });
    }
  } catch (err) {
    console.error('Failed to refresh market data', err);
  }
}

function scheduleMarketDataRefresh() {
  refreshMarketData();
  cron.schedule('*/15 * * * *', refreshMarketData);
}

module.exports = { refreshMarketData, scheduleMarketDataRefresh };
