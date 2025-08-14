const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'marketData.json');

async function loadData() {
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw);
}

async function saveData(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

function movingAverageForecast(data, window = 3, periods = 3) {
  if (data.length < window) return [];
  const prices = data.map((d) => d.price);
  const avg = prices.slice(-window).reduce((a, b) => a + b, 0) / window;
  const lastDate = new Date(data[data.length - 1].date);
  const forecast = [];
  for (let i = 1; i <= periods; i += 1) {
    const next = new Date(lastDate);
    next.setMonth(next.getMonth() + i);
    forecast.push({
      date: next.toISOString().split('T')[0],
      price: parseFloat(avg.toFixed(2)),
    });
  }
  return forecast;
}

async function getMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const data = await loadData();
    const historical = data[commodity];
    if (!historical) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    const forecast = movingAverageForecast(historical);
    return res.json({ historical, forecast });
  } catch (err) {
    return res.status(500).json({ message: 'Error loading market data' });
  }
}

async function addMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const newEntry = req.body;
    const data = await loadData();
    if (!data[commodity]) {
      data[commodity] = [];
    }
    data[commodity].push(newEntry);
    await saveData(data);
    return res.status(201).json({ message: 'Data added' });
  } catch (err) {
    return res.status(500).json({ message: 'Error saving market data' });
  }
}

async function updateMarketData(req, res) {
  try {
    const { commodity } = req.params;
    const { historical } = req.body;
    const data = await loadData();
    data[commodity] = historical;
    await saveData(data);
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
