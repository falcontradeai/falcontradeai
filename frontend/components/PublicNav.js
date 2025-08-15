import Link from 'next/link';

export default function PublicNav() {
  return (
    <nav className="p-4 space-x-4 bg-gray-100 dark:bg-gray-800">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/faq">FAQ</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
    </nav>
  );
}
