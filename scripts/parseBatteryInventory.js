const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('/Users/tarun/Documents/GBMPortal/Gen1 Battery Inventory Levels.xlsx');

console.log('Available sheets:', workbook.SheetNames);

// Try to find the right sheet
const sheetName = workbook.SheetNames[0]; // Use first sheet
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Print first 10 rows to understand structure
console.log('\nFirst 10 rows:');
data.slice(0, 10).forEach((row, i) => {
  console.log(`Row ${i}:`, row);
});

console.log('\nColumn count:', data[0]?.length || 0);
