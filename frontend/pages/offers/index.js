import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '../../components/withAuth';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [commodity, setCommodity] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('ASC');

  const fetchOffers = async () => {
    try {
      const params = {};
      if (commodity) params.commodity = commodity;
      if (status) params.status = status;
      if (sortBy) {
        params.sortBy = sortBy;
        params.order = order;
      }
      const res = await axios.get('http://localhost:5000/api/v1/offers', {
        params,
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOffers();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Offers</h1>
      <form onSubmit={handleSearch} className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          placeholder="Commodity"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
        />
        <select
          className="border p-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="featured">Featured</option>
        </select>
        <div className="flex space-x-2">
          <select
            className="border p-2 w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">No Sort</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
            <option value="createdAt">Created At</option>
          </select>
          <select
            className="border p-2 w-full"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="ASC">Asc</option>
            <option value="DESC">Desc</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mr-2"
          >
            Search
          </button>
          <Link
            href="/offers/new"
            className="bg-green-500 text-white px-4 py-2"
          >
            New Offer
          </Link>
        </div>
      </form>
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

export default withAuth(Offers);

