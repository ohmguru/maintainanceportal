'use client';

import { useEffect, useState } from 'react';

export default function BatteryReserveIndicator() {
  const [reserve, setReserve] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/battery-inventory')
      .then(res => res.json())
      .then(data => {
        setReserve(data.totalReserve1 || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch battery reserve:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg border border-cyan-500/30">
        <span className="text-cyan-400 text-xs font-mono">Loading...</span>
      </div>
    );
  }

  const getReserveColor = (reserve: number) => {
    if (reserve >= 250) return 'text-cyan-300';
    if (reserve >= 150) return 'text-green-400';
    if (reserve >= 100) return 'text-yellow-400';
    if (reserve >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getReserveStatus = (reserve: number) => {
    if (reserve >= 250) return 'EXCELLENT';
    if (reserve >= 150) return 'GOOD';
    if (reserve >= 100) return 'MODERATE';
    if (reserve >= 50) return 'LOW';
    return 'CRITICAL';
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
      <div className="flex flex-col">
        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Battery Reserve 1</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${getReserveColor(reserve || 0)} font-mono`}>
            {reserve}
          </span>
          <span className="text-xs text-gray-400">units</span>
        </div>
      </div>
      <div className={`px-2 py-1 rounded text-[10px] font-bold ${
        reserve && reserve >= 150
          ? 'bg-green-500/20 text-green-300 border border-green-400/50'
          : reserve && reserve >= 100
          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50'
          : 'bg-red-500/20 text-red-300 border border-red-400/50'
      }`}>
        {getReserveStatus(reserve || 0)}
      </div>
    </div>
  );
}
