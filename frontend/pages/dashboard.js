import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LineChart from '../components/LineChart';
import withAuth from '../components/withAuth';

function Dashboard() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [news, setNews] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [symbolForecasts, setSymbolForecasts] = useState({});
  const [marketInfo, setMarketInfo] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('gold');
  const [symbols, setSymbols] = useState([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const formatSymbol = (sym) => sym ? sym.charAt(0).toUpperCase() + sym.slice(1) : '';

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingWatchlist(true);
      try {
        const [watchlistRes, newsRes, symbolsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/watchlist`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/market-data`, {
            withCredentials: true,
          }),
        ]);
        setWatchlist(watchlistRes.data);
        setNews(newsRes.data);
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

  useEffect(() => {
    const fetchAllForecasts = async () => {
      const forecasts = {};
      await Promise.all(
        watchlist.map(async (item) => {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/forecast/${item.symbol}`,
              { withCredentials: true }
            );
            const { historical = [], forecast = [] } = res.data;
            const combined = historical.map((h) => ({
              date: h.date,
              historical: h.price,
            }));
            forecast.forEach((f) => {
              combined.push({ date: f.date, forecast: f.price });
            });
            forecasts[item.symbol] = combined;
          } catch (err) {
            console.error(err);
          }
        })
      );
      setSymbolForecasts(forecasts);
    };
    if (user && watchlist.length > 0) {
      fetchAllForecasts();
    }
  }, [user, watchlist]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages/unread-count`,
          { withCredentials: true }
        );
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Link href="/messages" className="relative">
          <span role="img" aria-label="messages">💬</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
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
            className="border p-1 transition duration-200"
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
          {formatSymbol(selectedSymbol)} Price Prediction
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
                  label: 'Prediction',
                  data: forecastData.map((d) => d.forecast),
                  borderColor: '#82ca9d',
                  tension: 0.4,
                },
              ]}
            />
          </motion.div>
        )}
      </div>
      <h2 className="text-xl mt-8 mb-2">Watchlist Items</h2>
      <ul>
        {loadingWatchlist ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          watchlist.map((item) => (
            <li
              key={item.id}
              className="p-2 hover:bg-gray-100 transition duration-200 rounded mb-4"
            >
              {item.symbol}: {item.price}
              {symbolForecasts[item.symbol] && (
                <div className="w-full h-48 mt-2">
                  <LineChart
                    className="w-full h-full"
                    showLegend={false}
                    labels={symbolForecasts[item.symbol].map((d) => d.date)}
                    datasets={[
                      {
                        label: 'Historical',
                        data: symbolForecasts[item.symbol].map((d) => d.historical),
                        borderColor: '#8884d8',
                        tension: 0.4,
                        pointRadius: 0,
                      },
                      {
                        label: 'Prediction',
                        data: symbolForecasts[item.symbol].map((d) => d.forecast),
                        borderColor: '#82ca9d',
                        tension: 0.4,
                        pointRadius: 0,
                      },
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Prediction</p>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
      <h2 className="text-xl mt-8 mb-2">Latest News</h2>
      <ul>
        {news.map((item) => (
          <li
            key={item.id}
            className="p-2 hover:bg-gray-100 transition duration-200 rounded"
          >
            <strong>{item.title}</strong>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(Dashboard);
