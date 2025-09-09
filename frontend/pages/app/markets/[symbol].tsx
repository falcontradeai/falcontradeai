import { useRouter } from 'next/router';

export default function MarketDetail() {
  const router = useRouter();
  const { symbol } = router.query;
  return <div className="p-4 text-lg">Market details for {symbol}</div>;
}
