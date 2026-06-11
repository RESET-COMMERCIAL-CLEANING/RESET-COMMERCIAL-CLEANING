// Pricing tiers and multipliers based on RESET Pricing Guide

export type PricingTier = 'budget' | 'standard' | 'premium';
export type PropertyType = 'office' | 'retail' | 'warehouse' | 'medical' | 'restaurant' | 'school' | 'other';
export type CleaningType = 'standard' | 'deep-clean' | 'post-construction' | 'specialized-medical' | 'one-time';
export type Frequency = 'daily' | 'twice-weekly' | 'weekly' | 'bi-weekly' | 'monthly' | 'one-time';

// Base rates per square foot by property type and tier (AUD/sqft/year)
const BASE_RATES: Record<PropertyType, Record<PricingTier, number>> = {
  office: { budget: 0.12, standard: 0.18, premium: 0.25 },
  retail: { budget: 0.15, standard: 0.22, premium: 0.30 },
  warehouse: { budget: 0.08, standard: 0.12, premium: 0.15 },
  medical: { budget: 0.25, standard: 0.32, premium: 0.40 },
  restaurant: { budget: 0.18, standard: 0.26, premium: 0.35 },
  school: { budget: 0.12, standard: 0.17, premium: 0.22 },
  other: { budget: 0.12, standard: 0.18, premium: 0.25 },
};

// Cleaning type multipliers
const CLEANING_TYPE_MULTIPLIERS: Record<CleaningType, number> = {
  'standard': 1.0,
  'deep-clean': 1.8,
  'post-construction': 2.5,
  'specialized-medical': 2.2,
  'one-time': 1.3,
};

// Floor multipliers
const FLOOR_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.075,
  3: 1.15,
  4: 1.2,
  5: 1.3,
  6: 1.4,
  7: 1.5,
  8: 1.55,
  9: 1.6,
  10: 1.5,
  11: 1.75,
};

// Frequency discounts/premiums
const FREQUENCY_MULTIPLIERS: Record<Frequency, number> = {
  'daily': 0.85,
  'twice-weekly': 0.88,
  'weekly': 0.95,
  'bi-weekly': 1.0,
  'monthly': 1.1,
  'one-time': 1.25,
};

// Distance premium
const getDistancePremium = (distanceKm: number): number => {
  if (distanceKm <= 10) return 1.0;
  if (distanceKm <= 20) return 1.05;
  if (distanceKm <= 30) return 1.1;
  if (distanceKm <= 40) return 1.15;
  return 1.2;
};

// Volume discount (multiple properties)
const getVolumeDiscount = (numProperties: number): number => {
  if (numProperties === 1) return 1.0;
  if (numProperties <= 3) return 0.95;
  if (numProperties <= 5) return 0.92;
  if (numProperties <= 10) return 0.88;
  return 0.85;
};

// Annual contract discount
const getAnnualContractDiscount = (contractMonths: number): number => {
  if (contractMonths >= 36) return 0.85; // -15%
  if (contractMonths >= 24) return 0.88; // -12%
  if (contractMonths >= 12) return 0.92; // -8%
  return 1.0; // No discount for month-to-month
};

// Minimum service charges
const MINIMUM_CHARGES: Record<string, number> = {
  'standard': 150,
  'deep-clean': 300,
  'window-cleaning': 200,
  'one-time': 250,
};

// Special requirements premiums (fixed amounts per visit or percentage)
export interface SpecialRequirement {
  type: string;
  premiumAmount?: number; // Fixed amount
  premiumMultiplier?: number; // Percentage multiplier
  description: string;
}

const SPECIAL_REQUIREMENTS: Record<string, SpecialRequirement> = {
  'off-hours': {
    type: 'off-hours',
    premiumAmount: 20, // Per hour
    description: 'Before 6am or after 6pm',
  },
  'weekend': {
    type: 'weekend',
    premiumMultiplier: 0.25, // +25%
    description: 'Weekend service',
  },
  'emergency': {
    type: 'emergency',
    premiumMultiplier: 0.5, // +50%
    description: 'Same-day/emergency service',
  },
  'high-touch-sanitization': {
    type: 'high-touch-sanitization',
    premiumAmount: 0.05, // Per sqft
    description: 'High-touch sanitization',
  },
  'biohazard': {
    type: 'biohazard',
    premiumAmount: 0.15, // Per sqft + base fee
    description: 'Biohazard/specialized cleanup',
  },
  'hazmat-compliance': {
    type: 'hazmat-compliance',
    premiumAmount: 150,
    description: 'Hazmat compliance',
  },
  'move-in-out': {
    type: 'move-in-out',
    premiumAmount: 0.08, // Per sqft
    description: 'Move-in/Move-out cleaning',
  },
  'equipment-provided': {
    type: 'equipment-provided',
    premiumAmount: 37.50, // Average of $25-50
    description: 'Equipment/tools provided',
  },
  'window-cleaning': {
    type: 'window-cleaning',
    premiumAmount: 0.08, // Per sqft
    description: 'Window cleaning',
  },
  'carpet-cleaning': {
    type: 'carpet-cleaning',
    premiumAmount: 0.12, // Per sqft
    description: 'Carpet cleaning',
  },
  'eco-friendly': {
    type: 'eco-friendly',
    premiumMultiplier: 0.15, // +15%
    description: 'Eco-friendly products',
  },
};

