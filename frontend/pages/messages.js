import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import withAuth from '../components/withAuth';

function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [toUserId, setToUserId] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/messages', {
        withCredentials: true,
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('toUserId', toUserId);
      formData.append('content', content);
      files.forEach((file) => formData.append('attachments', file));
      await axios.post('http://localhost:5000/api/v1/messages', formData, {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Messages</h1>
      <form onSubmit={sendMessage} className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="To User ID"
          value={toUserId}
          onChange={(e) => setToUserId(e.target.value)}
        />
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
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="border p-2">
            <p>{msg.content}</p>
            {msg.attachments &&
              msg.attachments.map((att, idx) => (
                att.mimetype && att.mimetype.startsWith('image/') ? (
                  <img
                    key={idx}
                    src={`http://localhost:5000${att.url}`}
                    alt={att.originalname}
                    className="max-w-xs mt-2"
                  />
                ) : (
                  <a
                    key={idx}
                    href={`http://localhost:5000${att.url}`}
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
      </div>
    </div>
  );
}

export default withAuth(Messages);
