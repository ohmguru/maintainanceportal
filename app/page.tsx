'use client';

import { useState, useMemo } from 'react';
import { locations, Location } from '@/data/locations';

type SortField = 'composite' | 'blaster' | 'vest' | 'batteries';
type SortDirection = 'asc' | 'desc';

export default function Home() {
  const [sortField, setSortField] = useState<SortField>('composite');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedLocations = useMemo(() => {
    const sorted = [...locations].sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortField) {
        case 'composite':
          aValue = a.compositeRank;
          bValue = b.compositeRank;
          break;
        case 'blaster':
          aValue = a.blasterRank;
          bValue = b.blasterRank;
          break;
        case 'vest':
          aValue = a.vestRank;
          bValue = b.vestRank;
          break;
        case 'batteries':
          aValue = a.batteriesRank;
          bValue = b.batteriesRank;
          break;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  const getRankBadgeColor = (rank: number, totalLocations: number = 25) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 shadow-[0_0_10px_rgba(253,224,71,0.5)]';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 shadow-[0_0_8px_rgba(209,213,219,0.5)]';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 shadow-[0_0_8px_rgba(251,146,60,0.5)]';
    if (rank <= 5) return 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50';
    if (rank <= 10) return 'bg-purple-500/20 text-purple-300 border border-purple-400/50';
    if (rank <= 15) return 'bg-pink-500/20 text-pink-300 border border-pink-400/50';
    if (rank > totalLocations - 5) return 'bg-red-500/20 text-red-400 border border-red-400/50';
    return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
  };

  const getHealthColor = (percentile: number) => {
    if (percentile >= 90) return 'text-cyan-300 font-bold';
    if (percentile >= 70) return 'text-green-400';
    if (percentile >= 50) return 'text-yellow-400';
    if (percentile >= 30) return 'text-orange-400';
    return 'text-pink-500';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-purple-900 via-black to-pink-900 p-2 overflow-hidden relative">
      {/* Synthwave grid background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(255,20,147,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,20,147,0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center bottom'
      }}></div>

      <div className="flex-none relative z-10">
        <header className="text-center mb-2">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 tracking-wider uppercase" style={{
            textShadow: '0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(236,72,153,0.3)',
            fontFamily: 'monospace'
          }}>
            ⚡ MainEvent Fleet Reliability ⚡
          </h1>
        </header>
      </div>

      <div className="flex-1 min-h-0 flex flex-col relative z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg border-2 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs" style={{ fontFamily: 'monospace' }}>
              <thead className="sticky top-0 z-10">
                <tr>
                  <th rowSpan={2} className="py-1.5 px-3 text-left font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-cyan-300 border-b-2 border-cyan-400/50 uppercase tracking-wider">Location</th>
                  <th
                    rowSpan={2}
                    className="py-1.5 px-2 text-center font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-pink-300 border-b-2 border-pink-400/50 uppercase tracking-wider border-l-2 border-pink-400/30 cursor-pointer hover:bg-purple-500 transition-all"
                    onClick={() => handleSort('composite')}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1">
                        <span>Overall</span>
                        <span className="text-xs">{getSortIcon('composite')}</span>
                      </div>
                      <span className="text-[9px] opacity-80">Rank</span>
                    </div>
                  </th>
                  <th colSpan={2} className="py-1 px-2 text-center font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-pink-300 border-b border-pink-400/50 uppercase tracking-wider border-l-2 border-pink-400/30">Blaster</th>
                  <th colSpan={2} className="py-1 px-2 text-center font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-pink-300 border-b border-pink-400/50 uppercase tracking-wider border-l-2 border-pink-400/30">Vest</th>
                  <th colSpan={2} className="py-1 px-2 text-center font-bold bg-gradient-to-r from-purple-600 to-purple-700 text-pink-300 border-b border-pink-400/50 uppercase tracking-wider border-l-2 border-pink-400/30">Battery</th>
                </tr>
                <tr>
                  <th
                    className="py-1 px-2 text-center font-semibold cursor-pointer bg-purple-800/80 text-pink-400 hover:bg-purple-700/80 transition-all border-b border-pink-400/30 border-l-2 border-pink-400/30"
                    onClick={() => handleSort('blaster')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Rank</span>
                      <span className="text-xs">{getSortIcon('blaster')}</span>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-center font-semibold bg-purple-800/80 text-cyan-400 border-b border-cyan-400/30 border-r-2 border-pink-400/30">Health %</th>
                  <th
                    className="py-1 px-2 text-center font-semibold cursor-pointer bg-purple-800/80 text-pink-400 hover:bg-purple-700/80 transition-all border-b border-pink-400/30 border-l-2 border-pink-400/30"
                    onClick={() => handleSort('vest')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Rank</span>
                      <span className="text-xs">{getSortIcon('vest')}</span>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-center font-semibold bg-purple-800/80 text-cyan-400 border-b border-cyan-400/30 border-r-2 border-pink-400/30">Health %</th>
                  <th
                    className="py-1 px-2 text-center font-semibold cursor-pointer bg-purple-800/80 text-pink-400 hover:bg-purple-700/80 transition-all border-b border-pink-400/30 border-l-2 border-pink-400/30"
                    onClick={() => handleSort('batteries')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Rank</span>
                      <span className="text-xs">{getSortIcon('batteries')}</span>
                    </div>
                  </th>
                  <th className="py-1 px-2 text-center font-semibold bg-purple-800/80 text-cyan-400 border-b border-cyan-400/30">Health %</th>
                </tr>
              </thead>
              <tbody>
                {sortedLocations.map((location, index) => (
                  <tr
                    key={location.name}
                    className={`hover:bg-pink-500/10 transition-all ${
                      index % 2 === 0 ? 'bg-black/40' : 'bg-purple-900/20'
                    } border-b border-purple-500/20`}
                  >
                    <td className="py-1 px-3 font-bold text-cyan-300">
                      {location.name}
                    </td>
                    <td className="py-1 px-2 text-center border-l-2 border-pink-400/30">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-bold text-xs ${getRankBadgeColor(location.compositeRank)}`}>
                        {location.compositeRank}
                      </span>
                    </td>
                    <td className="py-1 px-2 text-center border-l-2 border-pink-400/30">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-semibold text-xs ${getRankBadgeColor(location.blasterRank)}`}>
                        {location.blasterRank}
                      </span>
                    </td>
                    <td className={`py-1 px-2 text-center font-bold border-r-2 border-pink-400/30 ${getHealthColor(location.blasterPercentile)}`}>
                      {location.blasterPercentile}%
                    </td>
                    <td className="py-1 px-2 text-center border-l-2 border-pink-400/30">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-semibold text-xs ${getRankBadgeColor(location.vestRank)}`}>
                        {location.vestRank}
                      </span>
                    </td>
                    <td className={`py-1 px-2 text-center font-bold border-r-2 border-pink-400/30 ${getHealthColor(location.vestPercentile)}`}>
                      {location.vestPercentile}%
                    </td>
                    <td className="py-1 px-2 text-center border-l-2 border-pink-400/30">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded font-semibold text-xs ${getRankBadgeColor(location.batteriesRank)}`}>
                        {location.batteriesRank}
                      </span>
                    </td>
                    <td className={`py-1 px-2 text-center font-bold ${getHealthColor(location.batteriesPercentile)}`}>
                      {location.batteriesPercentile}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-none mt-2 bg-black/60 backdrop-blur-sm rounded-lg border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] p-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex gap-4 items-center">
              <span className="text-cyan-400 font-bold uppercase">Legend:</span>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(1)}`}></span>
                <span className="text-yellow-300">1st</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(2)}`}></span>
                <span className="text-gray-300">2nd</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(3)}`}></span>
                <span className="text-orange-300">3rd</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(5)}`}></span>
                <span className="text-cyan-300">Top 5</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(10)}`}></span>
                <span className="text-purple-300">Top 10</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(15)}`}></span>
                <span className="text-pink-300">Top 15</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`w-5 h-5 rounded ${getRankBadgeColor(21, 25)}`}></span>
                <span className="text-red-400">Bottom 5</span>
              </div>
            </div>
            <span className="text-pink-400 animate-pulse">▲ Click headers to sort</span>
          </div>
        </div>
      </div>
    </div>
  );
}
