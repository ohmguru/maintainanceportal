'use client';

import { useState, useEffect } from 'react';

interface LocationInventory {
  location: string;
  weeklyFailureRate: number;
  actualInventory: number;
  allocationBase: number;
  excessBatteries: number;
}

export default function BatteryInventoryAdmin() {
  const [data, setData] = useState<LocationInventory[]>([]);
  const [totalReserve, setTotalReserve] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch('/api/battery-inventory');
      const result = await res.json();
      setData(result.locations || []);
      setTotalReserve(result.totalReserve1 || 0);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const handleInventoryChange = (location: string, newInventory: number) => {
    setData(prevData => {
      const updated = prevData.map(loc => {
        if (loc.location === location) {
          const excess = Math.max(0, newInventory - loc.allocationBase);
          return {
            ...loc,
            actualInventory: newInventory,
            excessBatteries: excess
          };
        }
        return loc;
      });

      // Recalculate total reserve
      const newTotal = updated.reduce((sum, loc) => sum + loc.excessBatteries, 0);
      setTotalReserve(newTotal);

      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        allocationBase: 90,
        totalReserve1: totalReserve,
        locations: data
      };

      const res = await fetch('/api/battery-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Battery inventory saved successfully!');
      } else {
        alert('Failed to save inventory');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Error saving inventory');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Battery Inventory Management</h1>
              <p className="text-gray-600 mt-2">Update actual battery counts per location</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Battery Reserve 1</div>
              <div className={`text-4xl font-bold ${
                totalReserve >= 250 ? 'text-green-600' :
                totalReserve >= 150 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {totalReserve}
              </div>
              <div className="text-xs text-gray-500">units over allocation</div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {saving ? 'Saving...' : 'Save to Netlify Blob Storage'}
            </button>
            <button
              onClick={loadData}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
            >
              Reload Data
            </button>
            <a
              href="/"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
            >
              View Dashboard
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-center">Weekly Failure Rate</th>
                  <th className="p-3 text-center">Allocation Base</th>
                  <th className="p-3 text-center">Actual Inventory</th>
                  <th className="p-3 text-center">Excess (Reserve)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((loc, idx) => (
                  <tr key={loc.location} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-medium">{loc.location}</td>
                    <td className="p-3 text-center text-gray-600">{loc.weeklyFailureRate}</td>
                    <td className="p-3 text-center text-gray-600">{loc.allocationBase}</td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        value={loc.actualInventory}
                        onChange={(e) => handleInventoryChange(loc.location, parseInt(e.target.value) || 0)}
                        className="w-24 text-center border-2 border-gray-300 rounded px-2 py-1 font-semibold"
                      />
                    </td>
                    <td className={`p-3 text-center font-bold ${
                      loc.excessBatteries > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {loc.excessBatteries > 0 ? '+' : ''}{loc.excessBatteries}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
