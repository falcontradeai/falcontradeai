const { MarketData } = require('../models');
const { movingAverageForecast } = require('../utils/forecast');
const { fetchCommodity } = require('../services/tradingEconomicsService');

async function getMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const record = await MarketData.findOne({ where: { commodity } });
    if (!record) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    let currentPrice = record.currentPrice;
    let changePercent = record.changePercent;
    try {
      const live = await fetchCommodity(commodity);
      if (live.price != null) {
        currentPrice = live.price;
        changePercent = live.changePercent;
      }
    } catch (err) {
      console.warn('Failed to fetch live price', err.message);
    }
    const direction = changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'flat';
    const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '';
    const color = direction === 'up' ? 'green' : direction === 'down' ? 'red' : 'gray';
    return res.json({
      category: record.category,
      lastUpdated: record.lastUpdated,
      currentPrice,
      changePercent,
      arrow,
      color,
      historical: record.historical,
      forecast: record.forecast,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error loading market data' });
  }
}

async function addMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const { currentPrice, changePercent, date, category } = req.body;
    const entryDate = date || new Date().toISOString().split('T')[0];
    const newEntry = { date: entryDate, price: currentPrice };
    let record = await MarketData.findOne({ where: { commodity } });
    if (!record) {
      const historical = [newEntry];
      const forecast = movingAverageForecast(historical);
      await MarketData.create({
        commodity,
        category,
        currentPrice,
        changePercent,
        historical,
        forecast,
        lastUpdated: new Date(),
      });
    } else {
      const historical = record.historical || [];
      historical.push(newEntry);
      record.currentPrice = currentPrice;
      record.changePercent = changePercent;
      record.historical = historical;
      record.forecast = movingAverageForecast(historical);
       if (category) record.category = category;
       record.lastUpdated = new Date();
      await record.save();
    }
    return res.status(201).json({ message: 'Data added' });
  } catch (err) {
    return res.status(500).json({ message: 'Error saving market data' });
  }
}

async function updateMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const { historical, currentPrice, changePercent, category } = req.body;
    let record = await MarketData.findOne({ where: { commodity } });
    const forecast = movingAverageForecast(historical);
    if (!record) {
      await MarketData.create({
        commodity,
        category,
        currentPrice,
        changePercent,
        historical,
        forecast,
        lastUpdated: new Date(),
      });
    } else {
      record.currentPrice = currentPrice;
      record.changePercent = changePercent;
      record.historical = historical;
      record.forecast = forecast;
      if (category) record.category = category;
      record.lastUpdated = new Date();
      await record.save();
    }
    return res.json({ message: 'Data updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating market data' });
  }
}

module.exports = {
  getMarketData,
  addMarketData,
  updateMarketData,
};
