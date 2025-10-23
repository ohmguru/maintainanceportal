const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/tarun/Documents/GBMPortal/Game Data Sept 25 (1).xlsx');
const worksheet = workbook.Sheets['ME_Players'];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Row 0: Week numbers (1-14)
// Row 1: Week date ranges + "Blasters", "Vests", "Battery" etc.
// Row 2: Column types (blaster, vest, Players repeating) + "Total Returns", etc.
// Row 3+: Location data

const weekDateRanges = [
  '6/8-6/14', '6/15-6/21', '6/22-6/28', '6/29-7/5', '7/6-7/12', '7/13-7/20',
  '7/21-7/27', '7/27-8/2', '8/3-8/9', '8/10-8/16', '8/17-8/23', '8/24-8/30',
  '8/31-9/6', '9/7-9/13'
];

// Extract data for each location
const weeklyData = [];

// Start from row 3 (data rows)
for (let i = 3; i < data.length; i++) {
  const row = data[i];
  const locationName = row[0];

  if (!locationName || typeof locationName !== 'string') continue;

  // Each week has 3 columns: blaster, vest, players
  // Week 1: columns 1-3 (B-D)
  // Week 2: columns 4-6 (E-G)
  // etc.

  for (let weekNum = 0; weekNum < 14; weekNum++) {
    const baseCol = 1 + (weekNum * 3); // Starting column for this week
    const blastersReturned = row[baseCol] || 0;
    const vestsReturned = row[baseCol + 1] || 0;
    const players = row[baseCol + 2] || 0;

    // Get total columns (after week 14 data)
    // Total Blasters at column 43
    // Total Vests at column 44
    // Total Batteries at column 45
    // Batteries per Blaster at column 46

    const totalBlastersCol = 43;
    const totalVestsCol = 44;
    const totalBatteriesCol = 45;
    const batteriesPerBlasterCol = 46;

    const batteriesPerBlaster = row[batteriesPerBlasterCol] || 0;

    // Estimate batteries returned per week: 1.5 * batteriesPerBlaster * blastersReturned
    const batteriesReturned = Math.round(1.5 * batteriesPerBlaster * blastersReturned * 10) / 10;

    weeklyData.push({
      location: locationName,
      week: weekNum + 1,
      weekDateRange: weekDateRanges[weekNum],
      blastersReturned,
      vestsReturned,
      batteriesReturned,
      players
    });
  }
}

// Convert to CSV
const csvHeaders = 'location,week,weekDateRange,blastersReturned,vestsReturned,batteriesReturned,players\n';
const csvRows = weeklyData.map(row =>
  `"${row.location}",${row.week},"${row.weekDateRange}",${row.blastersReturned},${row.vestsReturned},${row.batteriesReturned},${row.players}`
).join('\n');

const csvContent = csvHeaders + csvRows;

// Write to CSV file
fs.writeFileSync('data/weeklyReturns.csv', csvContent);

console.log('CSV file created successfully!');
console.log(`Total rows: ${weeklyData.length}`);
console.log('\nSample data (first 5 rows):');
console.log(weeklyData.slice(0, 5));
