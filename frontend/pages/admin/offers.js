import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminOffers() {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/admin/listings', {
        withCredentials: true,
      });
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const approve = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/v1/admin/listings/${id}/approve`,
        {},
        { withCredentials: true }
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/admin/listings/${id}`,
        { withCredentials: true }
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Manage Offers</h1>
      <ul>
        {offers.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2">
            {offer.symbol} - {offer.price} - {offer.quantity} - {offer.status}
            <div className="mt-2 space-x-2">
              {offer.status === 'pending' && (
                <button
                  className="bg-green-500 text-white px-2 py-1"
                  onClick={() => approve(offer.id)}
                >
                  Approve
                </button>
              )}
              <button
                className="bg-red-500 text-white px-2 py-1"
                onClick={() => remove(offer.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminOffers, 'admin');

