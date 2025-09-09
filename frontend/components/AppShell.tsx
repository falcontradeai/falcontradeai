import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

interface TickerItem {
  symbol: string;
  last: number;
  changePercent: number;
}

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [ticker, setTicker] = useState<TickerItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const data = await apiFetch('/api/v1/market-data/tape');
        if (Array.isArray(data)) {
          setTicker(data.slice(0, 8));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTicker();
    const id = setInterval(fetchTicker, 5000);
    return () => clearInterval(id);
  }, []);

  const navItems = [
    { label: 'Markets', href: '/app/markets' },
    { label: 'RFQs', href: '/app/rfqs' },
    { label: 'Deals', href: '/app/deals' },
    { label: 'Portfolio', href: '/app/portfolio' },
    { label: 'Analytics', href: '/app/analytics' },
    { label: 'Messages', href: '/app/messages' },
    { label: 'Admin', href: '/app/admin' },
  ];

  const linkClass = (href: string) =>
    router.pathname.startsWith(href)
      ? 'bg-neutral-800 text-white'
      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white';

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="w-[260px] flex-shrink-0 bg-neutral-900 p-4 flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded ${linkClass(item.href)}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="text-xl font-bold">FalconTrade</div>
          <input
            type="text"
            placeholder="Search symbols, RFQs..."
            className="w-full max-w-md mx-4 px-3 py-2 rounded bg-neutral-800 text-neutral-100 focus:outline-none"
          />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded shadow-lg">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-neutral-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Signup
              </Link>
            </div>
          )}
        </header>
        <div className="flex border-b border-neutral-800 overflow-x-auto">
          {ticker.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center space-x-2 px-4 py-1"
            >
              <span>{item.symbol}</span>
              <span className="font-mono">{item.last}</span>
              <span
                className={`font-mono ${
                  item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {item.changePercent}%
              </span>
            </div>
          ))}
        </div>
        <main className="p-4 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

