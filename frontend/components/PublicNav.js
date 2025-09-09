import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const router = useRouter();

  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/login', label: 'Login' },
    { href: '/signup', label: 'Sign Up' },
  ];

  const resourceLinks = [
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  const linkClass = (href) =>
    router.pathname === href
      ? 'text-indigo-400 border-b-2 border-indigo-400'
      : 'text-gray-300 hover:text-indigo-400';

  return (
    <nav className="bg-gray-900 shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="text-xl font-bold text-gray-100">
            <Link href="/">FalconTrade</Link>
          </div>
          <button
            className="md:hidden text-gray-100 focus:outline-none"
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
          <ul className="hidden md:flex space-x-6 items-center">
            {mainLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={`pb-1 ${linkClass(href)}`}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="pb-1 text-gray-300 hover:text-indigo-400 focus:outline-none"
              >
                Resources
              </button>
              {resourcesOpen && (
                <ul className="absolute left-0 mt-2 w-40 bg-gray-800 rounded shadow-lg py-2">
                  {resourceLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
        {isOpen && (
          <ul className="md:hidden pb-4 space-y-2">
            {mainLinks.map(({ href, label }) => (
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
            <li>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="w-full text-left text-gray-300 hover:text-indigo-400"
              >
                Resources
              </button>
              {resourcesOpen && (
                <ul className="mt-2 ml-4 space-y-2">
                  {resourceLinks.map(({ href, label }) => (
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
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
