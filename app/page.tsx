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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MainEvent Location Reliability Leaderboard
          </h1>
          <p className="text-gray-600">
            Track performance rankings for Blaster, Vest, and Battery reliability
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Location</th>
                  <th
                    className="py-4 px-4 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('composite')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Overall Rank</span>
                      <span className="text-lg">{getSortIcon('composite')}</span>
                    </div>
                    <div className="text-xs font-normal mt-1 opacity-90">
                      Composite
                    </div>
                  </th>
                  <th
                    className="py-4 px-4 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('blaster')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Blaster Rank</span>
                      <span className="text-lg">{getSortIcon('blaster')}</span>
                    </div>
                    <div className="text-xs font-normal mt-1 opacity-90">
                      {locations.find(l => l.name === sortedLocations[0].name)?.blaster.toFixed(1)}
                    </div>
                  </th>
                  <th
                    className="py-4 px-4 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('vest')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Vest Rank</span>
                      <span className="text-lg">{getSortIcon('vest')}</span>
                    </div>
                  </th>
                  <th
                    className="py-4 px-4 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                    onClick={() => handleSort('batteries')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Battery Rank</span>
                      <span className="text-lg">{getSortIcon('batteries')}</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center font-semibold">
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
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {location.name}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadgeColor(location.compositeRank)}`}>
                        {location.compositeRank}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {location.compositePercentile}%
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold ${getRankBadgeColor(location.blasterRank)}`}>
                        {location.blasterRank}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {location.blaster.toFixed(1)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold ${getRankBadgeColor(location.vestRank)}`}>
                        {location.vestRank}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {location.vest.toFixed(1)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold ${getRankBadgeColor(location.batteriesRank)}`}>
                        {location.batteriesRank}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {location.batteries.toFixed(1)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500">B:</span>
                          <span className="font-medium">{location.blasterPercentile}%</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500">V:</span>
                          <span className="font-medium">{location.vestPercentile}%</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500">Bt:</span>
                          <span className="font-medium">{location.batteriesPercentile}%</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full ${getRankBadgeColor(1)}`}></span>
              <span>1st Place</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full ${getRankBadgeColor(2)}`}></span>
              <span>2nd Place</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full ${getRankBadgeColor(3)}`}></span>
              <span>3rd Place</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full ${getRankBadgeColor(5)}`}></span>
              <span>Top 5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full ${getRankBadgeColor(10)}`}></span>
              <span>Top 10</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full ${getRankBadgeColor(15)}`}></span>
              <span>Top 15</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="mb-2"><strong>How to use:</strong> Click on any column header to sort by that ranking metric.</p>
            <p>Percentiles show relative performance - higher is better.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
