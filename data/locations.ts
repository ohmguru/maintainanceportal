export interface Location {
  name: string;
  blaster: number;
  vest: number;
  batteries: number;
  blasterRank: number;
  vestRank: number;
  batteriesRank: number;
  blasterPercentile: number;
  vestPercentile: number;
  batteriesPercentile: number;
  compositePercentile: number;
  compositeRank: number;
}

// Calculate weighted composite: Battery 66%, Blaster 17%, Vest 17%
function calculateComposite(blaster: number, vest: number, battery: number): number {
  return Math.round((blaster * 0.17 + vest * 0.17 + battery * 0.66) * 10) / 10;
}

const locationsData = [
  {
    name: "ME Gilbert, AZ",
    blaster: 436.2,
    vest: 1832.0,
    batteries: 610.7,
    blasterRank: 7,
    vestRank: 2,
    batteriesRank: 5,
    blasterPercentile: 76.0,
    vestPercentile: 96.0,
    batteriesPercentile: 84.0,
    compositePercentile: 85.3,
    compositeRank: 1
  },
  {
    name: "ME San Antonio North, TX",
    blaster: 633.5,
    vest: 1306.5,
    batteries: 464.5,
    blasterRank: 2,
    vestRank: 4,
    batteriesRank: 8,
    blasterPercentile: 96.0,
    vestPercentile: 88.0,
    batteriesPercentile: 72.0,
    compositePercentile: 85.3,
    compositeRank: 1
  },
  {
    name: "ME Olathe, KS",
    blaster: 454.5,
    vest: 874.1,
    batteries: 1262.6,
    blasterRank: 6,
    vestRank: 8,
    batteriesRank: 2,
    blasterPercentile: 80.0,
    vestPercentile: 72.0,
    batteriesPercentile: 96.0,
    compositePercentile: 82.7,
    compositeRank: 3
  },
  {
    name: "ME Tulsa OK",
    blaster: 273.8,
    vest: 6845.0,
    batteries: 570.4,
    blasterRank: 14,
    vestRank: 1,
    batteriesRank: 6,
    blasterPercentile: 48.0,
    vestPercentile: 100.0,
    batteriesPercentile: 80.0,
    compositePercentile: 76.0,
    compositeRank: 4
  },
  {
    name: "ME Avondale, AZ",
    blaster: 622.6,
    vest: 778.3,
    batteries: 406.0,
    blasterRank: 3,
    vestRank: 10,
    batteriesRank: 11,
    blasterPercentile: 92.0,
    vestPercentile: 64.0,
    batteriesPercentile: 60.0,
    compositePercentile: 72.0,
    compositeRank: 5
  },
  {
    name: "ME Grand Prairie, TX",
    blaster: 718.0,
    vest: 1116.9,
    batteries: 101.5,
    blasterRank: 1,
    vestRank: 5,
    batteriesRank: 21,
    blasterPercentile: 100.0,
    vestPercentile: 84.0,
    batteriesPercentile: 20.0,
    compositePercentile: 68.0,
    compositeRank: 6
  },
  {
    name: "ME Frisco, TX",
    blaster: 299.9,
    vest: 916.4,
    batteries: 445.8,
    blasterRank: 13,
    vestRank: 6,
    batteriesRank: 10,
    blasterPercentile: 52.0,
    vestPercentile: 80.0,
    batteriesPercentile: 64.0,
    compositePercentile: 65.3,
    compositeRank: 7
  },
  {
    name: "ME Tempe, AZ",
    blaster: 458.3,
    vest: 723.7,
    batteries: 361.8,
    blasterRank: 5,
    vestRank: 11,
    batteriesRank: 13,
    blasterPercentile: 84.0,
    vestPercentile: 60.0,
    batteriesPercentile: 52.0,
    compositePercentile: 65.3,
    compositeRank: 7
  },
  {
    name: "ME Humble, TX",
    blaster: 246.4,
    vest: 835.1,
    batteries: 1252.6,
    blasterRank: 18,
    vestRank: 9,
    batteriesRank: 3,
    blasterPercentile: 32.0,
    vestPercentile: 68.0,
    batteriesPercentile: 92.0,
    compositePercentile: 64.0,
    compositeRank: 9
  },
  {
    name: "ME Independance, MO",
    blaster: 324.1,
    vest: 716.4,
    batteries: 453.7,
    blasterRank: 11,
    vestRank: 12,
    batteriesRank: 9,
    blasterPercentile: 60.0,
    vestPercentile: 56.0,
    batteriesPercentile: 68.0,
    compositePercentile: 61.3,
    compositeRank: 10
  },
  {
    name: "ME Knoxville, TN",
    blaster: 515.2,
    vest: 222.9,
    batteries: 858.6,
    blasterRank: 4,
    vestRank: 25,
    batteriesRank: 4,
    blasterPercentile: 88.0,
    vestPercentile: 4.0,
    batteriesPercentile: 88.0,
    compositePercentile: 60.0,
    compositeRank: 11
  },
  {
    name: "ME Shenandoah, TX",
    blaster: 268.6,
    vest: 476.1,
    batteries: 10475.0,
    blasterRank: 15,
    vestRank: 17,
    batteriesRank: 1,
    blasterPercentile: 44.0,
    vestPercentile: 36.0,
    batteriesPercentile: 100.0,
    compositePercentile: 60.0,
    compositeRank: 11
  },
  {
    name: "ME Austin, TX",
    blaster: 334.6,
    vest: 451.3,
    batteries: 373.2,
    blasterRank: 9,
    vestRank: 18,
    batteriesRank: 12,
    blasterPercentile: 68.0,
    vestPercentile: 32.0,
    batteriesPercentile: 56.0,
    compositePercentile: 52.0,
    compositeRank: 13
  },
  {
    name: "ME Atlanta, GA",
    blaster: 144.3,
    vest: 905.3,
    batteries: 553.2,
    blasterRank: 25,
    vestRank: 7,
    batteriesRank: 7,
    blasterPercentile: 4.0,
    vestPercentile: 76.0,
    batteriesPercentile: 76.0,
    compositePercentile: 52.0,
    compositeRank: 13
  },
  {
    name: "ME OKC, OK",
    blaster: 343.3,
    vest: 343.3,
    batteries: 270.8,
    blasterRank: 8,
    vestRank: 22,
    batteriesRank: 14,
    blasterPercentile: 72.0,
    vestPercentile: 16.0,
    batteriesPercentile: 48.0,
    compositePercentile: 45.3,
    compositeRank: 15
  },
  {
    name: "ME Louisville KT",
    blaster: 180.2,
    vest: 1801.7,
    batteries: 122.6,
    blasterRank: 23,
    vestRank: 3,
    batteriesRank: 19,
    blasterPercentile: 12.0,
    vestPercentile: 92.0,
    batteriesPercentile: 28.0,
    compositePercentile: 44.0,
    compositeRank: 16
  },
  {
    name: "ME Hoffman, IL",
    blaster: 331.9,
    vest: 361.2,
    batteries: 139.5,
    blasterRank: 10,
    vestRank: 21,
    batteriesRank: 17,
    blasterPercentile: 64.0,
    vestPercentile: 20.0,
    batteriesPercentile: 36.0,
    compositePercentile: 40.0,
    compositeRank: 17
  },
  {
    name: "ME Wesley Chappel, FL",
    blaster: 305.3,
    vest: 534.4,
    batteries: 99.9,
    blasterRank: 12,
    vestRank: 14,
    batteriesRank: 22,
    blasterPercentile: 56.0,
    vestPercentile: 48.0,
    batteriesPercentile: 16.0,
    compositePercentile: 40.0,
    compositeRank: 17
  },
  {
    name: "ME Norman OK",
    blaster: 217.5,
    vest: 580.0,
    batteries: 148.0,
    blasterRank: 20,
    vestRank: 13,
    batteriesRank: 16,
    blasterPercentile: 24.0,
    vestPercentile: 52.0,
    batteriesPercentile: 40.0,
    compositePercentile: 38.7,
    compositeRank: 19
  },
  {
    name: "ME Montclair, CA",
    blaster: 251.8,
    vest: 431.6,
    batteries: 171.3,
    blasterRank: 17,
    vestRank: 19,
    batteriesRank: 15,
    blasterPercentile: 36.0,
    vestPercentile: 28.0,
    batteriesPercentile: 44.0,
    compositePercentile: 36.0,
    compositeRank: 20
  },
  {
    name: "ME Orlando, FL",
    blaster: 222.3,
    vest: 487.0,
    batteries: 103.3,
    blasterRank: 19,
    vestRank: 15,
    batteriesRank: 20,
    blasterPercentile: 28.0,
    vestPercentile: 44.0,
    batteriesPercentile: 24.0,
    compositePercentile: 32.0,
    compositeRank: 21
  },
  {
    name: "ME Taylor, MI",
    blaster: 184.0,
    vest: 482.9,
    batteries: 125.1,
    blasterRank: 22,
    vestRank: 16,
    batteriesRank: 18,
    blasterPercentile: 16.0,
    vestPercentile: 40.0,
    batteriesPercentile: 32.0,
    compositePercentile: 29.3,
    compositeRank: 22
  },
  {
    name: "ME San Antonio West, TX",
    blaster: 258.8,
    vest: 423.5,
    batteries: 99.1,
    blasterRank: 16,
    vestRank: 20,
    batteriesRank: 23,
    blasterPercentile: 40.0,
    vestPercentile: 24.0,
    batteriesPercentile: 12.0,
    compositePercentile: 25.3,
    compositeRank: 23
  },
  {
    name: "ME Beaumont, TX",
    blaster: 203.8,
    vest: 280.9,
    batteries: 29.9,
    blasterRank: 21,
    vestRank: 23,
    batteriesRank: 25,
    blasterPercentile: 20.0,
    vestPercentile: 12.0,
    batteriesPercentile: 4.0,
    compositePercentile: 12.0,
    compositeRank: 24
  },
  {
    name: "ME Katy, TX",
    blaster: 158.0,
    vest: 224.3,
    batteries: 65.2,
    blasterRank: 24,
    vestRank: 24,
    batteriesRank: 24,
    blasterPercentile: 8.0,
    vestPercentile: 8.0,
    batteriesPercentile: 8.0,
    compositePercentile: 8.0,
    compositeRank: 25
  }
];

