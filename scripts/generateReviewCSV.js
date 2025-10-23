#!/usr/bin/env node

/**
 * Generate CSV from weeklyReturns.csv for review before populating blob storage
 */

const fs = require('fs');

console.log('📋 Generating review CSV from weekly returns data...\n');

// Read the existing weeklyReturns.csv
const csvContent = fs.readFileSync('data/weeklyReturns.csv', 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());

console.log(`📊 Total records found: ${lines.length - 1} (excluding header)`);

// Parse the CSV
const records = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];

  if (values.length >= 7) {
    records.push({
      location: values[0]?.replace(/"/g, '') || '',
      week: parseInt(values[1] || '0'),
      weekDateRange: values[2]?.replace(/"/g, '') || '',
      blastersReturned: parseFloat(values[3] || '0'),
      vestsReturned: parseFloat(values[4] || '0'),
      batteriesReturned: parseFloat(values[5] || '0'),
      players: parseInt(values[6] || '0')
    });
  }
}

// Generate summary by location
console.log('\n📍 Locations found:');
const locations = [...new Set(records.map(r => r.location))].sort();
console.log(`   Total: ${locations.length} locations`);
locations.forEach((loc, idx) => {
  const locRecords = records.filter(r => r.location === loc);
  console.log(`   ${idx + 1}. ${loc} (${locRecords.length} weeks)`);
});

// Generate summary by week
console.log('\n📅 Weeks found:');
const weeks = [...new Set(records.map(r => r.week))].sort((a, b) => a - b);
console.log(`   Total: ${weeks.length} weeks`);
weeks.forEach(week => {
  const weekRecords = records.filter(r => r.week === week);
  const dateRange = weekRecords[0]?.weekDateRange || '';
  const totalBlasters = weekRecords.reduce((sum, r) => sum + r.blastersReturned, 0);
  const totalVests = weekRecords.reduce((sum, r) => sum + r.vestsReturned, 0);
  const totalBatteries = weekRecords.reduce((sum, r) => sum + r.batteriesReturned, 0);
  console.log(`   Week ${week} (${dateRange}): ${totalBlasters} blasters, ${totalVests} vests, ${Math.round(totalBatteries)} batteries`);
});

// Write to review file
const reviewContent = csvContent;
const reviewFilePath = 'data/weeklyReturns_REVIEW.csv';
fs.writeFileSync(reviewFilePath, reviewContent);

console.log(`\n✅ Review CSV saved to: ${reviewFilePath}`);
console.log('\n📝 Next steps:');
console.log('   1. Review the CSV file to ensure data is correct');
console.log('   2. Run node scripts/populateBlobWithWeeklyReturns.js to populate production blob storage');
console.log('   3. Or make edits via the admin panel at /admin');
