const { MarketData } = require('../models');
const { movingAverageForecast } = require('../utils/forecast');

async function getMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const record = await MarketData.findOne({ where: { commodity } });
    if (!record) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    return res.json({
      category: record.category,
      lastUpdated: record.lastUpdated,
      currentPrice: record.currentPrice,
      changePercent: record.changePercent,
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
