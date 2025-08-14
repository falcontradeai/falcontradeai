const { MarketData } = require('../models');
const { movingAverageForecast } = require('../utils/forecast');

async function getMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const record = await MarketData.findOne({ where: { commodity } });
    if (!record) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    return res.json({ historical: record.historical, forecast: record.forecast });
  } catch (err) {
    return res.status(500).json({ message: 'Error loading market data' });
  }
}

async function addMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const newEntry = req.body;
    let record = await MarketData.findOne({ where: { commodity } });
    if (!record) {
      const historical = [newEntry];
      const forecast = movingAverageForecast(historical);
      await MarketData.create({ commodity, historical, forecast });
    } else {
      const historical = record.historical || [];
      historical.push(newEntry);
      record.historical = historical;
      record.forecast = movingAverageForecast(historical);
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
    const { historical } = req.body;
    let record = await MarketData.findOne({ where: { commodity } });
    const forecast = movingAverageForecast(historical);
    if (!record) {
      await MarketData.create({ commodity, historical, forecast });
    } else {
      record.historical = historical;
      record.forecast = forecast;
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
