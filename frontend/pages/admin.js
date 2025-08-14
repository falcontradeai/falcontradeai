import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import withAuth from '../components/withAuth';

function Admin() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) {
      fetchMetrics();
    }
  }, [token]);

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
          <p className="text-3xl">${metrics.revenue}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl">Pending Listings</h2>
          <p className="text-3xl">{metrics.pendingListings}</p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Admin, 'admin');
