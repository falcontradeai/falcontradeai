import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminTransactions() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/transactions`,
          { withCredentials: true },
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Transactions</h1>
      <h2 className="text-xl mb-2">Active</h2>
      <ul className="mb-4">
        {data.active.offers.map((o) => (
          <li key={`ao-${o.id}`} className="border p-2 mb-2">
            Offer: {o.symbol} - {o.quantity} ({o.orderStatus})
          </li>
        ))}
        {data.active.rfqs.map((r) => (
          <li key={`ar-${r.id}`} className="border p-2 mb-2">
            RFQ: {r.symbol} - {r.quantity} ({r.orderStatus})
          </li>
        ))}
      </ul>
      <h2 className="text-xl mb-2">Past</h2>
      <ul>
        {data.past.offers.map((o) => (
          <li key={`po-${o.id}`} className="border p-2 mb-2">
            Offer: {o.symbol} - {o.quantity} ({o.orderStatus})
          </li>
        ))}
        {data.past.rfqs.map((r) => (
          <li key={`pr-${r.id}`} className="border p-2 mb-2">
            RFQ: {r.symbol} - {r.quantity} ({r.orderStatus})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminTransactions, 'admin');
