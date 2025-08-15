import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '../../components/withAuth';

function BuyerDashboard() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers`, {
          withCredentials: true,
        });
        setOffers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Buyer Dashboard</h1>
      <Link href="/rfqs/new" className="bg-green-500 text-white px-4 py-2 mb-4 inline-block">
        Create RFQ
      </Link>
      <h2 className="text-xl mt-4 mb-2">Available Offers</h2>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2">
            {offer.symbol} - {offer.price} - {offer.quantity} - {offer.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(BuyerDashboard, 'buyer');
