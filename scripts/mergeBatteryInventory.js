const fs = require('fs');

// Read both data sources
const batteryData = JSON.parse(fs.readFileSync('data/batteryInventory.json', 'utf8'));
const locationsFile = fs.readFileSync('data/locations.ts', 'utf8');

// Create a map of battery inventory by location name
const batteryMap = {};
batteryData.locations.forEach(loc => {
  // Normalize location names for matching
  const normalized = loc.location.toLowerCase().trim();
  batteryMap[normalized] = loc.actualInventory;
});

// Helper to find matching battery inventory
function findBatteryInventory(locationName) {
  // Try exact match first
  const name = locationName.toLowerCase().trim();

  // Try removing "ME " prefix
  const withoutME = name.replace(/^me\s+/i, '');

  // Check various formats
  if (batteryMap[name]) return batteryMap[name];
  if (batteryMap[withoutME]) return batteryMap[withoutME];

  // Try partial matches
  for (const key in batteryMap) {
    if (name.includes(key) || key.includes(withoutME)) {
      return batteryMap[key];
    }
  }

  return 90; // Default to allocation base if not found
}

console.log('Location Name Mapping:');
console.log('=====================');

// Extract location names from the TypeScript file
const locationMatches = locationsFile.match(/name: "([^"]+)"/g);
if (locationMatches) {
  locationMatches.forEach(match => {
    const locationName = match.match(/"([^"]+)"/)[1];
    const inventory = findBatteryInventory(locationName);
    console.log(`${locationName} -> ${inventory} batteries`);
  });
}

console.log('\nBattery inventory mapping complete!');
console.log('You can now manually add batteryInventory field to locations.ts');
