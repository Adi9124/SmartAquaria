export const SPECIES_PROFILES = [
  {
    id: 'discus',
    name: 'Discus Pair (Symphysodon)',
    category: 'Freshwater Cichlid',
    difficulty: 'Expert',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    description: 'Highly sensitive Amazonian species requiring soft, acidic water and precise temperature bumps to trigger courtship dance and vertical egg deposition.',
    optimalSensors: {
      temperature: { min: 28.5, max: 30.5, target: 29.5, unit: '°C' },
      ph: { min: 5.8, max: 6.5, target: 6.2, unit: 'pH' },
      dissolvedOxygen: { min: 6.5, max: 8.5, target: 7.5, unit: 'mg/L' },
      ammonia: { min: 0.0, max: 0.02, target: 0.0, unit: 'ppm' },
      nitrate: { min: 0, max: 10, target: 5, unit: 'ppm' },
      lightSpectrum: { min: 200, max: 600, target: 350, unit: 'Lux' },
      turbidity: { min: 0.1, max: 1.2, target: 0.4, unit: 'NTU' }
    },
    breedingTriggers: [
      'Simulated Amazonian rain soft-water change (pH drop 0.3-0.5)',
      'Water temperature step-up +1.5°C over 12 hours',
      'Dim photoperiod with 450nm moonlight night phase',
      'Live Artemia & Bloodworm high-protein conditioning'
    ],
    behavioralSignatures: [
      { name: 'Vertical Substrate Nipping', probability: 94, duration: '1-3 hours', description: 'Pair vigorously cleans slate or broad leaf with mouths prior to egg deposit.' },
      { name: 'Synchronized Shimmy / Courtship Dance', probability: 89, duration: '30-90 mins', description: 'Side-by-side lateral shivering, flare fins, and reciprocal bow.' },
      { name: 'Vertical Tile Pass (Egg Laying)', probability: 97, duration: '45-120 mins', description: 'Female deposits adhesive eggs upward, male follows fertilizing row by row.' },
      { name: 'Slime Secretion & Parental Fanning', probability: 92, duration: '48-60 hours', description: 'Parents fan eggs with pectoral fins and produce parental mucus for fry.' }
    ]
  },
  {
    id: 'clownfish',
    name: 'Ocellaris Clownfish (Amphiprion ocellaris)',
    category: 'Marine Reef',
    difficulty: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80',
    description: 'Protandrous hermaphrodite pair nesting adjacent to sea anemones or ceramic tiles. High reliance on lunar light cycles and high flow aeration.',
    optimalSensors: {
      temperature: { min: 26.0, max: 28.0, target: 27.2, unit: '°C' },
      ph: { min: 8.1, max: 8.4, target: 8.3, unit: 'pH' },
      dissolvedOxygen: { min: 6.8, max: 8.5, target: 7.8, unit: 'mg/L' },
      ammonia: { min: 0.0, max: 0.01, target: 0.0, unit: 'ppm' },
      nitrate: { min: 0, max: 5, target: 2, unit: 'ppm' },
      lightSpectrum: { min: 400, max: 1200, target: 800, unit: 'Lux' },
      turbidity: { min: 0.0, max: 0.8, target: 0.2, unit: 'NTU' }
    },
    breedingTriggers: [
      'Full moon / New moon lunar simulation phase',
      'Stable 35ppt salinity with high alkalinity (8.5-9.5 dKH)',
      'Substrate cleaning near anemone base',
      'Rotifer / Copepod gut-loaded feed trigger'
    ],
    behavioralSignatures: [
      { name: 'Tile Scraping & Substrate Prep', probability: 91, duration: '2-4 hours', description: 'Dominant female aggressively bites algal growth off laying site.' },
      { name: 'Submissive Twitching & Dancing', probability: 86, duration: '20-60 mins', description: 'Smaller male displays rapid whole-body quivering near female.' },
      { name: 'Adhesive Capsule Clutch Laying', probability: 95, duration: '60-90 mins', description: 'Orange egg mass attached to rock, male guards 24/7.' },
      { name: 'Mouth Mouthing & Aeration Fanning', probability: 93, duration: '7-9 days', description: 'Male removes unfertilized eggs and fans oxygenated water over clutch.' }
    ]
  },
  {
    id: 'cichlid',
    name: 'African Peacock Cichlid (Aulonocara)',
    category: 'Mouthbrooder',
    difficulty: 'Beginner - Intermediate',
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
    description: 'Substrate pit-digging maternal mouthbrooder from Lake Malawi. Males construct sand bower bowles to entice females for egg fertilisation.',
    optimalSensors: {
      temperature: { min: 24.5, max: 27.5, target: 26.0, unit: '°C' },
      ph: { min: 7.8, max: 8.6, target: 8.2, unit: 'pH' },
      dissolvedOxygen: { min: 6.0, max: 8.0, target: 7.2, unit: 'mg/L' },
      ammonia: { min: 0.0, max: 0.03, target: 0.0, unit: 'ppm' },
      nitrate: { min: 0, max: 20, target: 10, unit: 'ppm' },
      lightSpectrum: { min: 300, max: 900, target: 550, unit: 'Lux' },
      turbidity: { min: 0.2, max: 1.5, target: 0.5, unit: 'NTU' }
    },
    breedingTriggers: [
      'Sand bower construction by dominant alpha male',
      'Water hardness increase (GH 12-18, KH 10-14)',
      'High protein pellet & spirulina feeding',
      'Dominance displays & territorial boundary flare'
    ],
    behavioralSignatures: [
      { name: 'Sand Bower Pit Excavation', probability: 96, duration: '3-6 hours', description: 'Male scoops mouthfuls of substrate to carve courtship pit.' },
      { name: 'Egg-Spot Fin Extension & Circle Dance', probability: 90, duration: '30-45 mins', description: 'Male flashes anal fin egg dummy spots while gyrating.' },
      { name: 'Mouthbrooding Pickup & Direct Fertilization', probability: 98, duration: '15-30 mins', description: 'Female drops egg, turns instantly, picks up egg in mouth, nips male egg-spot to fertilize.' },
      { name: 'Buccal Cavity Incubation', probability: 94, duration: '21 days', description: 'Female holds eggs in throat pouch, refusing food until fry release.' }
    ]
  }
];

export const INITIAL_ACTUATOR_STATE = {
  heater: { status: 'AUTO', power: 65, setpoint: 29.5, override: false },
  aerator: { status: 'AUTO', flowRate: 85, setpoint: 7.5, override: false },
  dosingPump: { status: 'IDLE', rateMlPerHr: 0.0, mode: 'pH Buffer', override: false },
  ledLighting: { status: 'AUTO', spectrum: 'Breeding Dusk Blue', brightness: 35, spectrumNm: 450, override: false },
  autoFeeder: { status: 'SCHEDULED', nextFeedInMins: 42, dosageGrams: 2.5, feedType: 'Live Artemia Nauplii' },
  filterPump: { status: 'ACTIVE', flowLph: 450, quietMode: true }
};
