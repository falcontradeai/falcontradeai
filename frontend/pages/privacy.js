import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p>
        FalconTrade respects your privacy. This demo page outlines how user data could
        be handled within the platform. In a production environment, this policy
        would describe the collection, use, and protection of personal and
        company information.
      </p>
      <p>
        By using FalconTrade, you agree to the terms described here. For any
        questions, please <Link className="text-blue-500 underline" href="/contact">contact us</Link>.
      </p>
    </div>
  );
}
