import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../lib/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password, role }),
      });
      router.push('/login');
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Role:</label>
        <input value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <button type="submit">Signup</button>
    </form>
  );
}
