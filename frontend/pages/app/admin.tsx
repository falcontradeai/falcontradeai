import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/api';
import systemConfig from '../../config/systemConfig.json';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email?: string;
  createdAt: string;
  status: string;
}

interface RFQ {
  status: string;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [rfqsCount, setRfqsCount] = useState(0);
  const [offersPending, setOffersPending] = useState(0);
  const [logsCount, setLogsCount] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const usersData: User[] = await apiFetch('/api/v1/admin/users');
      setUsers(usersData);

      const rfqs: RFQ[] = await apiFetch('/api/v1/rfqs');
      setRfqsCount(rfqs.filter((r) => r.status === 'open').length);

      const offers = await apiFetch('/api/v1/offers?status=pending');
      setOffersPending(Array.isArray(offers) ? offers.length : 0);

      try {
        const logs = await apiFetch('/api/v1/admin/notifications');
        setLogsCount(Array.isArray(logs) ? logs.length : 0);
      } catch {
        setLogsCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const approve = async (id: number) => {
    await apiFetch(`/api/v1/admin/users/${id}/approve`, { method: 'POST' });
    loadData();
  };

  const reject = async (id: number) => {
    await apiFetch(`/api/v1/admin/users/${id}/block`, { method: 'POST' });
    loadData();
  };

  const requestInfo = (id: number) => {
    toast(`Requesting more info for user ${id}`);
  };

  if (loading || !user || user.role !== 'admin') {
    return null;
  }

  const newSignups = users.filter(
    (u) => Date.now() - new Date(u.createdAt).getTime() < 24 * 60 * 60 * 1000,
  ).length;
  const pendingKyc = users.filter((u) => u.status === 'pending').length;

  const cards = [
    { title: 'New Signups (24h)', count: newSignups, href: '/admin/users' },
    { title: 'Pending KYC', count: pendingKyc, href: '/admin/users' },
    { title: 'Active RFQs', count: rfqsCount, href: '/admin/rfqs' },
    {
      title: 'Offers Awaiting Approval',
      count: offersPending,
      href: '/admin/offers',
    },
    { title: 'Errors / Logs', count: logsCount, href: '/admin/reports' },
  ];

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-neutral-900 hover:bg-neutral-800 p-4 rounded cursor-pointer">
              <div className="text-sm text-neutral-400">{card.title}</div>
              <div className="text-2xl font-bold">{card.count}</div>
            </div>
          </Link>
        ))}
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-neutral-900">
                <th className="px-3 py-2 text-left">Username</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Signup Date</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-neutral-800">
                  <td className="px-3 py-2">{u.username}</td>
                  <td className="px-3 py-2">{u.email || 'N/A'}</td>
                  <td className="px-3 py-2">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 capitalize">{u.status}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => approve(u.id)}
                      className="text-green-500 hover:underline"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(u.id)}
                      className="text-red-500 hover:underline"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => requestInfo(u.id)}
                      className="text-yellow-500 hover:underline"
                    >
                      Request Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
        <pre className="bg-neutral-900 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(systemConfig, null, 2)}
        </pre>
      </section>
    </div>
  );
}
