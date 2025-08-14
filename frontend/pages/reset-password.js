import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/auth/reset-password', {
        token,
        password,
      });
      setMessage('Password updated. You can now log in.');
    } catch (err) {
      setMessage('Unable to reset password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
}

