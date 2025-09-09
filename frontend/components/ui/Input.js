import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`rounded-2xl border border-neutral-300 bg-white dark:bg-neutral-800 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-light ${className}`}
      {...props}
    />
  );
}
