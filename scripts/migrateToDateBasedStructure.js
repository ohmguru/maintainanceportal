#!/usr/bin/env node

/**
 * Migrate weekly returns to date-based structure
 * Converts old week number format to ISO date format
 * Then populates Netlify Blob Storage with the new structure
 */

const fs = require('fs');
const https = require('https');

const PROD_URL = 'https://mechwarrior.netlify.app/api/weekly-returns';
const PROJECT_START_DATE = new Date('2025-06-08'); // June 8, 2025

console.log('🔄 Migrating to date-based structure\n');

// Generate week info map: week number -> { startDate, endDate }
const weekInfoMap = new Map();
let currentWeekStart = new Date(PROJECT_START_DATE);
let weekNum = 1;

while (weekNum <= 100) { // Generate enough weeks
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  weekInfoMap.set(weekNum, {
    startDate: new Date(currentWeekStart),
    endDate: new Date(weekEnd),
    weekStartDate: currentWeekStart.toISOString().split('T')[0], // YYYY-MM-DD
    weekEndDate: weekEnd.toISOString().split('T')[0]
  });

  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  weekNum++;
}

// Read the CSV
const csvContent = fs.readFileSync('data/weeklyReturns.csv', 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());

console.log(`📊 Total records: ${lines.length - 1} (excluding header)`);

// Parse CSV and convert to date-based structure
const returns = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];

  if (values.length >= 7) {
    const weekNum = parseInt(values[1] || '0');
    const weekInfo = weekInfoMap.get(weekNum);

    if (weekInfo) {
      returns.push({
        location: values[0]?.replace(/"/g, '') || '',
        weekStartDate: weekInfo.weekStartDate,
        weekEndDate: weekInfo.weekEndDate,
        blastersReturned: parseFloat(values[3] || '0'),
        vestsReturned: parseFloat(values[4] || '0'),
        batteriesReturned: Math.round(parseFloat(values[5] || '0')),
        players: parseInt(values[6] || '0')
      });
    }
  }
}

// Summary
const locations = [...new Set(returns.map(r => r.location))].sort();
const dateRanges = [...new Set(returns.map(r => `${r.weekStartDate} to ${r.weekEndDate}`))].sort();

console.log(`📍 Locations: ${locations.length}`);
console.log(`📅 Date ranges: ${dateRanges.length}`);
console.log(`📦 Total records to upload: ${returns.length}\n`);

// Show sample records
console.log('Sample records (first 3):');
returns.slice(0, 3).forEach(r => {
  console.log(`  ${r.location}: ${r.weekStartDate} to ${r.weekEndDate} - B:${r.blastersReturned} V:${r.vestsReturned} Bat:${r.batteriesReturned}`);
});
console.log('');

const payload = JSON.stringify({ returns });

// Make HTTPS POST request
const url = new URL(PROD_URL);
const options = {
  hostname: url.hostname,
  port: 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log(`📡 Sending date-based data to: ${PROD_URL}`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('\n✅ Successfully migrated to date-based structure!');
      console.log('Response:', data);
      console.log('\n🎉 Weekly returns data is now using date-based keys!');
      console.log('   Visit: https://mechwarrior.netlify.app/admin to verify');
    } else {
      console.error(`\n❌ Error: HTTP ${res.statusCode}`);
      console.error('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Error uploading to blob storage:', error.message);
  console.log('\n💡 Make sure the production site is deployed and accessible');
});

req.write(payload);
req.end();
