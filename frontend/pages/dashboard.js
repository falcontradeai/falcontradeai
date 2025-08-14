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
  const { token } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const watchlistRes = await axios.get('http://localhost:5000/api/v1/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(watchlistRes.data);
        const newsRes = await axios.get('http://localhost:5000/api/v1/news', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNews(newsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);

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
