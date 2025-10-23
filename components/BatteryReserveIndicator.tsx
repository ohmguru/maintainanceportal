'use client';

import { useEffect, useState } from 'react';

export default function BatteryReserveIndicator() {
  const [reserve1, setReserve1] = useState<number | null>(null);
  const [finalReserve, setFinalReserve] = useState<number | null>(null);
  const [allocationBase, setAllocationBase] = useState<number>(90);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/battery-inventory')
      .then(res => res.json())
      .then(data => {
        setReserve1(data.totalReserve1 || 0);
        setFinalReserve(data.finalEmergencyReserve || 0);
        setAllocationBase(data.allocationBase || 90);
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
      <div
        className="flex flex-col border-r border-cyan-500/30 pr-3 group relative cursor-help"
        title={`Units in excess of per-location quota (${allocationBase} batteries/location)`}
      >
        <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Primary Reserve</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-bold ${getReserveColor(reserve1 || 0)} font-mono`}>
            {reserve1}
          </span>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-cyan-400/50 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          <div className="text-[10px] text-cyan-300 font-mono mb-1 font-bold">PRIMARY RESERVE</div>
          <div className="text-[9px] text-gray-300 font-mono">Units in excess of per-location quota</div>
          <div className="text-[9px] text-cyan-400 font-mono">Current quota: {allocationBase} batteries/location</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-cyan-400/50"></div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col border-r border-purple-500/30 pr-3 group relative cursor-help"
        title="Reserve batteries at Gel Blaster HQ"
      >
        <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Final Emergency Reserve</span>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-purple-300 font-mono">
            {finalReserve}
          </span>
        </div>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-purple-400/50 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          <div className="text-[10px] text-purple-300 font-mono mb-1 font-bold">FINAL EMERGENCY RESERVE</div>
          <div className="text-[9px] text-gray-300 font-mono">Reserve batteries at Gel Blaster HQ</div>
          <div className="text-[9px] text-purple-400 font-mono">Available for urgent deployments</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-purple-400/50"></div>
          </div>
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
