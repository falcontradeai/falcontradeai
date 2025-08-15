import { useState, useEffect } from 'react';
import axios from 'axios';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Visit the reset-password page and follow the instructions sent to your email.',
  },
  {
    question: 'Where can I view my offers?',
    answer: 'After logging in, navigate to the dashboard to see all of your active offers.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Use the form above or email us directly at support@example.com.',
  },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;
    if (propertyId && widgetId) {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      document.body.appendChild(s1);
    }
  }, []);

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
      <div className="mt-8">
        <h2 className="text-xl mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, idx) => (
          <details key={idx} className="mb-2">
            <summary className="font-medium cursor-pointer">{faq.question}</summary>
            <p className="mt-1">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
