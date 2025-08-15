import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '../../components/withAuth';

function SellerDashboard() {
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rfqs`, {
          withCredentials: true,
        });
        setRfqs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRfqs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Seller Dashboard</h1>
      <Link href="/offers/new" className="bg-green-500 text-white px-4 py-2 mb-4 inline-block">
        Create Offer
      </Link>
      <h2 className="text-xl mt-4 mb-2">Recent RFQs</h2>
      <ul>
        {rfqs.map((rfq) => (
          <li key={rfq.id} className="border p-2 mb-2">
            {rfq.symbol} - {rfq.quantity} - {rfq.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(SellerDashboard, 'seller');
