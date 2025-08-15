import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ];

  const linkClass = (href) =>
    router.pathname === href
      ? 'text-brand-dark dark:text-brand-light border-b-2 border-brand-dark dark:border-brand-light'
      : 'text-gray-700 dark:text-gray-300 hover:text-brand-dark dark:hover:text-brand-light';

  return (
    <nav className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="text-xl font-bold">
            <Link href="/">FalconTrade</Link>
          </div>
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <ul className="hidden md:flex space-x-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={`pb-1 ${linkClass(href)}`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {isOpen && (
          <ul className="md:hidden pb-4 space-y-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block ${linkClass(href)}`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
