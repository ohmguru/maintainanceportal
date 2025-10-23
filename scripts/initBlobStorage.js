#!/usr/bin/env node

/**
 * Initialize Netlify Blob Storage with battery inventory data from locations.ts
 */

const fs = require('fs');

// Read locations.ts and extract battery inventory data
const locationsFile = fs.readFileSync('data/locations.ts', 'utf8');

// Extract location data using regex
const locationMatches = locationsFile.matchAll(/{\s*name:\s*"([^"]+)"[^}]*batteryInventory:\s*(\d+)/g);

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

console.log('🚀 Initializing Netlify Blob Storage with battery inventory data\n');
console.log(`📦 Total Locations: ${locations.length}`);
console.log(`🔋 Primary Reserve: ${totalReserve1}`);
console.log(`⚡ Final Emergency Reserve: 142`);
console.log(`📊 Total Reserve: ${totalReserve1 + 142}\n`);

// Make API call to save to blob storage
const { execSync } = require('child_process');

try {
  // Use curl to POST to the API
  const command = `curl -X POST http://localhost:3000/api/battery-inventory -H "Content-Type: application/json" -d '${JSON.stringify(payload).replace(/'/g, "'\\''")}'`;

  const result = execSync(command, { encoding: 'utf8' });
  console.log('✅ Successfully initialized blob storage!');
  console.log('Response:', result);

  console.log('\n📋 Locations saved:');
  locations.slice(0, 5).forEach(loc => {
    console.log(`  - ${loc.location}: ${loc.actualInventory} batteries (${loc.excessBatteries > 0 ? '+' : ''}${loc.excessBatteries} excess)`);
  });
  console.log(`  ... and ${locations.length - 5} more locations`);

} catch (error) {
  console.error('❌ Error initializing blob storage:', error.message);
  console.log('\n💡 Make sure the dev server is running: npm run dev');
  process.exit(1);
}
