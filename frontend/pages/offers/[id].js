import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import withAuth from '../../components/withAuth';

function OfferDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [offer, setOffer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const fetchOffer = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offers/${id}`, {
        withCredentials: true,
      });
      setOffer(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages?offerId=${id}`,
        { withCredentials: true }
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOffer();
      fetchMessages();
    }
  }, [id]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('toUserId', offer.userId);
      formData.append('content', content);
      formData.append('offerId', id);
      files.forEach((file) => formData.append('attachments', file));
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/messages`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setContent('');
      setFiles([]);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (!offer) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Offer Details</h1>
      <p>Symbol: {offer.symbol}</p>
      <p>Price: {offer.price}</p>
      <p>Quantity: {offer.quantity}</p>
      <p>Status: {offer.status}</p>
      <p>Order Status: {offer.orderStatus}</p>
      <div className="mt-4">
        <h2 className="text-xl mb-2">Conversation</h2>
        {messages.map((msg) => (
          <div key={msg.id} className="border p-2 mb-2">
            <p>{msg.content}</p>
            {msg.attachments &&
              msg.attachments.map((att, idx) => (
                att.mimetype && att.mimetype.startsWith('image/') ? (
                  <img
                    key={idx}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${att.url}`}
                    alt={att.originalname}
                    className="max-w-xs mt-2"
                  />
                ) : (
                  <a
                    key={idx}
                    href={`${process.env.NEXT_PUBLIC_API_URL}${att.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline block mt-2"
                  >
                    {att.originalname || att.filename}
                  </a>
                )
              ))}
          </div>
        ))}
        <form onSubmit={sendMessage} className="mt-4 space-y-2">
          <textarea
            className="border p-2 w-full"
            placeholder="Message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input type="file" multiple onChange={handleFileChange} />
          <button className="bg-blue-500 text-white px-4 py-2" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(OfferDetail);

