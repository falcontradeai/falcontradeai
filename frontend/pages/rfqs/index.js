import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import withAuth from '../../components/withAuth';

function RFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [commodity, setCommodity] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('ASC');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [location, setLocation] = useState('');

  const fetchRfqs = async () => {
    try {
      const params = {};
      if (commodity) params.commodity = commodity;
      if (status) params.status = status;
      if (minQuantity) params.minQuantity = minQuantity;
      if (maxQuantity) params.maxQuantity = maxQuantity;
      if (location) params.location = location;
      if (sortBy) {
        params.sortBy = sortBy;
        params.order = order;
      }
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/rfqs`, {
        params,
        withCredentials: true,
      });
      setRfqs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRfqs();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">RFQs</h1>
      <form onSubmit={handleSearch} className="space-y-2 mb-4">
        <input
          className="border p-2 w-full"
          placeholder="Commodity"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex space-x-2">
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Min Quantity"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            type="number"
            placeholder="Max Quantity"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(e.target.value)}
          />
        </div>
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
            href="/rfqs/new"
            className="bg-green-500 text-white px-4 py-2"
          >
            New RFQ
          </Link>
        </div>
      </form>
      <ul>
        {rfqs.map((rfq) => (
          <li key={rfq.id} className="border p-2 mb-2">
            {rfq.symbol} - {rfq.quantity} - {rfq.status} - {rfq.orderStatus}
            <div className="mt-2 space-x-2">
              <Link
                href={`/rfqs/${rfq.id}`}
                className="text-blue-600 underline"
              >
                View
              </Link>
              <Link
                href={`/messages?toUserId=${rfq.userId}&rfqId=${rfq.id}`}
                className="text-green-600 underline"
              >
                Contact Buyer
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(RFQs);

