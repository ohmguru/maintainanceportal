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
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-orange-400 text-orange-900';
    if (rank <= 5) return 'bg-green-100 text-green-800';
    if (rank <= 10) return 'bg-blue-100 text-blue-800';
    if (rank <= 15) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-2 overflow-hidden">
      <div className="flex-none">
        <header className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            MainEvent Location Reliability Leaderboard
          </h1>
        </header>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-3 text-left font-semibold">Location</th>
                  <th
                    className="py-2 px-2 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('composite')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Overall</span>
                      <span>{getSortIcon('composite')}</span>
                    </div>
                  </th>
                  <th
                    className="py-2 px-2 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('blaster')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Blaster</span>
                      <span>{getSortIcon('blaster')}</span>
                    </div>
                  </th>
                  <th
                    className="py-2 px-2 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('vest')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Vest</span>
                      <span>{getSortIcon('vest')}</span>
                    </div>
                  </th>
                  <th
                    className="py-2 px-2 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('batteries')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Battery</span>
                      <span>{getSortIcon('batteries')}</span>
                    </div>
                  </th>
                  <th className="py-2 px-2 text-center font-semibold">
                    Percentiles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedLocations.map((location, index) => (
                  <tr
                    key={location.name}
                    className={`hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-1.5 px-3 font-medium text-gray-900">
                      {location.name}
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm ${getRankBadgeColor(location.compositeRank)}`}>
                          {location.compositeRank}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {location.compositePercentile}%
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-semibold text-xs ${getRankBadgeColor(location.blasterRank)}`}>
                          {location.blasterRank}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {location.blaster.toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-semibold text-xs ${getRankBadgeColor(location.vestRank)}`}>
                          {location.vestRank}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {location.vest.toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-semibold text-xs ${getRankBadgeColor(location.batteriesRank)}`}>
                          {location.batteriesRank}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {location.batteries.toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <div className="text-[10px] flex gap-2 justify-center">
                        <span>B:{location.blasterPercentile}%</span>
                        <span>V:{location.vestPercentile}%</span>
                        <span>Bt:{location.batteriesPercentile}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-none mt-2 bg-white rounded-lg shadow-md p-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full ${getRankBadgeColor(1)}`}></span>
                <span>1st</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full ${getRankBadgeColor(2)}`}></span>
                <span>2nd</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full ${getRankBadgeColor(3)}`}></span>
                <span>3rd</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full ${getRankBadgeColor(5)}`}></span>
                <span>Top 5</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full ${getRankBadgeColor(10)}`}></span>
                <span>Top 10</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full ${getRankBadgeColor(15)}`}></span>
                <span>Top 15</span>
              </div>
            </div>
            <span className="text-gray-600">Click column headers to sort</span>
          </div>
        </div>
      </div>
    </div>
  );
}
