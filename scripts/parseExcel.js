const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const workbook = XLSX.readFile('/Users/tarun/Documents/GBMPortal/Game Data Sept 25 (1).xlsx');

// Get the ME_Players sheet
const sheetName = 'ME_Players';
const worksheet = workbook.Sheets[sheetName];

if (!worksheet) {
  console.error('Sheet ME_Players not found');
  console.log('Available sheets:', workbook.SheetNames);
  process.exit(1);
}

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Print first few rows to understand structure
console.log('First 5 rows:');
data.slice(0, 5).forEach((row, i) => {
  console.log(`Row ${i}:`, row.slice(0, 50)); // First 50 columns
});

// Print column headers (assuming row 0 is headers)
console.log('\nColumn headers (first 50):');
if (data[0]) {
  data[0].slice(0, 50).forEach((header, i) => {
    console.log(`Column ${i} (${String.fromCharCode(65 + i)}): ${header}`);
  });
}

// Check columns AT and AU specifically
console.log('\nChecking columns AT (45) and AU (46):');
console.log('Column AT header:', data[0] ? data[0][45] : 'N/A');
console.log('Column AU header:', data[0] ? data[0][46] : 'N/A');
console.log('Sample data from row 1:', data[1] ? [data[1][45], data[1][46]] : 'N/A');
