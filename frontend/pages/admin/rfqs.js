import { useEffect, useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';

function AdminRFQs() {
  const [rfqs, setRfqs] = useState([]);

  const fetchRFQs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/admin/rfqs', {
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
        `http://localhost:5000/api/v1/admin/rfqs/${id}/approve`,
        {},
        { withCredentials: true }
      );
      fetchRFQs();
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/v1/admin/rfqs/${id}/reject`,
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminRFQs, 'admin');

