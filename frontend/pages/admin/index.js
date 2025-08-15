import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';

function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/admin/metrics', {
          withCredentials: true,
        });
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchMetrics();
    }
  }, [user]);

  if (!metrics) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl">Users</h2>
          <p className="text-3xl">{metrics.userCount}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl">Revenue</h2>
          <p className="text-3xl">${metrics.totalRevenue}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl">Pending Listings</h2>
          <p className="text-3xl">{metrics.pendingListings}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl">Subscription Revenue</h2>
          <p className="text-3xl">${metrics.subscriptionRevenue}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl">Active Deals</h2>
          <p className="text-3xl">{metrics.activeDeals}</p>
        </div>
        <div className="p-4 border rounded md:col-span-3">
          <h2 className="text-xl mb-2">Top Commodities</h2>
          <ul>
            {metrics.topCommodities.map((item) => (
              <li key={item.symbol}>
                {item.symbol}: {item.totalQuantity} units ({item.listingCount} listings)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default withAuth(AdminDashboard, 'admin');

