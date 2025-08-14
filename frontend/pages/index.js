import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl mb-4">Welcome to FalconTrade</h1>
      <p className="mb-4">Track the markets and manage your portfolio with ease.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <Link href="/about">Learn more about us</Link>
        </li>
        <li>
          <Link href="/pricing">View pricing plans</Link>
        </li>
        <li>
          <Link href="/faq">Read our FAQ</Link>
        </li>
        <li>
          <Link href="/contact">Contact us</Link>
        </li>
      </ul>
    </div>
  );
}
