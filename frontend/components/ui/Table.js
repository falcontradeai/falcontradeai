import React from 'react';

export default function Table({ className = '', ...props }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full rounded-2xl overflow-hidden ${className}`} {...props} />
    </div>
  );
}
