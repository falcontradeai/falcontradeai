import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return <h1>FalconTrade Frontend is running</h1>;
}
