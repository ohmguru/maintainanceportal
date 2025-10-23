'use client';

import { useEffect, useState } from 'react';

export default function BatteryReserveIndicator() {
  const [reserve1, setReserve1] = useState<number | null>(null);
  const [finalReserve, setFinalReserve] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/battery-inventory')
      .then(res => res.json())
      .then(data => {
        setReserve1(data.totalReserve1 || 0);
        setFinalReserve(data.finalEmergencyReserve || 0);
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

  const totalReserve = (reserve1 || 0) + (finalReserve || 0);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
      <div className="flex flex-col border-r border-cyan-500/30 pr-3">
        <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Primary Reserve</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-bold ${getReserveColor(reserve1 || 0)} font-mono`}>
            {reserve1}
          </span>
        </div>
      </div>
      <div className="flex flex-col border-r border-purple-500/30 pr-3">
        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Final Emergency Reserve</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-purple-300 font-mono">
            {finalReserve}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider">Total Reserve</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${getReserveColor(totalReserve)} font-mono`}>
            {totalReserve}
          </span>
        </div>
      </div>
    </div>
  );
}
