import React from 'react';

const plans = [
  {
    name: 'Basic',
    price: '$10 / month',
    features: ['Core trading tools', 'Community support'],
    planId: 'basic',
  },
  {
    name: 'Pro',
    price: '$30 / month',
    features: ['Everything in Basic', 'Priority support', 'Advanced analytics'],
    planId: 'pro',
  },
];

export default function Pricing() {
  const handleSubscribe = (plan) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/create-checkout-session?plan=${plan}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Pricing</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.planId} className="p-6 border rounded-lg shadow-sm flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">{p.name}</h2>
            <p className="text-xl mb-4">{p.price}</p>
            <ul className="mb-6 list-disc list-inside space-y-1">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(p.planId)}
              className="mt-auto px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
