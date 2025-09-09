import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';

interface MarketRow {
  symbol: string;
  name?: string;
  bid?: number;
  ask?: number;
  last?: number;
  change?: number;
  percentChange?: number;
  volume?: number;
  openInterest?: number;
}

const GROUPS = [
  { label: 'Energy', value: 'energy' },
  { label: 'Metals', value: 'metals' },
  { label: 'Agriculture', value: 'agriculture' },
];

export default function MarketsPage() {
  const [group, setGroup] = useState('energy');
  const [markets, setMarkets] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/market-data?group=${group}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMarkets(data);
      } catch (err) {
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [group]);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return markets.filter((m) =>
      m.symbol.toLowerCase().includes(lower) || (m.name && m.name.toLowerCase().includes(lower))
    );
  }, [markets, search]);

  useEffect(() => {
    setSelected(0);
  }, [filtered]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      router.push(`/app/markets/${filtered[selected].symbol}`);
    }
  };

  const renderNumber = (val?: number) => (val !== undefined && val !== null ? val.toLocaleString() : '-');
  const deltaClass = (v?: number) =>
    v === undefined || v === 0 ? 'text-gray-500' : v > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="mb-4 flex gap-2">
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="border p-2 rounded"
        >
          {GROUPS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search symbol or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="overflow-x-auto max-h-[70vh]">
        <table className="min-w-full rounded-2xl overflow-hidden">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="text-left p-2">Symbol</th>
              <th className="text-right p-2">Bid</th>
              <th className="text-right p-2">Ask</th>
              <th className="text-right p-2">Last</th>
              <th className="text-right p-2">Δ</th>
              <th className="text-right p-2">%Δ</th>
              <th className="text-right p-2">Vol</th>
              <th className="text-right p-2">OI</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="p-2">
                        <div className="h-4 bg-gray-200 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.map((m, idx) => (
                  <tr
                    key={m.symbol}
                    className={idx === selected ? 'bg-gray-100' : ''}
                  >
                    <td className="p-2 text-left">{m.symbol}</td>
                    <td className="p-2 text-right font-mono">{renderNumber(m.bid)}</td>
                    <td className="p-2 text-right font-mono">{renderNumber(m.ask)}</td>
                    <td className="p-2 text-right font-mono">{renderNumber(m.last)}</td>
                    <td className={`p-2 text-right font-mono ${deltaClass(m.change)}`}>{renderNumber(m.change)}</td>
                    <td className={`p-2 text-right font-mono ${deltaClass(m.percentChange)}`}>{renderNumber(m.percentChange)}</td>
                    <td className="p-2 text-right font-mono">{renderNumber(m.volume)}</td>
                    <td className="p-2 text-right font-mono">{renderNumber(m.openInterest)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

