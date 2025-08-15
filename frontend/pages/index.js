import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to FalconTrade</h1>
        <p className="text-xl mb-8">Track markets, manage portfolios, and trade smarter with enterprise-grade tools.</p>
        <div className="space-x-4">
          <Link href="/signup" className="px-6 py-3 bg-brand text-white rounded-md hover:bg-brand-dark">
            Get Started
          </Link>
          <Link href="/pricing" className="px-6 py-3 border border-brand text-brand rounded-md hover:bg-brand hover:text-white">
            View Pricing
          </Link>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Real-Time Data</h2>
          <p className="text-gray-600 dark:text-gray-300">Stay informed with up-to-the-minute market information across exchanges.</p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Portfolio Analytics</h2>
          <p className="text-gray-600 dark:text-gray-300">Gain insights into your holdings with detailed performance analytics.</p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Secure Trading</h2>
          <p className="text-gray-600 dark:text-gray-300">Execute trades with confidence on our enterprise-grade platform.</p>
        </div>
      </section>

      <section className="text-center">
        <p className="mb-4">Have questions?</p>
        <Link href="/contact" className="text-brand hover:underline">
          Contact our team
        </Link>
      </section>
    </div>
  );
}
