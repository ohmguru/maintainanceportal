#!/usr/bin/env node

/**
 * Push battery inventory data from locations.ts to production blob storage
 */

const fs = require('fs');
const https = require('https');

// Read locations.ts and extract battery inventory data
const locationsFile = fs.readFileSync('data/locations.ts', 'utf8');

// Extract location data using regex - need to match the entire location object
const locationMatches = Array.from(locationsFile.matchAll(/{\s*name:\s*"([^"]+)"[^}]*batteryInventory:\s*(\d+)/g));

const locations = [];
const allocationBase = 90;

for (const match of locationMatches) {
  const name = match[1];
  const inventory = parseInt(match[2]);
  const excess = Math.max(0, inventory - allocationBase);

  locations.push({
    location: name,
    actualInventory: inventory,
    allocationBase: allocationBase,
    excessBatteries: excess,
    weeklyFailureRate: 0
  });
}

const totalReserve1 = locations.reduce((sum, loc) => sum + loc.excessBatteries, 0);

const payload = {
  allocationBase: 90,
  totalReserve1: totalReserve1,
  finalEmergencyReserve: 142,
  locations: locations,
  lastUpdated: new Date().toISOString()
};

console.log('🚀 Pushing battery inventory data to production blob storage\n');
console.log(`📦 Total Locations: ${locations.length}`);
console.log(`🔋 Primary Reserve: ${totalReserve1}`);
console.log(`⚡ Final Emergency Reserve: 142`);
console.log(`📊 Total Reserve: ${totalReserve1 + 142}\n`);

// Display first 5 locations for verification
console.log('📋 Sample of locations to be saved:');
locations.slice(0, 5).forEach(loc => {
  console.log(`  - ${loc.location}: ${loc.actualInventory} batteries (${loc.excessBatteries > 0 ? '+' : ''}${loc.excessBatteries} excess)`);
});
console.log(`  ... and ${locations.length - 5} more locations\n`);

// Make API call to production site
const postData = JSON.stringify(payload);

const options = {
  hostname: 'mechwarrior.pro',
  port: 443,
  path: '/api/battery-inventory',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Successfully pushed data to production blob storage!');
      console.log('Response:', data);
    } else {
      console.error(`❌ Error: Received status code ${res.statusCode}`);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error pushing to production:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();
