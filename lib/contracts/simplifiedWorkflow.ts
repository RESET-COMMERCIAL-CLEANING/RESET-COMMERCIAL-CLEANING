// Simplified contract workflow: Generate → Sign → Approve

import { Contract, ContractVersion } from '@/lib/db/contracts';
import { updateContract } from '@/lib/db/contracts';
import { Timestamp } from 'firebase/firestore';
import { calculatePricing, type PricingCalculationInput } from '@/lib/pricing/pricingCalculator';

/**
 * Generate contract PDF and create v1 version
 */
export async function generateContractVersion(params: {
  contract: Contract;
  pricingInput?: PricingCalculationInput;
  changes?: string; // Description of changes from previous version
}): Promise<ContractVersion> {
  const { contract, pricingInput, changes } = params;

  // Calculate pricing if provided
  let pricingSnapshot = undefined;
  if (pricingInput) {
    const pricing = calculatePricing(pricingInput);
    pricingSnapshot = {
      monthlyPrice: pricing.monthlyRate,
      annualPrice: pricing.annualRate,
      pricingTier: pricingInput.pricingTier,
      breakdown: JSON.stringify(pricing.breakdown),
    };
  }

  const newVersion: ContractVersion = {
    version: (contract.currentVersion || 0) + 1,
    generatedAt: Timestamp.now(),
    generatedBy: 'superuser',
    pricingSnapshot,
    changes,
  };

  return newVersion;
}

/**
 * Upload signed contract for a version
 */
export async function uploadSignedContract(params: {
  contractId: string;
  version: number;
  signedDocumentUrl: string;
  signedBy: string;
}): Promise<void> {
  const { contractId, version, signedDocumentUrl, signedBy } = params;

  // This would update the contract version with signed document
  // Implementation would involve updating the versions array in Firestore
  await updateContract(contractId, {
    status: 'signed',
    updatedAt: Timestamp.now(),
  });
}

/**
 * Mark contract as ready for approval
 * (Called after both business owner AND subcontractor have signed)
 */
export async function markReadyForApproval(contractId: string): Promise<void> {
  await updateContract(contractId, {
    status: 'ready-for-approval',
    updatedAt: Timestamp.now(),
  });
}

/**
 * Approve contract and transition to active
 */
export async function approveContract(params: {
  contractId: string;
  approvalNotes?: string;
}): Promise<void> {
  const { contractId, approvalNotes } = params;

  await updateContract(contractId, {
    status: 'approved',
    approvedAt: Timestamp.now(),
    approvalNotes,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Create new version of contract (when superuser makes changes)
 * This triggers re-signing process
 */
export async function createNewContractVersion(params: {
  contractId: string;
  contract: Contract;
  pricingInput?: PricingCalculationInput;
  changes: string; // Description of what changed
}): Promise<void> {
  const { contractId, contract, pricingInput, changes } = params;

  const newVersion = await generateContractVersion({
    contract,
    pricingInput,
    changes,
  });

  await updateContract(contractId, {
    currentVersion: newVersion.version,
    status: 'generated', // Reset to generated for re-signing
    versions: [...(contract.versions || []), newVersion],
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get contract status summary
 */
export function getContractStatusSummary(contract: Contract): {
  currentStatus: string;
  businessOwnerSigned: boolean;
  subcontractorSigned: boolean;
  readyForApproval: boolean;
  isApproved: boolean;
} {
  // This would check if both parties have signed for the current version
  // Implementation details depend on how you track dual signatures

  return {
    currentStatus: contract.status,
    businessOwnerSigned: !!contract.versions?.[contract.currentVersion - 1]?.signedAt,
    subcontractorSigned: !!contract.versions?.[contract.currentVersion - 1]?.signedAt,
    readyForApproval: contract.status === 'ready-for-approval',
    isApproved: contract.status === 'approved',
  };
}
