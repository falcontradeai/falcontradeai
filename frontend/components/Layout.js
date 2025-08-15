import React from 'react';

export default function Layout({ children, header, footer }) {
  return (
    <div className="flex flex-col min-h-screen">
      {header}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      {footer && <footer className="mt-auto">{footer}</footer>}
    </div>
  );
}
