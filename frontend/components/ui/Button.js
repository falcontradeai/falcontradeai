import React from 'react';

export default function Button({ className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 bg-brand text-white shadow focus:outline-none focus:ring-2 focus:ring-brand-light disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
