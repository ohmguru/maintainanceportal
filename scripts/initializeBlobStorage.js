const fs = require('fs');

// Read the battery inventory data
const batteryData = JSON.parse(fs.readFileSync('data/batteryInventory.json', 'utf8'));

console.log('Battery Inventory Data for Netlify Blob:');
console.log('========================================');
console.log(JSON.stringify(batteryData, null, 2));

console.log('\n📊 Summary:');
console.log(`Total Battery Reserve 1: ${batteryData.totalReserve1} batteries`);
console.log(`Number of locations: ${batteryData.locations.length}`);
console.log(`Allocation base: ${batteryData.allocationBase} batteries/location`);

console.log('\n✅ This data will be automatically uploaded to Netlify Blob storage on deployment');
console.log('   Access it at: /api/battery-inventory');
console.log('   Admin panel: /admin/battery-inventory');
