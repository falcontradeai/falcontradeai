import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function FAQ() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/content/faq');
        if (res.ok) {
          const data = await res.json();
          setContent(data.body);
          setEditContent(data.body);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

  const saveContent = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/content/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ body: editContent }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.body);
        setEditing(false);
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Frequently Asked Questions</h1>
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
