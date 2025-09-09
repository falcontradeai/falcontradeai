import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../../lib/api';
import { toast } from 'react-hot-toast';
import Modal from '../../../components/ui/Modal';

interface RFQ {
  id: number;
  commodity: string;
  region: string;
  incoterms: string;
  quantity: number;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-green-200 text-green-800',
  accepted: 'bg-blue-200 text-blue-800',
  closed: 'bg-gray-200 text-gray-800',
  expired: 'bg-red-200 text-red-800',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded text-xs capitalize ${
      statusColors[status.toLowerCase()] || 'bg-gray-200 text-gray-800'
    }`}>{status}</span>
  );
}

interface CreateModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function CreateRfqModal({ onClose, onCreated }: CreateModalProps) {
  const [product, setProduct] = useState('');
  const [region, setRegion] = useState('');
  const [incoterms, setIncoterms] = useState('');
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [expiry, setExpiry] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!product || !region || !incoterms || !quantity || !expiry) {
      setError('Please fill all required fields');
      return;
    }
    if (isNaN(Number(quantity))) {
      setError('Quantity must be numeric');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/v1/rfqs', {
        method: 'POST',
        body: JSON.stringify({
          product,
          region,
          incoterms,
          quantity: Number(quantity),
          targetPrice: targetPrice ? Number(targetPrice) : undefined,
          expiry,
          notes,
        }),
      });
      onCreated();
      onClose();
      toast.success('RFQ created');
    } catch (err: any) {
      setError(err.message || 'Failed to create RFQ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Create RFQ">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Product/Grade*</label>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Region*</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Incoterms*</label>
          <input
            type="text"
            value={incoterms}
            onChange={(e) => setIncoterms(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Quantity*</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Target Price</label>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Expiry Date/Time*</label>
          <input
            type="datetime-local"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [status, setStatus] = useState('');
  const [commodity, setCommodity] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadRfqs = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/v1/rfqs');
      setRfqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRfqs();
  }, []);

  const filtered = useMemo(() => {
    return rfqs.filter((r) => {
      const created = new Date(r.createdAt);
      return (
        (!status || r.status === status) &&
        (!commodity || (r.commodity || '').toLowerCase().includes(commodity.toLowerCase())) &&
        (!from || created >= new Date(from)) &&
        (!to || created <= new Date(to))
      );
    });
  }, [rfqs, status, commodity, from, to]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">RFQs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create RFQ
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="accepted">Accepted</option>
          <option value="closed">Closed</option>
          <option value="expired">Expired</option>
        </select>
        <input
          type="text"
          placeholder="Commodity"
          value={commodity}
          onChange={(e) => setCommodity(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border rounded-2xl overflow-hidden">
          <thead className="bg-neutral-800 text-neutral-100">
            <tr>
              <th className="p-2">RFQ ID</th>
              <th className="p-2">Commodity</th>
              <th className="p-2">Region</th>
              <th className="p-2">Incoterms</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center">No RFQs found</td></tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => router.push(`/app/rfqs/${r.id}`)}
                  className="cursor-pointer hover:bg-neutral-800"
                >
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.commodity}</td>
                  <td className="p-2">{r.region}</td>
                  <td className="p-2">{r.incoterms}</td>
                  <td className="p-2">{r.quantity}</td>
                  <td className="p-2"><StatusBadge status={r.status} /></td>
                  <td className="p-2">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <CreateRfqModal
          onClose={() => setShowModal(false)}
          onCreated={loadRfqs}
        />
      )}
    </div>
  );
}

