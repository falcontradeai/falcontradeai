import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus('Please fill in all required fields.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    if (file) {
      formData.append('file', file);
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contact`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Message sent successfully.');
      setName('');
      setEmail('');
      setMessage('');
      setFile(null);
    } catch (err) {
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name*</label>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Email*</label>
          <input
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Message*</label>
          <textarea
            className="border p-2 w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Attachment (optional)</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Send
        </button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}
