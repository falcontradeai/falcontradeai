import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import withAuth from '../components/withAuth';

function Dashboard() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [news, setNews] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [marketInfo, setMarketInfo] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('gold');
  const [symbols, setSymbols] = useState([]);

  const formatSymbol = (sym) => sym ? sym.charAt(0).toUpperCase() + sym.slice(1) : '';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [watchlistRes, newsRes, symbolsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/watchlist', {
            withCredentials: true,
          }),
          axios.get('http://localhost:5000/api/v1/news', {
            withCredentials: true,
          }),
          axios.get('http://localhost:5000/api/v1/market-data', {
            withCredentials: true,
          }),
        ]);
        setWatchlist(watchlistRes.data);
        setNews(newsRes.data);
        setSymbols(symbolsRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const forecastRes = await axios.get(
          `http://localhost:5000/api/v1/forecast/${selectedSymbol}`,
          { withCredentials: true }
        );
        const marketRes = await axios.get(
          `http://localhost:5000/api/v1/marketData/${selectedSymbol}`,
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
      }
    };
    if (user) {
      fetchForecast();
    }
  }, [user, selectedSymbol]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Watchlist Prices</h1>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={watchlist}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
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
            Category: {marketInfo.category} | Last Updated:{' '}
            {new Date(marketInfo.lastUpdated).toLocaleString()}
          </p>
        )}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="historical"
                stroke="#8884d8"
                name="Historical"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#82ca9d"
                name="Forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h2 className="text-xl mt-8 mb-2">Watchlist Items</h2>
      <ul>
        {watchlist.map((item) => (
          <li key={item.id}>
            {item.symbol}: {item.price}
          </li>
        ))}
      </ul>
      <h2 className="text-xl mt-8 mb-2">Latest News</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(Dashboard);
