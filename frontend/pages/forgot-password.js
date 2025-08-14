import { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/auth/forgot-password', {
        email,
      });
      setMessage('Check your email for a reset link.');
    } catch (err) {
      setMessage('Unable to send reset email.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button type="submit">Send Reset Link</button>
      {message && <p>{message}</p>}
    </form>
  );
}

