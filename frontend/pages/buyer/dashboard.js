import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';
import CommodityCharts from '../../components/CommodityCharts';

function BuyerDashboard() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, rfqsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rfqs`, {
            withCredentials: true,
          }),
        ]);
        setOffers(offersRes.data);
        if (user) {
          setRfqs(rfqsRes.data.filter((r) => r.userId === user.id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const responses = offers.filter((o) =>
    rfqs.some((r) => r.symbol === o.symbol)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Buyer Dashboard</h1>
      <Link
        href="/rfqs/new"
        className="bg-green-500 text-white px-4 py-2 mb-4 inline-block"
      >
        Post New RFQ
      </Link>
      <CommodityCharts />
      <h2 className="text-xl mt-8 mb-2">Latest Offers</h2>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2">
            {offer.symbol} - {offer.price} - {offer.quantity} - {offer.status}
          </li>
        ))}
      </ul>
      <h2 className="text-xl mt-8 mb-2">Responses to My RFQs</h2>
      <ul>
        {responses.length === 0 && (
          <li className="text-sm text-gray-500">No responses yet.</li>
        )}
        {responses.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2">
            {offer.symbol} - {offer.price} - {offer.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(BuyerDashboard, 'buyer');
