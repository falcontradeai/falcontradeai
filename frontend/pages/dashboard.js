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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const watchlistRes = await axios.get(
          'http://localhost:5000/api/v1/watchlist',
          { withCredentials: true }
        );
        setWatchlist(watchlistRes.data);
        const newsRes = await axios.get('http://localhost:5000/api/v1/news', {
          withCredentials: true,
        });
        setNews(newsRes.data);
        const forecastRes = await axios.get(
          'http://localhost:5000/api/v1/forecast/gold',
          { withCredentials: true }
        );
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
      fetchData();
    }
  }, [user]);

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
      <h1 className="text-2xl mt-8 mb-4">Gold Price Forecast</h1>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="historical" stroke="#8884d8" name="Historical" />
            <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast" />
          </LineChart>
        </ResponsiveContainer>
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

export default withAuth(Dashboard, 'subscriber');
