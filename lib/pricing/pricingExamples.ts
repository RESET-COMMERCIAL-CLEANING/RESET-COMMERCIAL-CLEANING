// Example pricing calculations based on PRICING_GUIDE.md

import { calculatePricing, generateQuoteSummary, type PricingCalculationInput } from './pricingCalculator';

// Example 1: Office Building (Tier 2, Standard)
// From PRICING_GUIDE.md - Expected ~$1,899.71/month
export const example1_OfficeStandard: PricingCalculationInput = {
  squareFeet: 10000,
  propertyType: 'office',
  pricingTier: 'standard',
  cleaningType: 'standard',
  numberOfFloors: 3,
  frequency: 'weekly',
  distanceKm: 15,
  numProperties: 1,
  contractMonths: 12,
  specialRequirements: [],
};

// Example 2: Medical Facility (Tier 3, Specialized)
// From PRICING_GUIDE.md - Expected ~$1,272.67/month (twice-weekly)
export const example2_MedicalPremium: PricingCalculationInput = {
  squareFeet: 5000,
  propertyType: 'medical',
  pricingTier: 'premium',
  cleaningType: 'specialized-medical',
  numberOfFloors: 2,
  frequency: 'twice-weekly',
  distanceKm: 8,
  numProperties: 1,
  contractMonths: 24,
  specialRequirements: ['high-touch-sanitization', 'off-hours'],
};

// Example 3: Retail Store (Tier 1, One-Time)
// From PRICING_GUIDE.md - Expected $1,158.30 (one-time)
export const example3_RetailOneTime: PricingCalculationInput = {
  squareFeet: 3000,
  propertyType: 'retail',
  pricingTier: 'budget',
  cleaningType: 'one-time',
  numberOfFloors: 1,
  frequency: 'one-time',
  distanceKm: 25,
  numProperties: 1,
  contractMonths: 0,
  specialRequirements: [],
};

// Example 4: Restaurant - Deep Clean
export const example4_RestaurantDeep: PricingCalculationInput = {
  squareFeet: 4500,
  propertyType: 'restaurant',
  pricingTier: 'standard',
  cleaningType: 'deep-clean',
  numberOfFloors: 2,
  frequency: 'weekly',
  distanceKm: 12,
  numProperties: 1,
  contractMonths: 12,
  specialRequirements: ['eco-friendly'],
};

// Example 5: Warehouse - Budget
export const example5_WarehouseBudget: PricingCalculationInput = {
  squareFeet: 25000,
  propertyType: 'warehouse',
  pricingTier: 'budget',
  cleaningType: 'standard',
  numberOfFloors: 1,
  frequency: 'bi-weekly',
  distanceKm: 35,
  numProperties: 1,
  contractMonths: 0,
  specialRequirements: [],
};

// Example 6: School - Multiple properties (volume discount)
export const example6_SchoolMultiple: PricingCalculationInput = {
  squareFeet: 8000,
  propertyType: 'school',
  pricingTier: 'standard',
  cleaningType: 'standard',
  numberOfFloors: 2,
  frequency: 'daily',
  distanceKm: 5,
  numProperties: 3, // Volume discount applies
  contractMonths: 36,
  specialRequirements: [],
};

// Example 7: Post-Construction Cleanup
export const example7_PostConstruction: PricingCalculationInput = {
  squareFeet: 6000,
  propertyType: 'office',
  pricingTier: 'premium',
  cleaningType: 'post-construction',
  numberOfFloors: 4,
  frequency: 'one-time',
  distanceKm: 20,
  numProperties: 1,
  contractMonths: 0,
  specialRequirements: ['biohazard', 'hazmat-compliance'],
};

// Function to display all examples
export function displayPricingExamples() {
  const examples = [
    {
      name: 'Example 1: Office Building (Standard)',
      input: example1_OfficeStandard,
      expectedMonthly: '$1,899.71',
    },
    {
      name: 'Example 2: Medical Facility (Premium, Twice-Weekly)',
      input: example2_MedicalPremium,
      expectedMonthly: '$1,272.67',
    },
    {
      name: 'Example 3: Retail Store (One-Time Deep Clean)',
      input: example3_RetailOneTime,
      expectedMonthly: '$1,158.30 (one-time)',
    },
    {
      name: 'Example 4: Restaurant (Standard, Deep Clean)',
      input: example4_RestaurantDeep,
      expectedMonthly: 'TBD',
    },
    {
      name: 'Example 5: Warehouse (Budget, Bi-Weekly)',
      input: example5_WarehouseBudget,
      expectedMonthly: 'TBD',
    },
    {
      name: 'Example 6: School (3 Properties, Volume Discount)',
      input: example6_SchoolMultiple,
      expectedMonthly: 'TBD',
    },
    {
      name: 'Example 7: Post-Construction (Premium)',
      input: example7_PostConstruction,
      expectedMonthly: 'TBD',
    },
  ];

  console.log('RESET PRICING EXAMPLES');
  console.log('='.repeat(80));

  examples.forEach((example, index) => {
    console.log(`\n${example.name}`);
    console.log('-'.repeat(80));

    const pricing = calculatePricing(example.input);
    const quote = generateQuoteSummary(example.input, `Client ${index + 1}`);

    console.log(quote);
    console.log(`\nExpected Monthly (from guide): ${example.expectedMonthly}`);
    console.log(`Calculated Monthly: $${pricing.monthlyRate.toFixed(2)}`);
    console.log(`Calculated Annual: $${pricing.annualRate.toFixed(2)}`);
    console.log(`Calculated Per Visit: $${pricing.perVisitRate.toFixed(2)}`);
  });
}

// Export for testing
export { calculatePricing, generateQuoteSummary };