// Recalculate composite percentiles with Battery weighted at 66%
const locationsWithComposite = locationsData.map(loc => ({
  ...loc,
  compositePercentile: calculateComposite(loc.blasterPercentile, loc.vestPercentile, loc.batteriesPercentile)
}));

// Sort by composite percentile (descending), with tiebreakers to prevent ties:
// 1. Composite percentile (primary)
// 2. Battery percentile (first tiebreaker - most important)
// 3. Blaster percentile (second tiebreaker)
// 4. Vest percentile (third tiebreaker)
// 5. Location name alphabetically (final tiebreaker)
const sortedByComposite = [...locationsWithComposite].sort((a, b) => {
  if (b.compositePercentile !== a.compositePercentile) {
    return b.compositePercentile - a.compositePercentile;
  }
  if (b.batteriesPercentile !== a.batteriesPercentile) {
    return b.batteriesPercentile - a.batteriesPercentile;
  }
  if (b.blasterPercentile !== a.blasterPercentile) {
    return b.blasterPercentile - a.blasterPercentile;
  }
  if (b.vestPercentile !== a.vestPercentile) {
    return b.vestPercentile - a.vestPercentile;
  }
  return a.name.localeCompare(b.name);
});

export const locations: Location[] = sortedByComposite.map((loc, index) => ({
  ...loc,
  compositeRank: index + 1
}));
