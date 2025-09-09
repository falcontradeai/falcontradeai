import { useState } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../lib/api';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
      toast.error('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block">Username:</label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="space-y-2 mt-2">
        <label className="block">Password:</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="space-y-2 mt-2">
        <label className="block">Role:</label>
        <Input value={role} onChange={(e) => setRole(e.target.value)} />
      </div>
      <Button type="submit" className="mt-4">Signup</Button>
    </form>
  );
}
