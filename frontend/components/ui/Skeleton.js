import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-2xl ${className}`} />
  );
}
