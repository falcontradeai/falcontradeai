import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/listings`, {
        withCredentials: true,
      });
      setOffers(res.data.offers || res.data);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/listings/${id}/approve`,
        {},
        { withCredentials: true }
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('symbol', symbol);
      formData.append('price', price);
      formData.append('quantity', quantity);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      setSymbol('');
      setPrice('');
      setQuantity('');
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const edit = async (offer) => {
    const newPrice = prompt('New price', offer.price);
    if (newPrice === null) return;
    const newQuantity = prompt('New quantity', offer.quantity);
    if (newQuantity === null) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/${offer.id}`,
        { price: newPrice, quantity: newQuantity },
        { withCredentials: true },
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/listings/${id}`,
        { withCredentials: true }
      );
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/listings/${id}/reject`,
        {},
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
      <form onSubmit={create} className="mb-4 space-x-2">
        <input
          className="border p-1"
          placeholder="Commodity"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border p-1"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
        {offers.map((offer) => (
          <li key={offer.id} className="border p-2 mb-2">
            {offer.symbol} - {offer.price} - {offer.quantity} - {offer.status}
            <div className="mt-2 space-x-2">
              {offer.status === 'pending' && (
                <>
                  <button
                    className="bg-green-500 text-white px-2 py-1"
                    onClick={() => approve(offer.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1"
                    onClick={() => reject(offer.id)}
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                className="bg-blue-500 text-white px-2 py-1"
                onClick={() => edit(offer)}
              >
                Edit
              </button>
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

