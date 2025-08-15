import Link from 'next/link';

export default function Terms() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p>
        These example terms govern the use of the FalconTrade platform. They
        outline user responsibilities, acceptable use, and limitations of
        liability. Replace this text with legally reviewed content before
        production deployment.
      </p>
      <p>
        Continued use of FalconTrade constitutes acceptance of these terms. If
        you have questions, please <Link className="text-blue-500 underline" href="/contact">contact us</Link>.
      </p>
    </div>
  );
}