export interface PricingCalculationInput {
  squareFeet: number;
  propertyType: PropertyType;
  pricingTier: PricingTier;
  cleaningType: CleaningType;
  numberOfFloors: number;
  frequency: Frequency;
  distanceKm: number;
  numProperties?: number;
  contractMonths?: number;
  specialRequirements?: string[]; // Keys from SPECIAL_REQUIREMENTS
  additionalHours?: number; // For custom labor
}

export interface PricingBreakdown {
  baseMonthlyRate: number;
  cleaningTypeMultiplier: number;
  floorMultiplier: number;
  frequencyMultiplier: number;
  distancePremium: number;
  volumeDiscount: number;
  annualContractDiscount: number;
  specialRequirementsPremium: number;
  minimumCharge: number;

  monthlyRate: number;
  annualRate: number;
  perVisitRate: number;

  breakdown: {
    category: string;
    amount: number;
    description: string;
  }[];
}

export function calculatePricing(input: PricingCalculationInput): PricingBreakdown {
  const {
    squareFeet,
    propertyType,
    pricingTier,
    cleaningType,
    numberOfFloors,
    frequency,
    distanceKm,
    numProperties = 1,
    contractMonths = 0,
    specialRequirements = [],
  } = input;

  // Step 1: Base rate
  const baseRate = BASE_RATES[propertyType][pricingTier];
  const annualBaseRate = squareFeet * baseRate;
  const baseMonthlyRate = annualBaseRate / 12;

  // Step 2: Cleaning type multiplier
  const cleaningTypeMultiplier = CLEANING_TYPE_MULTIPLIERS[cleaningType] || 1.0;

  // Step 3: Floor multiplier
  const floorCount = Math.min(Math.max(numberOfFloors, 1), 11);
  const floorMultiplier = FLOOR_MULTIPLIERS[floorCount] || 1.0;

  // Step 4: Frequency multiplier
  const frequencyMultiplier = FREQUENCY_MULTIPLIERS[frequency] || 1.0;

  // Step 5: Distance premium
  const distancePremium = getDistancePremium(distanceKm);

  // Step 6: Volume discount
  const volumeDiscount = getVolumeDiscount(numProperties);

  // Step 7: Annual contract discount
  const annualContractDiscount = getAnnualContractDiscount(contractMonths);

  // Step 8: Calculate base pricing before special requirements
  let monthlyRate =
    baseMonthlyRate *
    cleaningTypeMultiplier *
    floorMultiplier *
    frequencyMultiplier *
    distancePremium *
    volumeDiscount;

  // Step 9: Special requirements premium
  let specialRequirementsPremium = 0;
  const specialReqBreakdown: { description: string; amount: number }[] = [];

  specialRequirements.forEach((req) => {
    const requirement = SPECIAL_REQUIREMENTS[req];
    if (!requirement) return;

    if (requirement.premiumAmount) {
      let amount = requirement.premiumAmount;
      // If premium is per sqft, multiply by square feet
      if (
        req === 'high-touch-sanitization' ||
        req === 'biohazard' ||
        req === 'move-in-out' ||
        req === 'window-cleaning' ||
        req === 'carpet-cleaning'
      ) {
        amount = requirement.premiumAmount * squareFeet;
      }
      specialRequirementsPremium += amount;
      specialReqBreakdown.push({ description: requirement.description, amount });
    }

    if (requirement.premiumMultiplier) {
      const premiumAmount = monthlyRate * requirement.premiumMultiplier;
      specialRequirementsPremium += premiumAmount;
      specialReqBreakdown.push({
        description: requirement.description,
        amount: premiumAmount,
      });
    }
  });

  monthlyRate += specialRequirementsPremium;

  // Step 10: Apply annual contract discount
  const annualRate = monthlyRate * 12 * annualContractDiscount;
  const finalMonthlyRate = annualRate / 12;

  // Step 11: Apply minimum charge
  const minimumCharge = MINIMUM_CHARGES[cleaningType] || MINIMUM_CHARGES['standard'];
  const finalRate = Math.max(finalMonthlyRate, minimumCharge);

  // Calculate per-visit rate (for frequency-based billing)
  let visitsPerMonth = 4; // Default for bi-weekly
  if (frequency === 'daily') visitsPerMonth = 20;
  if (frequency === 'twice-weekly') visitsPerMonth = 8;
  if (frequency === 'weekly') visitsPerMonth = 4.33;
  if (frequency === 'bi-weekly') visitsPerMonth = 2;
  if (frequency === 'monthly') visitsPerMonth = 1;
  if (frequency === 'one-time') visitsPerMonth = 1;

  const perVisitRate = finalRate / visitsPerMonth;

  // Build breakdown
  const breakdown = [
    {
      category: 'Base Rate',
      amount: baseMonthlyRate,
      description: `${squareFeet.toLocaleString()} sqft × $${baseRate}/sqft`,
    },
    {
      category: 'Cleaning Type',
      amount: baseMonthlyRate * (cleaningTypeMultiplier - 1),
      description: `${cleaningType} (${cleaningTypeMultiplier}x)`,
    },
    {
      category: 'Floor Complexity',
      amount: baseMonthlyRate * cleaningTypeMultiplier * (floorMultiplier - 1),
      description: `${numberOfFloors} floors (${floorMultiplier}x)`,
    },
    {
      category: 'Frequency',
      amount: baseMonthlyRate * cleaningTypeMultiplier * floorMultiplier * (frequencyMultiplier - 1),
      description: `${frequency} cleaning (${frequencyMultiplier}x)`,
    },
    {
      category: 'Distance',
      amount: monthlyRate * (distancePremium - 1),
      description: `${distanceKm}km from service hub (${distancePremium}x)`,
    },
    {
      category: 'Volume Discount',
      amount: -monthlyRate * (1 - volumeDiscount),
      description: `${numProperties} properties (${(volumeDiscount * 100).toFixed(0)}%)`,
    },
    ...specialReqBreakdown.map((req) => ({
      category: 'Special Requirements',
      amount: req.amount,
      description: req.description,
    })),
    {
      category: 'Annual Contract Discount',
      amount: -(monthlyRate + specialRequirementsPremium) * (1 - annualContractDiscount) * 12,
      description: `${contractMonths}-month contract (${(annualContractDiscount * 100).toFixed(0)}%)`,
    },
  ];

  return {
    baseMonthlyRate,
    cleaningTypeMultiplier,
    floorMultiplier,
    frequencyMultiplier,
    distancePremium,
    volumeDiscount,
    annualContractDiscount,
    specialRequirementsPremium,
    minimumCharge,
    monthlyRate: finalRate,
    annualRate: finalRate * 12,
    perVisitRate: Math.max(perVisitRate, minimumCharge / visitsPerMonth),
    breakdown,
  };
}

