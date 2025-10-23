#!/usr/bin/env node

/**
 * Populate Netlify Blob Storage with weekly returns data
 * This script calls the production API to populate blob storage
 */

const fs = require('fs');
const https = require('https');

const PROD_URL = 'https://mechwarrior.netlify.app/api/weekly-returns';

console.log('🚀 Populating Netlify Blob Storage with weekly returns data\n');

// Read the cleaned CSV
const csvContent = fs.readFileSync('data/weeklyReturns.csv', 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim());

console.log(`📊 Total records: ${lines.length - 1} (excluding header)`);

// Parse CSV
const returns = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];

  if (values.length >= 7) {
    returns.push({
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

// Summary
const locations = [...new Set(returns.map(r => r.location))].sort();
const weeks = [...new Set(returns.map(r => r.week))].sort((a, b) => a - b);

console.log(`📍 Locations: ${locations.length}`);
console.log(`📅 Weeks: ${weeks.length}`);
console.log(`📦 Total records to upload: ${returns.length}\n`);

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

console.log(`📡 Sending data to: ${PROD_URL}`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('\n✅ Successfully populated blob storage!');
      console.log('Response:', data);
      console.log('\n🎉 Weekly returns data is now live in production!');
      console.log('   Visit: https://mechwarrior.netlify.app/admin to manage the data');
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
