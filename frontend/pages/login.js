import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      login(res.data);
      router.push('/');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Login failed');
      }
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
      <Button type="submit" className="mt-4">Login</Button>
      <div>
        <a href="/forgot-password">Forgot password?</a>
      </div>
    </form>
  );
}
