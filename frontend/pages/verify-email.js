import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        await axios.get(
          `http://localhost:5000/api/v1/auth/verify-email?token=${token}`
        );
        setMessage('Email verified successfully.');
      } catch (err) {
        setMessage('Verification failed.');
      }
    };
    verify();
  }, [token]);

  return <p>{message}</p>;
}

