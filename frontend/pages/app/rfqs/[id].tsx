import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

interface Attachment {
  id: number;
  name?: string;
  url: string;
}

interface ThreadItem {
  id: number;
  type: 'message' | 'offer';
  senderName?: string;
  content?: string;
  price?: number;
  terms?: string;
  status?: string;
  createdAt: string;
}

interface RFQ {
  id: number;
  commodity: string;
  region: string;
  incoterms: string;
  quantity: number;
  status: string;
  expiry?: string;
  attachments?: Attachment[];
  thread?: ThreadItem[];
}

const statusColor = (s?: string) => {
  switch ((s || '').toLowerCase()) {
    case 'accepted':
      return 'bg-green-200 text-green-800';
    case 'counter':
      return 'bg-yellow-200 text-yellow-800';
    case 'rejected':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export default function RfqDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadRfq = async () => {
    if (!id) return;
    try {
      const data = await apiFetch(`/api/v1/rfqs/${id}`);
      setRfq(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRfq();
  }, [id]);

  useEffect(() => {
    if (!rfq?.expiry) return;
    const update = () => {
      const diff = new Date(rfq.expiry!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [rfq?.expiry]);

  const expired = timeLeft === 'Expired';

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    setLoading(true);
    try {
      await apiFetch(`/api/v1/rfqs/${id}/offers`, {
        method: 'POST',
        body: JSON.stringify({ price: Number(price), message }),
      });
      setPrice('');
      setMessage('');
      await loadRfq();
    } catch (err: any) {
      if (typeof window !== 'undefined') alert(err.message || 'Failed to send offer');
    } finally {
      setLoading(false);
    }
  };

  if (!rfq) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <div className="md:w-1/3 space-y-4">
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-2">RFQ #{rfq.id}</h2>
          <div>Commodity: {rfq.commodity}</div>
          <div>Region: {rfq.region}</div>
          <div>Incoterms: {rfq.incoterms}</div>
          <div>Quantity: {rfq.quantity}</div>
          <div>Status: {rfq.status}</div>
          {rfq.expiry && <div>Expires in: {timeLeft}</div>}
        </div>
        {rfq.attachments && rfq.attachments.length > 0 && (
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Attachments</h3>
            <ul className="list-disc list-inside space-y-1">
              {rfq.attachments.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {a.name || a.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto border rounded p-4 space-y-4">
          {rfq.thread && rfq.thread.length > 0 ? (
            rfq.thread.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
                  {item.senderName ? item.senderName.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-400">
                    {item.senderName} • {new Date(item.createdAt).toLocaleString()}
                  </div>
                  {item.type === 'offer' ? (
                    <div className="mt-1 border rounded p-2">
                      <div>Price: {item.price}</div>
                      {item.terms && <div>Terms: {item.terms}</div>}
                      {item.status && (
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded text-xs ${statusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      )}
                      {item.content && <div className="mt-1">{item.content}</div>}
                    </div>
                  ) : (
                    <div className="mt-1">{item.content}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet</div>
          )}
        </div>
        <form onSubmit={submitOffer} className="mt-4 flex gap-2">
          <input
            type="number"
            placeholder="Offer price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded flex-1"
            disabled={expired || loading}
          />
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 rounded flex-1"
            disabled={expired || loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={expired || loading}
          >
            Send
          </button>
        </form>
        {expired && <div className="mt-2 text-red-600">RFQ expired - new offers disabled.</div>}
      </div>
    </div>
  );
}

