const fetch = global.fetch;

async function fetchCommodity(symbol) {
  const credentials = process.env.TRADING_ECONOMICS_KEY || 'guest:guest';
  const url = `https://api.tradingeconomics.com/commodity/${encodeURIComponent(symbol)}?c=${credentials}&format=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TradingEconomics request failed with status ${response.status}`);
  }
  const data = await response.json();
  const item = Array.isArray(data) ? data[0] : data;
  const price =
    item?.price ??
    item?.last ??
    item?.close ??
    item?.Close ??
    item?.Price ?? null;
  const changePercent =
    item?.changePercent ??
    item?.ChangePercent ??
    item?.PercentageChange ??
    item?.Change_p ??
    item?.change ?? null;
  return { price, changePercent };
}

module.exports = { fetchCommodity };
