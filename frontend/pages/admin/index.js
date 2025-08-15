import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';

function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/metrics`, {
          withCredentials: true,
        });
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications`, {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchMetrics();
      fetchNotifications();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/notifications`,
        { message, targetRoles: roles },
        { withCredentials: true },
      );
      setNotifications((prev) => [res.data, ...prev]);
      setMessage('');
      setRoles([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!metrics) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="mb-4 space-x-4">
        <Link href="/admin/users" className="text-blue-500 underline">
          Users
        </Link>
        <Link href="/admin/offers" className="text-blue-500 underline">
          Offers
        </Link>
        <Link href="/admin/rfqs" className="text-blue-500 underline">
          RFQs
        </Link>
        <Link href="/admin/transactions" className="text-blue-500 underline">
          Transactions
        </Link>
      </div>
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
      <div className="mt-8">
        <h2 className="text-xl mb-2">Broadcast Notification</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="border p-2 w-full mb-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />
          <select
            multiple
            className="border p-2 w-full mb-2"
            value={roles}
            onChange={(e) =>
              setRoles(Array.from(e.target.selectedOptions).map((o) => o.value))
            }
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2"
          >
            Send
          </button>
        </form>
        <h3 className="text-lg mb-2">Recent Notifications</h3>
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className="border p-2 mb-2">
              <div>{n.message}</div>
              <div className="text-xs text-gray-500">
                {n.targetRoles.join(', ')} |{' '}
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withAuth(AdminDashboard, 'admin');

