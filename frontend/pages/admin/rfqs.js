import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminRFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchRFQs = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/rfqs`, {
        withCredentials: true,
      });
      setRfqs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, []);

  const approve = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/rfqs/${id}/approve`,
        {},
        { withCredentials: true }
      );
      fetchRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('symbol', symbol);
      formData.append('quantity', quantity);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rfqs`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      setSymbol('');
      setQuantity('');
      fetchRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  const edit = async (rfq) => {
    const newQuantity = prompt('New quantity', rfq.quantity);
    if (newQuantity === null) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rfqs/${rfq.id}`,
        { quantity: newQuantity },
        { withCredentials: true },
      );
      fetchRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/rfqs/${id}/reject`,
        {},
        { withCredentials: true }
      );
      fetchRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Manage RFQs</h1>
      <form onSubmit={create} className="mb-4 space-x-2">
        <input
          className="border p-1"
          placeholder="Commodity"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border p-1"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-2 py-1" type="submit">
          Add
        </button>
      </form>
      <ul>
        {rfqs.map((rfq) => (
          <li key={rfq.id} className="border p-2 mb-2">
            {rfq.symbol} - {rfq.quantity} - {rfq.status}
            <div className="mt-2 space-x-2">
              {rfq.status === 'pending' && (
                <>
                  <button
                    className="bg-green-500 text-white px-2 py-1"
                    onClick={() => approve(rfq.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1"
                    onClick={() => reject(rfq.id)}
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                className="bg-blue-500 text-white px-2 py-1"
                onClick={() => edit(rfq)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminRFQs, 'admin');

