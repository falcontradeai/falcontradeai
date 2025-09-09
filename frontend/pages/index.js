import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DocumentPlusIcon,
  InboxArrowDownIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: 'Create RFQ',
    icon: DocumentPlusIcon,
    description:
      'Start a new request for quotes with the assets and size you need. Your RFQ instantly reaches our network of verified counterparties.',
  },
  {
    title: 'Receive Offers',
    icon: InboxArrowDownIcon,
    description:
      'Suppliers respond with competitive proposals tailored to your request. Compare pricing and terms in real time.',
  },
  {
    title: 'Close Deal',
    icon: CheckBadgeIcon,
    description:
      'Select the best offer and execute the trade securely. Settlement and reporting are handled seamlessly.',
  },
];

export default function Home() {
  return (
    <div className="space-y-24">
      <motion.section
        className="py-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-6">Welcome to FalconTrade</h1>
        <p className="text-xl mb-10">
          Track markets, manage portfolios, and trade smarter with enterprise-grade tools.
        </p>
        <Link
          href="/signup"
          className="px-8 py-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Get Started
        </Link>
      </motion.section>

      <motion.section
        className="grid gap-8 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6 bg-gray-800 rounded-lg shadow text-center">
          <h2 className="text-3xl font-semibold mb-2">Real-Time Data</h2>
          <p className="text-gray-300 text-base">
            Stay informed with up-to-the-minute market information across exchanges.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow text-center">
          <h2 className="text-3xl font-semibold mb-2">Portfolio Analytics</h2>
          <p className="text-gray-300 text-base">
            Gain insights into your holdings with detailed performance analytics.
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg shadow text-center">
          <h2 className="text-3xl font-semibold mb-2">Secure Trading</h2>
          <p className="text-gray-300 text-base">
            Execute trades with confidence on our enterprise-grade platform.
          </p>
        </div>
      </motion.section>

      <section id="how-it-works" className="py-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          How FalconTrade Works
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="p-6 bg-gray-800 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <step.icon className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
              <h3 className="text-3xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300 text-base">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-4 text-base">Have questions?</p>
        <Link href="/contact" className="text-indigo-400 hover:underline">
          Contact our team
        </Link>
      </motion.section>
    </div>
  );
}
