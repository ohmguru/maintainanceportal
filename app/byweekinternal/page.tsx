'use client';

import { useState, useEffect } from 'react';

interface WeeklyReturn {
  location: string;
  week: number;
  weekDateRange: string;
  blastersReturned: number;
  vestsReturned: number;
  batteriesReturned: number;
  players: number;
}

export default function ByWeekInternal() {
  const [data, setData] = useState<WeeklyReturn[]>([]);
  const [editingCell, setEditingCell] = useState<{ location: string; week: number; field: string } | null>(null);
  const [filterLocation, setFilterLocation] = useState<string>('');

  useEffect(() => {
    // Load data from CSV
    fetch('/data/weeklyReturns.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).filter(line => line.trim());

        const parsed: WeeklyReturn[] = rows.map(line => {
          // Handle quoted values
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
          return {
            location: values[0]?.replace(/"/g, '') || '',
            week: parseInt(values[1] || '0'),
            weekDateRange: values[2]?.replace(/"/g, '') || '',
            blastersReturned: parseFloat(values[3] || '0'),
            vestsReturned: parseFloat(values[4] || '0'),
            batteriesReturned: parseFloat(values[5] || '0'),
            players: parseInt(values[6] || '0')
          };
        });

        setData(parsed);
      });
  }, []);

  const locations = Array.from(new Set(data.map(d => d.location))).sort();
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);

  const handleCellChange = (location: string, week: number, field: keyof WeeklyReturn, value: string) => {
    setData(prevData =>
      prevData.map(row => {
        if (row.location === location && row.week === week) {
          return { ...row, [field]: field === 'weekDateRange' ? value : parseFloat(value) || 0 };
        }
        return row;
      })
    );
  };

  const exportCSV = () => {
    const headers = 'location,week,weekDateRange,blastersReturned,vestsReturned,batteriesReturned,players\n';
    const rows = data.map(row =>
      `"${row.location}",${row.week},"${row.weekDateRange}",${row.blastersReturned},${row.vestsReturned},${row.batteriesReturned},${row.players}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weeklyReturns.csv';
    a.click();
  };

  const filteredData = filterLocation
    ? data.filter(d => d.location === filterLocation)
    : data;

  const dataByLocation = filteredData.reduce((acc, row) => {
    if (!acc[row.location]) acc[row.location] = [];
    acc[row.location].push(row);
    return acc;
  }, {} as Record<string, WeeklyReturn[]>);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Weekly Returns Data Entry</h1>
            <div className="flex gap-4">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Export CSV
              </button>
              <a
                href="/byweek"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                View Dashboard
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left sticky left-0 bg-gray-200">Location</th>
                  <th className="p-2 text-center">Week</th>
                  <th className="p-2 text-center">Date Range</th>
                  <th className="p-2 text-center">Blasters</th>
                  <th className="p-2 text-center">Vests</th>
                  <th className="p-2 text-center">Batteries</th>
                  <th className="p-2 text-center">Players</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dataByLocation).map(([location, rows]) =>
                  rows.sort((a, b) => a.week - b.week).map((row, idx) => (
                    <tr key={`${location}-${row.week}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 font-medium sticky left-0 bg-inherit">{row.location}</td>
                      <td className="p-2 text-center">{row.week}</td>
                      <td className="p-2 text-center">
                        <input
                          type="text"
                          value={row.weekDateRange}
                          onChange={(e) => handleCellChange(row.location, row.week, 'weekDateRange', e.target.value)}
                          className="w-24 text-center border border-gray-300 rounded px-1"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          value={row.blastersReturned}
                          onChange={(e) => handleCellChange(row.location, row.week, 'blastersReturned', e.target.value)}
                          className="w-16 text-center border border-gray-300 rounded px-1"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          value={row.vestsReturned}
                          onChange={(e) => handleCellChange(row.location, row.week, 'vestsReturned', e.target.value)}
                          className="w-16 text-center border border-gray-300 rounded px-1"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={row.batteriesReturned}
                          onChange={(e) => handleCellChange(row.location, row.week, 'batteriesReturned', e.target.value)}
                          className="w-16 text-center border border-gray-300 rounded px-1"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          value={row.players}
                          onChange={(e) => handleCellChange(row.location, row.week, 'players', e.target.value)}
                          className="w-20 text-center border border-gray-300 rounded px-1"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
