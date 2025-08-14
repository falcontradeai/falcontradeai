function movingAverageForecast(data, window = 3, periods = 3) {
  if (!Array.isArray(data) || data.length < window) return [];
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

module.exports = { movingAverageForecast };
