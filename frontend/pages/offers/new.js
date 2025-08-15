import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';

function NewOffer() {
  const router = useRouter();
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priceTier, setPriceTier] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('symbol', symbol);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('priceTier', priceTier);
      formData.append('location', location);
      formData.append('deliveryTerms', deliveryTerms);
      files.forEach((file) => formData.append('attachments', file));
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/offers');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">New Offer</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Commodity"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Price Tier"
          value={priceTier}
          onChange={(e) => setPriceTier(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Delivery Terms"
          value={deliveryTerms}
          onChange={(e) => setDeliveryTerms(e.target.value)}
        />
        <input type="file" multiple onChange={handleFileChange} />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}

export default withAuth(NewOffer);

