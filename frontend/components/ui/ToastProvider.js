import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'rounded-2xl bg-neutral-800 text-neutral-100 shadow',
        success: { className: 'bg-green-600 text-white' },
        error: { className: 'bg-red-600 text-white' }
      }}
    />
  );
}
