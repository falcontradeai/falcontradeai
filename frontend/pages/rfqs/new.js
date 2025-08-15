import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';

function NewRFQ() {
  const router = useRouter();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('symbol', symbol);
      formData.append('quantity', quantity);
      files.forEach((file) => formData.append('attachments', file));
      await axios.post('http://localhost:5000/api/v1/rfqs', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/rfqs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">New RFQ</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Commodity"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input type="file" multiple onChange={handleFileChange} />
        <button className="bg-blue-500 text-white px-4 py-2" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}

export default withAuth(NewRFQ, 'subscriber');

