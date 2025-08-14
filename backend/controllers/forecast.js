const { getForecastForCommodity } = require('../services/forecasting');

async function getForecast(req, res) {
  try {
    const { commodity } = req.params;
    const data = await getForecastForCommodity(commodity);
    if (!data) {
      return res.status(404).json({ message: 'Commodity not found' });
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Error generating forecast' });
  }
}

module.exports = { getForecast };
