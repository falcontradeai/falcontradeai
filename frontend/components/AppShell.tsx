import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';
import { Bars3Icon } from '@heroicons/react/24/outline';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <nav
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-neutral-900 p-4 space-y-2 transition-transform md:relative md:translate-x-0 md:flex md:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-2xl ${linkClass(item.href)}`}
            onClick={() => setSidebarOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Button
              className="md:hidden p-2 bg-neutral-800"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Bars3Icon className="w-5 h-5" />
            </Button>
            <div className="text-xl font-bold">FalconTrade</div>
          </div>
          <input
            type="text"
            placeholder="Search symbols, RFQs..."
            className="w-full max-w-md mx-4 px-3 py-2 rounded-2xl bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-light"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-neutral-800 rounded-2xl"
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
          {ticker.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-32 h-6 m-2" />
              ))
            : ticker.map((item) => (
                <div
                  key={item.symbol}
                  className="flex items-center space-x-2 px-4 py-1"
                >
                  <span>{item.symbol}</span>
                  <span className="font-mono">{item.last}</span>
                  <span
                    className={`font-mono ${
                      item.changePercent >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
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

