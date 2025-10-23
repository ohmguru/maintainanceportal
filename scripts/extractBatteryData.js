const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/tarun/Documents/GBMPortal/Gen1 Battery Inventory Levels.xlsx');
const worksheet = workbook.Sheets['Gen 1 Batteries'];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Row 4 has headers: [empty], 'Location', 'Actuals', 'Projected inventory Levels'
// Row 5+ has data: [weeklyFailure, location, actualInventory, projected...]

const batteryData = [];
const ALLOCATION_PER_LOCATION = 90;

// Start from row 5 (data rows)
for (let i = 5; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[1]) continue; // Skip if no location name

  const weeklyFailure = row[0] || 0;
  const location = row[1];
  const actualInventory = row[2] || 0;

  // Calculate excess over 90 battery allocation
  const excessBatteries = actualInventory - ALLOCATION_PER_LOCATION;

  batteryData.push({
    location,
    weeklyFailureRate: weeklyFailure,
    actualInventory,
    allocationBase: ALLOCATION_PER_LOCATION,
    excessBatteries: excessBatteries > 0 ? excessBatteries : 0
  });
}

// Calculate total Battery Reserve 1 (sum of all excess)
const totalReserve1 = batteryData.reduce((sum, loc) => sum + loc.excessBatteries, 0);

console.log('Battery Inventory Data:');
console.log('======================');
batteryData.forEach(loc => {
  console.log(`${loc.location}: ${loc.actualInventory} batteries (${loc.excessBatteries > 0 ? '+' + loc.excessBatteries : loc.excessBatteries} vs allocation)`);
});

console.log(`\n📊 Total Battery Reserve 1: ${totalReserve1} batteries`);
console.log(`   (Total excess across all locations above 90/location)`);

// Save to JSON
const outputData = {
  lastUpdated: new Date().toISOString(),
  allocationBase: ALLOCATION_PER_LOCATION,
  totalReserve1: totalReserve1,
  locations: batteryData
};

fs.writeFileSync('data/batteryInventory.json', JSON.stringify(outputData, null, 2));
console.log('\n✅ Data saved to data/batteryInventory.json');
