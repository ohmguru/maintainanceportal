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

export default function ByWeek() {
  const [data, setData] = useState<WeeklyReturn[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  useEffect(() => {
    // Load data from CSV
    fetch('/data/weeklyReturns.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.split('\n');
        const rows = lines.slice(1).filter(line => line.trim());

        const parsed: WeeklyReturn[] = rows.map(line => {
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
        if (parsed.length > 0) {
          setSelectedLocation(parsed[0].location);
        }
      });
  }, []);

  const locations = Array.from(new Set(data.map(d => d.location))).sort();
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);

  const filteredData = selectedWeek > 0
    ? data.filter(d => d.week === selectedWeek)
    : selectedLocation
    ? data.filter(d => d.location === selectedLocation)
    : data;

  const locationData = selectedLocation
    ? data.filter(d => d.location === selectedLocation).sort((a, b) => a.week - b.week)
    : [];

  const weekData = selectedWeek > 0
    ? data.filter(d => d.week === selectedWeek).sort((a, b) => a.location.localeCompare(b.location))
    : [];

  const totals = locationData.reduce(
    (acc, row) => ({
      blasters: acc.blasters + row.blastersReturned,
      vests: acc.vests + row.vestsReturned,
      batteries: acc.batteries + row.batteriesReturned,
      players: acc.players + row.players
    }),
    { blasters: 0, vests: 0, batteries: 0, players: 0 }
  );

  const getReturnColor = (value: number, max: number) => {
    const ratio = max > 0 ? value / max : 0;
    if (ratio > 0.7) return 'text-red-400';
    if (ratio > 0.4) return 'text-orange-400';
    if (ratio > 0.2) return 'text-yellow-400';
    return 'text-green-400';
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
        <header className="text-center mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 tracking-wider uppercase" style={{
            textShadow: '0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(236,72,153,0.3)',
            fontFamily: 'monospace'
          }}>
            ⚡ Weekly Fleet Returns Dashboard ⚡
          </h1>
          <p className="text-cyan-400 text-sm mt-2">Track equipment returns by location and week</p>
        </header>

        <div className="flex gap-4 justify-center mb-4">
          <div>
            <label className="text-cyan-400 text-xs font-bold block mb-1">LOCATION</label>
            <select
              value={selectedLocation}
              onChange={(e) => { setSelectedLocation(e.target.value); setSelectedWeek(0); }}
              className="bg-black/60 border-2 border-pink-500/50 text-cyan-300 rounded px-4 py-2 font-mono"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-cyan-400 text-xs font-bold block mb-1">VIEW BY WEEK</label>
            <select
              value={selectedWeek}
              onChange={(e) => { setSelectedWeek(parseInt(e.target.value)); setSelectedLocation(''); }}
              className="bg-black/60 border-2 border-cyan-500/50 text-cyan-300 rounded px-4 py-2 font-mono"
            >
              <option value={0}>All Weeks</option>
              {weeks.map(week => {
                const dateRange = data.find(d => d.week === week)?.weekDateRange || '';
                return (
                  <option key={week} value={week}>Week {week} ({dateRange})</option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-4 relative z-10">
        {/* Location Weekly View */}
        {selectedLocation && selectedWeek === 0 && (
          <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg border-2 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-pink-500/30">
              <h2 className="text-xl font-bold text-pink-400 font-mono">{selectedLocation}</h2>
              <div className="grid grid-cols-4 gap-4 mt-2 text-xs">
                <div>
                  <div className="text-cyan-400">Total Blasters</div>
                  <div className="text-2xl font-bold text-pink-300">{totals.blasters}</div>
                </div>
                <div>
                  <div className="text-cyan-400">Total Vests</div>
                  <div className="text-2xl font-bold text-pink-300">{totals.vests}</div>
                </div>
                <div>
                  <div className="text-cyan-400">Total Batteries</div>
                  <div className="text-2xl font-bold text-pink-300">{totals.batteries.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-cyan-400">Total Players</div>
                  <div className="text-2xl font-bold text-cyan-300">{totals.players.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-xs font-mono">
                <thead className="sticky top-0 bg-purple-800/80 text-cyan-400">
                  <tr>
                    <th className="p-2 text-left">Week</th>
                    <th className="p-2 text-center">Date Range</th>
                    <th className="p-2 text-center">Blasters</th>
                    <th className="p-2 text-center">Vests</th>
                    <th className="p-2 text-center">Batteries</th>
                    <th className="p-2 text-center">Players</th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((row, idx) => {
                    const maxBlasters = Math.max(...locationData.map(d => d.blastersReturned));
                    const maxVests = Math.max(...locationData.map(d => d.vestsReturned));
                    const maxBatteries = Math.max(...locationData.map(d => d.batteriesReturned));

                    return (
                      <tr key={row.week} className={`border-b border-purple-500/20 ${idx % 2 === 0 ? 'bg-black/40' : 'bg-purple-900/20'}`}>
                        <td className="p-2 text-cyan-300 font-bold">{row.week}</td>
                        <td className="p-2 text-center text-gray-400">{row.weekDateRange}</td>
                        <td className={`p-2 text-center font-bold ${getReturnColor(row.blastersReturned, maxBlasters)}`}>
                          {row.blastersReturned}
                        </td>
                        <td className={`p-2 text-center font-bold ${getReturnColor(row.vestsReturned, maxVests)}`}>
                          {row.vestsReturned}
                        </td>
                        <td className={`p-2 text-center font-bold ${getReturnColor(row.batteriesReturned, maxBatteries)}`}>
                          {row.batteriesReturned.toFixed(1)}
                        </td>
                        <td className="p-2 text-center text-cyan-300">{row.players.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Week View (All Locations) */}
        {selectedWeek > 0 && (
          <div className="flex-1 bg-black/60 backdrop-blur-sm rounded-lg border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.3)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-cyan-500/30">
              <h2 className="text-xl font-bold text-cyan-400 font-mono">
                Week {selectedWeek} - {weekData[0]?.weekDateRange}
              </h2>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-xs font-mono">
                <thead className="sticky top-0 bg-purple-800/80 text-cyan-400">
                  <tr>
                    <th className="p-2 text-left">Location</th>
                    <th className="p-2 text-center">Blasters</th>
                    <th className="p-2 text-center">Vests</th>
                    <th className="p-2 text-center">Batteries</th>
                    <th className="p-2 text-center">Players</th>
                  </tr>
                </thead>
                <tbody>
                  {weekData.map((row, idx) => {
                    const maxBlasters = Math.max(...weekData.map(d => d.blastersReturned));
                    const maxVests = Math.max(...weekData.map(d => d.vestsReturned));
                    const maxBatteries = Math.max(...weekData.map(d => d.batteriesReturned));

                    return (
                      <tr key={row.location} className={`border-b border-purple-500/20 ${idx % 2 === 0 ? 'bg-black/40' : 'bg-purple-900/20'}`}>
                        <td className="p-2 text-cyan-300 font-bold">{row.location}</td>
                        <td className={`p-2 text-center font-bold ${getReturnColor(row.blastersReturned, maxBlasters)}`}>
                          {row.blastersReturned}
                        </td>
                        <td className={`p-2 text-center font-bold ${getReturnColor(row.vestsReturned, maxVests)}`}>
                          {row.vestsReturned}
                        </td>
                        <td className={`p-2 text-center font-bold ${getReturnColor(row.batteriesReturned, maxBatteries)}`}>
                          {row.batteriesReturned.toFixed(1)}
                        </td>
                        <td className="p-2 text-center text-cyan-300">{row.players.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="flex-none mt-2 bg-black/60 backdrop-blur-sm rounded-lg border border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] p-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex gap-4 items-center">
            <span className="text-cyan-400 font-bold">RETURN LEVELS:</span>
            <span className="text-green-400">● Low</span>
            <span className="text-yellow-400">● Moderate</span>
            <span className="text-orange-400">● High</span>
            <span className="text-red-400">● Very High</span>
          </div>
          <span className="text-pink-400">GelBlaster MechWarrior Fleet Analytics</span>
        </div>
      </div>
    </div>
  );
}
