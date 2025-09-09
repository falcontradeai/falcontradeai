import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

export default function About() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await apiFetch('/api/v1/content/about');
        setContent(data.body);
        setEditContent(data.body);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

  const saveContent = async () => {
    try {
      const data = await apiFetch('/api/v1/content/about', {
        method: 'PUT',
        body: JSON.stringify({ body: editContent }),
      });
      setContent(data.body);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">About FalconTrade</h1>
      {editing ? (
        <div>
          <textarea
            className="w-full border p-2 mb-2"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button className="mr-2" onClick={saveContent}>
            Save
          </button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <p>{content}</p>
      )}
      {user && user.role === 'admin' && !editing && (
        <button className="mt-4" onClick={() => setEditing(true)}>
          Edit
        </button>
      )}
    </div>
  );
}
