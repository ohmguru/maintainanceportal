'use client';

import { useState, useEffect } from 'react';
import { locations } from '@/data/locations';

interface WeekData {
  blastersReturned: number;
  vestsReturned: number;
  batteriesReturned: number;
}

interface LocationData {
  name: string;
  inventory: number;
  weeks: Record<number, WeekData>;
}

export default function UnifiedAdmin() {
  const [data, setData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allocationBase, setAllocationBase] = useState(90);
  const [finalEmergencyReserve, setFinalEmergencyReserve] = useState(142);

  // Generate weeks from start date (June 8, 2024) through end of 2025
  const startDate = new Date('2024-06-08');
  const endDate = new Date('2025-12-31');
  const weeks: number[] = [];
  const weekRanges: string[] = [];

  let currentWeekStart = new Date(startDate);
  let weekNumber = 1;

  while (currentWeekStart <= endDate) {
    weeks.push(weekNumber);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const startMonth = currentWeekStart.getMonth() + 1;
    const startDay = currentWeekStart.getDate();
    const endMonth = weekEnd.getMonth() + 1;
    const endDay = weekEnd.getDate();

    weekRanges.push(`${startMonth}/${startDay}-${endMonth}/${endDay}`);

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekNumber++;
  }

  // Calculate current week based on today's date
  const getCurrentWeek = () => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.ceil(diffDays / 7);
    return Math.min(weekNum, weeks.length);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      // Auto-scroll to current week after data loads
      const currentWeek = getCurrentWeek();
      const currentWeekHeader = document.getElementById(`week-${currentWeek}`);
      if (currentWeekHeader) {
        currentWeekHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  }, [loading, data]);

  const loadData = async () => {
    try {
      // Load battery inventory from blob storage
      const inventoryRes = await fetch('/api/battery-inventory');
      const inventoryData = await inventoryRes.json();

      setAllocationBase(inventoryData.allocationBase || 90);
      setFinalEmergencyReserve(inventoryData.finalEmergencyReserve || 142);

      // Load weekly returns from blob storage
      const weeklyRes = await fetch('/api/weekly-returns');
      const weeklyData = await weeklyRes.json();
      const returns = weeklyData.returns || [];

      const weeklyReturns: Record<string, Record<number, WeekData>> = {};

      returns.forEach((r: any) => {
        if (!weeklyReturns[r.location]) {
          weeklyReturns[r.location] = {};
        }
        weeklyReturns[r.location][r.week] = {
          blastersReturned: r.blastersReturned || 0,
          vestsReturned: r.vestsReturned || 0,
          batteriesReturned: r.batteriesReturned || 0
        };
      });

      // Combine data from locations.ts with weekly returns
      const combinedData: LocationData[] = locations.map(loc => {
        // Try to find inventory from blob storage first, fallback to locations.ts
        const blobLocation = inventoryData.locations?.find((l: any) =>
          l.location === loc.name ||
          l.location.toLowerCase().includes(loc.name.toLowerCase().replace('ME ', ''))
        );

        return {
          name: loc.name,
          inventory: blobLocation?.actualInventory || loc.batteryInventory,
          weeks: weeklyReturns[loc.name] || {}
        };
      });

      setData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handleInventoryChange = (locationName: string, newInventory: number) => {
    setData(prevData =>
      prevData.map(loc =>
        loc.name === locationName ? { ...loc, inventory: newInventory } : loc
      )
    );
  };

  const handleWeekDataChange = (
    locationName: string,
    week: number,
    field: keyof WeekData,
    value: number
  ) => {
    setData(prevData =>
      prevData.map(loc => {
        if (loc.name === locationName) {
          const weekData = loc.weeks[week] || { blastersReturned: 0, vestsReturned: 0, batteriesReturned: 0 };
          return {
            ...loc,
            weeks: {
              ...loc.weeks,
              [week]: { ...weekData, [field]: value }
            }
          };
        }
        return loc;
      })
    );
  };

  const calculateReserve = () => {
    return data.reduce((sum, loc) => sum + Math.max(0, loc.inventory - allocationBase), 0);
  };

  const handleSave = async (silent = false) => {
    setSaving(true);
    try {
      const reserve = calculateReserve();

      // Save battery inventory to blob
      const inventoryPayload = {
        allocationBase,
        totalReserve1: reserve,
        finalEmergencyReserve,
        locations: data.map(loc => ({
          location: loc.name,
          actualInventory: loc.inventory,
          allocationBase,
          excessBatteries: Math.max(0, loc.inventory - allocationBase),
          weeklyFailureRate: 0
        }))
      };

      await fetch('/api/battery-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryPayload)
      });

      // Save weekly returns to blob
      const weeklyReturns = data.flatMap(loc =>
        weeks.map(week => {
          const weekData = loc.weeks[week] || { blastersReturned: 0, vestsReturned: 0, batteriesReturned: 0 };
          const weekDateRange = getWeekDateRange(week);
          return {
            location: loc.name,
            week: week,
            weekDateRange: weekDateRange,
            blastersReturned: weekData.blastersReturned,
            vestsReturned: weekData.vestsReturned,
            batteriesReturned: weekData.batteriesReturned,
            players: 0
          };
        })
      );

      await fetch('/api/weekly-returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returns: weeklyReturns })
      });

      if (!silent) {
        alert('✅ All data saved to Netlify Blob Storage!');
      }
    } catch (error) {
      console.error('Save failed:', error);
      if (!silent) {
        alert('❌ Error saving data');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, locationName: string, week?: number, field?: keyof WeekData) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(true); // Silent save

      // Move to next row
      const currentInput = e.target as HTMLInputElement;
      const allInputs = Array.from(document.querySelectorAll('input[type="number"]'));
      const currentIndex = allInputs.indexOf(currentInput);

      if (currentIndex >= 0 && currentIndex < allInputs.length - 1) {
        const nextInput = allInputs[currentIndex + 1] as HTMLInputElement;
        nextInput?.focus();
        nextInput?.select();
      }
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const getWeekDateRange = (week: number): string => {
    return weekRanges[week - 1] || '';
  };

  const currentWeek = getCurrentWeek();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-2xl text-cyan-300 font-mono">⚙️ Loading admin data...</div>
      </div>
    );
  }

  const totalReserve = calculateReserve();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-pink-900 p-4">
      <div className="max-w-[98%] mx-auto">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.3)] p-6 mb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 tracking-wider uppercase font-mono">
                ⚙️ Admin Control Center
              </h1>
              <p className="text-cyan-400 mt-2 font-mono text-sm">Update inventory and weekly returns in one place</p>
            </div>

            <div className="flex gap-4">
              <div className="text-center p-4 bg-purple-500/20 border border-purple-400/50 rounded-lg">
                <div className="text-xs text-purple-300 mb-2 font-mono">ALLOCATION BASE</div>
                <input
                  type="number"
                  value={allocationBase}
                  onChange={(e) => setAllocationBase(parseInt(e.target.value) || 90)}
                  className="text-2xl font-bold text-center w-20 bg-black/80 border-2 border-purple-400/50 rounded px-2 py-1 text-purple-300 font-mono"
                />
              </div>
              <div className="text-center p-4 bg-cyan-500/20 border border-cyan-400/50 rounded-lg">
                <div className="text-xs text-cyan-300 mb-2 font-mono">PRIMARY RESERVE</div>
                <div className="text-2xl font-bold text-cyan-300 font-mono">{totalReserve}</div>
              </div>
              <div className="text-center p-4 bg-pink-500/20 border border-pink-400/50 rounded-lg">
                <div className="text-xs text-pink-300 mb-2 font-mono">FINAL RESERVE</div>
                <input
                  type="number"
                  value={finalEmergencyReserve}
                  onChange={(e) => setFinalEmergencyReserve(parseInt(e.target.value) || 142)}
                  className="text-2xl font-bold text-center w-20 bg-black/80 border-2 border-pink-400/50 rounded px-2 py-1 text-pink-300 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 font-mono font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            >
              {saving ? '💾 SAVING...' : '💾 SAVE ALL DATA'}
            </button>
            <button
              onClick={loadData}
              className="bg-purple-600/80 border border-purple-400/50 text-purple-300 px-6 py-3 rounded-lg hover:bg-purple-500/80 font-mono font-bold"
            >
              🔄 RELOAD
            </button>
            <a
              href="/"
              className="bg-pink-600/80 border border-pink-400/50 text-pink-300 px-6 py-3 rounded-lg hover:bg-pink-500/80 font-mono font-bold"
            >
              🏠 DASHBOARD
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse font-mono">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left bg-gradient-to-r from-purple-600 to-purple-700 text-cyan-300 border border-cyan-400/50 sticky left-0 z-20">
                    LOCATION
                  </th>
                  <th className="p-2 text-center bg-gradient-to-r from-green-600 to-green-700 text-white border border-green-400/50">
                    INVENTORY
                  </th>
                  {weeks.map(week => {
                    const isCurrentWeek = week === currentWeek;
                    return (
                      <th
                        key={week}
                        id={`week-${week}`}
                        colSpan={3}
                        className={`p-2 text-center border ${
                          isCurrentWeek
                            ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                            : 'bg-gradient-to-r from-pink-600 to-pink-700 text-white border-pink-400/50'
                        }`}
                      >
                        {isCurrentWeek && <div className="text-[8px] text-cyan-200 font-bold mb-1">← CURRENT WEEK</div>}
                        <div className="text-sm font-bold">{getWeekDateRange(week)}</div>
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  <th className="p-1 bg-purple-800/80 text-purple-300 border border-purple-400/30 sticky left-0 z-20"></th>
                  <th className="p-1 bg-green-800/80 text-green-300 border border-green-400/30"></th>
                  {weeks.map(week => {
                    const isCurrentWeek = week === currentWeek;
                    const bgClass = isCurrentWeek ? 'bg-cyan-800/80 text-cyan-300 border-cyan-400/30' : 'bg-pink-800/80 text-pink-300 border-pink-400/30';
                    return (
                      <>
                        <th key={`${week}-b`} className={`p-1 text-center ${bgClass} text-[10px]`}>
                          BLST
                        </th>
                        <th key={`${week}-v`} className={`p-1 text-center ${bgClass} text-[10px]`}>
                          VEST
                        </th>
                        <th key={`${week}-bat`} className={`p-1 text-center ${bgClass} text-[10px]`}>
                          BATT
                        </th>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data.map((loc, idx) => (
                  <tr key={loc.name} className={idx % 2 === 0 ? 'bg-black/40' : 'bg-purple-900/20'}>
                    <td className="p-2 font-bold text-cyan-300 border border-purple-500/20 sticky left-0 z-10 bg-inherit">
                      {loc.name}
                    </td>
                    <td className="p-1 text-center border border-green-500/20">
                      <input
                        type="number"
                        value={loc.inventory}
                        onChange={(e) => handleInventoryChange(loc.name, parseInt(e.target.value) || 0)}
                        onKeyDown={(e) => handleKeyDown(e, loc.name)}
                        onFocus={handleFocus}
                        className="w-16 text-center bg-black/60 border border-green-400/50 rounded px-1 py-1 text-green-300 font-bold focus:border-green-400 focus:outline-none"
                      />
                    </td>
                    {weeks.map(week => {
                      const weekData = loc.weeks[week] || { blastersReturned: 0, vestsReturned: 0, batteriesReturned: 0 };
                      return (
                        <>
                          <td key={`${loc.name}-${week}-b`} className="p-1 text-center border border-pink-500/20">
                            <input
                              type="number"
                              value={weekData.blastersReturned}
                              onChange={(e) => handleWeekDataChange(loc.name, week, 'blastersReturned', parseFloat(e.target.value) || 0)}
                              onKeyDown={(e) => handleKeyDown(e, loc.name, week, 'blastersReturned')}
                              onFocus={handleFocus}
                              className="w-12 text-center bg-black/60 border border-pink-400/30 rounded px-1 text-pink-300 text-xs focus:border-pink-400 focus:outline-none"
                            />
                          </td>
                          <td key={`${loc.name}-${week}-v`} className="p-1 text-center border border-pink-500/20">
                            <input
                              type="number"
                              value={weekData.vestsReturned}
                              onChange={(e) => handleWeekDataChange(loc.name, week, 'vestsReturned', parseFloat(e.target.value) || 0)}
                              onKeyDown={(e) => handleKeyDown(e, loc.name, week, 'vestsReturned')}
                              onFocus={handleFocus}
                              className="w-12 text-center bg-black/60 border border-pink-400/30 rounded px-1 text-pink-300 text-xs focus:border-pink-400 focus:outline-none"
                            />
                          </td>
                          <td key={`${loc.name}-${week}-bat`} className="p-1 text-center border border-pink-500/20">
                            <input
                              type="number"
                              step="0.1"
                              value={weekData.batteriesReturned}
                              onChange={(e) => handleWeekDataChange(loc.name, week, 'batteriesReturned', parseFloat(e.target.value) || 0)}
                              onKeyDown={(e) => handleKeyDown(e, loc.name, week, 'batteriesReturned')}
                              onFocus={handleFocus}
                              className="w-12 text-center bg-black/60 border border-pink-400/30 rounded px-1 text-pink-300 text-xs focus:border-pink-400 focus:outline-none"
                            />
                          </td>
                        </>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-lg">
            <p className="text-yellow-300 font-mono text-sm">
              💡 <strong>NOTE:</strong> Clicking "SAVE ALL DATA" will:
              <br />1. Save battery inventory to Netlify Blob Storage (live immediately)
              <br />2. Download a weeklyReturns.csv file that you need to replace in data/weeklyReturns.csv and commit/push
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
