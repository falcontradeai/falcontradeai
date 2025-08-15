import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LineChart from './LineChart';

export default function CommodityCharts() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [marketInfo, setMarketInfo] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('gold');
  const [symbols, setSymbols] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);

  const formatSymbol = (sym) =>
    sym ? sym.charAt(0).toUpperCase() + sym.slice(1) : '';

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingWatchlist(true);
      try {
        const [watchlistRes, symbolsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/watchlist`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/market-data`, {
            withCredentials: true,
          }),
        ]);
        setWatchlist(watchlistRes.data);
        setSymbols(symbolsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWatchlist(false);
      }
    };
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoadingForecast(true);
      try {
        const forecastRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/forecast/${selectedSymbol}`,
          { withCredentials: true }
        );
        const marketRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/marketData/${selectedSymbol}`,
          { withCredentials: true }
        );
        setMarketInfo(marketRes.data);
        const { historical = [], forecast = [] } = forecastRes.data;
        const combined = historical.map((h) => ({
          date: h.date,
          historical: h.price,
        }));
        forecast.forEach((f) => {
          combined.push({ date: f.date, forecast: f.price });
        });
        setForecastData(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingForecast(false);
      }
    };
    if (user) {
      fetchForecast();
    }
  }, [user, selectedSymbol]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Watchlist Prices</h1>
      {loadingWatchlist ? (
        <div className="w-full h-72 md:h-96 bg-gray-200 animate-pulse rounded" />
      ) : (
        <motion.div
          className="w-full h-72 md:h-96"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <LineChart
            className="w-full h-full"
            labels={watchlist.map((w) => w.symbol)}
            datasets={[
              {
                label: 'Price',
                data: watchlist.map((w) => w.price),
                borderColor: '#8884d8',
                tension: 0.4,
              },
            ]}
          />
        </motion.div>
      )}
      <div className="mt-8">
        <div className="mb-4">
          <label htmlFor="symbol-select" className="mr-2">
            Commodity:
          </label>
          <select
            id="symbol-select"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="border p-1"
          >
            {symbols.length > 0 ? (
              symbols.map((sym) => (
                <option key={sym} value={sym}>
                  {sym.toUpperCase()}
                </option>
              ))
            ) : (
              <option value="gold">Gold</option>
            )}
          </select>
        </div>
        <h1 className="text-2xl mb-4">
          {formatSymbol(selectedSymbol)} Price Forecast
        </h1>
        {marketInfo && (
          <p className="mb-2 text-sm">
            Category: {marketInfo.category} | Last Updated{' '}
            {new Date(marketInfo.lastUpdated).toLocaleString()}
          </p>
        )}
        {loadingForecast ? (
          <div className="w-full h-72 md:h-96 bg-gray-200 animate-pulse rounded" />
        ) : (
          <motion.div
            className="w-full h-72 md:h-96"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <LineChart
              className="w-full h-full"
              labels={forecastData.map((d) => d.date)}
              datasets={[
                {
                  label: 'Historical',
                  data: forecastData.map((d) => d.historical),
                  borderColor: '#8884d8',
                  tension: 0.4,
                },
                {
                  label: 'Forecast',
                  data: forecastData.map((d) => d.forecast),
                  borderColor: '#82ca9d',
                  tension: 0.4,
                },
              ]}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

