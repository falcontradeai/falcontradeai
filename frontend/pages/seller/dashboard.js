import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';
import CommodityCharts from '../../components/CommodityCharts';

function SellerDashboard() {
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
        if (user) {
          setOffers(offersRes.data.filter((o) => o.userId === user.id));
        }
        setRfqs(rfqsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Seller Dashboard</h1>
      <CommodityCharts />
      <Link
        href="/offers/new"
        className="bg-green-500 text-white px-4 py-2 mb-4 inline-block"
      >
        Add Product Listing
      </Link>
      <h2 className="text-xl mt-8 mb-2">My Product Listings</h2>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2">
            {offer.symbol} - {offer.price} - {offer.quantity} - {offer.status}
          </li>
        ))}
      </ul>
      <h2 className="text-xl mt-8 mb-2">Buyer RFQs</h2>
      <ul>
        {rfqs.map((rfq) => (
          <li key={rfq.id} className="border p-2 mb-2">
            <span>
              {rfq.symbol} - {rfq.quantity} - {rfq.status}
            </span>
            <Link
              href={`/offers/new?rfqId=${rfq.id}`}
              className="ml-2 text-blue-600 underline"
            >
              Respond
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(SellerDashboard, 'seller');
