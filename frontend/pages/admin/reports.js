import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminReports() {
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/revenue`, {
          withCredentials: true,
        });
        setRevenue(res.data.revenue);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRevenue();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Reports</h1>
      {revenue === null ? (
        <p>Loading...</p>
      ) : (
        <p className="text-xl">Total Stripe Revenue: ${revenue}</p>
      )}
    </div>
  );
}

export default withAuth(AdminReports, 'admin');

