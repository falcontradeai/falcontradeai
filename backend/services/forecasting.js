const { MarketData } = require('../models');
let tf;
try {
  tf = require('@tensorflow/tfjs');
} catch (err) {
  tf = null;
  console.warn('TensorFlow.js not installed, using stub forecast');
}

function forecastFromHistorical(historical, periods = 3) {
  if (!Array.isArray(historical) || historical.length === 0) return [];
  const prices = historical.map((h) => h.price);
  let predicted = [];
  if (tf) {
    try {
      const xs = tf.tensor1d(prices.map((_, i) => i));
      const ys = tf.tensor1d(prices);
      const xMean = xs.mean();
      const yMean = ys.mean();
      const numerator = xs.sub(xMean).mul(ys.sub(yMean)).sum();
      const denominator = xs.sub(xMean).square().sum();
      const slope = numerator.div(denominator).dataSync()[0];
      const intercept = yMean.sub(xMean.mul(slope)).dataSync()[0];
      const lastIndex = prices.length - 1;
      predicted = Array.from({ length: periods }, (_, i) => intercept + slope * (lastIndex + i + 1));
    } catch (e) {
      predicted = [];
    }
  }
  if (predicted.length === 0) {
    const last = prices[prices.length - 1];
    const prev = prices[prices.length - 2] || last;
    const diff = last - prev;
    predicted = Array.from({ length: periods }, (_, i) => last + diff * (i + 1));
  }
  const lastDate = new Date(historical[historical.length - 1].date);
  return predicted.map((p, idx) => {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + idx + 1);
    return { date: d.toISOString().split('T')[0], price: parseFloat(p.toFixed(2)) };
  });
}

async function getForecastForCommodity(commodity, periods = 3) {
  const record = await MarketData.findOne({ where: { commodity } });
  if (!record) return null;
  const forecast = forecastFromHistorical(record.historical, periods);
  return { historical: record.historical, forecast };
}

module.exports = { forecastFromHistorical, getForecastForCommodity };
