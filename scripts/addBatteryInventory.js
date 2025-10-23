const fs = require('fs');

// Battery inventory mapping from previous script
const inventoryMap = {
  "ME Gilbert, AZ": 87,
  "ME San Antonio North, TX": 97,
  "ME Olathe, KS": 108,
  "ME Tulsa OK": 112,
  "ME Avondale, AZ": 88,
  "ME Grand Prairie, TX": 104,
  "ME Frisco, TX": 90,
  "ME Tempe, AZ": 85,
  "ME Humble, TX": 91,
  "ME Independance, MO": 117, // Updated from battery data
  "ME Knoxville, TN": 89,
  "ME Shenandoah, TX": 90,
  "ME Austin, TX": 103,
  "ME Atlanta, GA": 90,
  "ME OKC, OK": 90,
  "ME Louisville KT": 105,
  "ME Hoffman, IL": 96, // Updated
  "ME Wesley Chappel, FL": 134, // Updated
  "ME Norman OK": 95,
  "ME Montclair, CA": 112,
  "ME Orlando, FL": 139,
  "ME Taylor, MI": 104,
  "ME San Antonio West, TX": 77, // Updated (SAW)
  "ME Beaumont, TX": 80,
  "ME Katy, TX": 90
};

// Read the TypeScript file
let content = fs.readFileSync('data/locations.ts', 'utf8');

// Add batteryInventory to each location object
Object.entries(inventoryMap).forEach(([name, inventory]) => {
  // Find the pattern for this location and add batteryInventory before the closing brace
  const pattern = new RegExp(`(name: "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",[\\s\\S]*?compositeRank: \\d+)\\s*\\}`, 'g');

  content = content.replace(pattern, `$1,\n    batteryInventory: ${inventory}\n  }`);
});

// Write back
fs.writeFileSync('data/locations.ts', content);

console.log('✅ Battery inventory added to all locations!');
