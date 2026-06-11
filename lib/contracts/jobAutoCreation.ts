// Auto-create jobs from contract assignments

import { Contract } from '@/lib/db/contracts';
import { createJobFromContractAssignment, CleaningJob } from '@/lib/db/jobs';
import { generateChecklist, type GeneratedChecklist } from '@/lib/contracts/checklistGenerator';
import { Timestamp } from 'firebase/firestore';

export interface AutoCreationResult {
  success: boolean;
  jobsCreated: string[];
  errors: string[];
}

/**
 * Auto-create initial job(s) from contract assignment
 * Based on cleaning frequency, creates one or more job entries
 */
export async function autoCreateJobsFromContract(params: {
  contract: Contract;
  subcontractorId: string;
  subcontractorName: string;
  clientId?: string;
}): Promise<AutoCreationResult> {
  const { contract, subcontractorId, subcontractorName, clientId } = params;

  const result: AutoCreationResult = {
    success: true,
    jobsCreated: [],
    errors: [],
  };

  try {
    // Determine how many jobs to create based on frequency
    const jobsToCreate = getJobCountFromFrequency(contract.cleaningFrequency || 'weekly');

    // Create initial job(s)
    for (let i = 0; i < jobsToCreate; i++) {
      try {
        const job = await createInitialJob({
          contract,
          subcontractorId,
          subcontractorName,
          clientId,
          jobIndex: i,
        });

        result.jobsCreated.push(job.id);
      } catch (error) {
        result.errors.push(`Failed to create job ${i + 1}: ${String(error)}`);
        result.success = false;
      }
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Auto-creation failed: ${String(error)}`);
    return result;
  }
}

/**
 * Determine how many initial jobs to create based on frequency
 */
function getJobCountFromFrequency(frequency: string): number {
  switch (frequency?.toLowerCase()) {
    case 'daily':
      return 5; // Create 5 days of jobs
    case 'twice-weekly':
      return 2; // Create 2 jobs (for 2 cleanings)
    case 'weekly':
      return 1; // Create 1 job for this week
    case 'bi-weekly':
      return 1; // Create 1 initial job
    case 'monthly':
      return 1; // Create 1 initial job
    default:
      return 1; // Default to 1 job
  }
}

/**
 * Calculate scheduled date for a job
 */
function calculateScheduledDate(jobIndex: number, frequency: string): Timestamp {
  const now = new Date();
  let daysToAdd = 0;

  switch (frequency?.toLowerCase()) {
    case 'daily':
      daysToAdd = jobIndex; // Each day
      break;
    case 'twice-weekly':
      daysToAdd = jobIndex * 3; // Every 3 days for twice-weekly
      break;
    case 'weekly':
      daysToAdd = 7 * jobIndex; // Weekly
      break;
    case 'bi-weekly':
      daysToAdd = 14 * jobIndex; // Bi-weekly
      break;
    case 'monthly':
      daysToAdd = 30 * jobIndex; // Monthly
      break;
    default:
      daysToAdd = 7; // Default to 1 week
  }

  const scheduledDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return Timestamp.fromDate(scheduledDate);
}

/**
 * Create a single job from contract
 */
async function createInitialJob(params: {
  contract: Contract;
  subcontractorId: string;
  subcontractorName: string;
  clientId?: string;
  jobIndex: number;
}): Promise<CleaningJob> {
  const { contract, subcontractorId, subcontractorName, clientId, jobIndex } = params;

  // Generate checklist based on property type and cleaning type
  const propertyType = (contract.propertyType as any) || 'office';
  const cleaningType = 'standard'; // Initial jobs are standard, not deep clean

  const checklistData = generateChecklist(
    `job-${contract.id}-${jobIndex}`,
    contract.id,
    propertyType,
    cleaningType as any
  );

  // Convert checklist to ChecklistItem format
  const checklist = checklistData.items.map((item) => ({
    id: item.id,
    task: item.task,
    completed: false,
    requiresPhotos: item.requiresPhotos,
    beforePhoto: undefined,
    afterPhoto: undefined,
    comments: undefined,
  }));

  // Calculate scheduled date
  const scheduledDate = calculateScheduledDate(jobIndex, contract.cleaningFrequency || 'weekly');

  // Get duration (default 4 hours, could be customized per property type)
  const duration = getDurationFromPropertyType(contract.propertyType as any) || 4;

  // Get rate (from subcontractor's hourly rate, estimate)
  const rate = 65; // Default rate, could come from contract or subcontractor profile

  // Create job
  const jobData = {
    type: 'Standard Clean',
    location: contract.address || contract.suburb || 'TBD',
    address: contract.address || 'TBD',
    contractId: contract.id,
    clientId: clientId,
    clientName: contract.company || `${contract.firstName} ${contract.lastName}`,
    subcontractorId,
    subcontractorName,
    subcontractorRate: rate,
    scheduledDate,
    duration,
    rate,
    status: 'assigned' as const,
    originalAssignedSubId: subcontractorId,
  };

  const job = await createJobFromContractAssignment(jobData, checklist);

  return {
    ...job,
    checklist,
  };
}

/**
 * Get estimated job duration based on property type
 */
function getDurationFromPropertyType(propertyType: string): number {
  switch (propertyType?.toLowerCase()) {
    case 'office':
      return 4;
    case 'retail':
      return 3;
    case 'warehouse':
      return 6;
    case 'medical':
      return 5;
    case 'restaurant':
      return 5;
    case 'school':
      return 5;
    default:
      return 4;
  }
}

/**
 * Create recurring jobs based on contract frequency
 * Useful for setting up future recurring jobs
 */
export async function createRecurringJobs(params: {
  contract: Contract;
  subcontractorId: string;
  subcontractorName: string;
  clientId?: string;
  numberOfRecurrences?: number; // How many jobs to pre-create (e.g., 4 for monthly = 4 months)
}): Promise<AutoCreationResult> {
  const { contract, subcontractorId, subcontractorName, clientId, numberOfRecurrences = 4 } = params;

  const result: AutoCreationResult = {
    success: true,
    jobsCreated: [],
    errors: [],
  };

  try {
    for (let i = 0; i < numberOfRecurrences; i++) {
      try {
        const job = await createInitialJob({
          contract,
          subcontractorId,
          subcontractorName,
          clientId,
          jobIndex: i,
        });

        result.jobsCreated.push(job.id);
      } catch (error) {
        result.errors.push(`Failed to create recurring job ${i + 1}: ${String(error)}`);
        result.success = false;
      }
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(`Recurring job creation failed: ${String(error)}`);
    return result;
  }
}

/**
 * Check if auto-creation is needed
 */
export function shouldAutoCreateJobs(contract: Contract): boolean {
  // Auto-create if contract is approved and not already created
  return contract.approvalStatus === 'approved' && !contract.currentAssignedSubcontractor?.subcontractorId;
}