// Helper function to get hourly rate
export function getHourlyRate(pricingTier: PricingTier, specialization?: string): number {
  const baseRates = {
    budget: 45,
    standard: 55,
    premium: 65,
  };

  let rate = baseRates[pricingTier];

  if (specialization === 'off-hours') rate += 15;
  if (specialization === 'specialized-skills') rate += 10;
  if (specialization === 'equipment-operation') rate += 5;

  return rate;
}

// Generate quote summary
export function generateQuoteSummary(
  input: PricingCalculationInput,
  clientName: string
): string {
  const pricing = calculatePricing(input);

  const summary = `
RESET COMMERCIAL CLEANING - QUOTE SUMMARY
==========================================

Client: ${clientName}
Date: ${new Date().toLocaleDateString('en-AU')}

SERVICE DETAILS
Property Type: ${input.propertyType.charAt(0).toUpperCase() + input.propertyType.slice(1)}
Square Footage: ${input.squareFeet.toLocaleString()} sqft
Number of Floors: ${input.numberOfFloors}
Cleaning Type: ${input.cleaningType.replace('-', ' ').toUpperCase()}
Frequency: ${input.frequency.charAt(0).toUpperCase() + input.frequency.slice(1)}
Service Tier: ${input.pricingTier.charAt(0).toUpperCase() + input.pricingTier.slice(1)}

PRICING BREAKDOWN
${pricing.breakdown
  .map(
    (item) =>
      `${item.category.padEnd(25)} $${item.amount.toFixed(2).padStart(12)} (${item.description})`
  )
  .join('\n')}

TOTAL PRICING
Monthly Rate: $${pricing.monthlyRate.toFixed(2)}
Annual Rate: $${pricing.annualRate.toFixed(2)}
Per Visit: $${pricing.perVisitRate.toFixed(2)}

Valid for 30 days. Terms: Net 30. Services begin upon contract execution.
  `.trim();

  return summary;
}
