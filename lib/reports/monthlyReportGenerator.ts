// Monthly report generation with assignment tracking and P&L impact

import { CleaningJob } from '@/lib/db/jobs';
import { Contract } from '@/lib/db/contracts';
import { getJobAssignmentHistory } from '@/lib/db/jobs';

export interface SubcontractorPerformance {
  subcontractorId: string;
  subcontractorName: string;
  jobsCompleted: number;
  totalEarnings: number;
  averageRating: number;
  hoursWorked: number;
}

export interface AssignmentChange {
  date: Date;
  fromSubcontractor: string;
  toSubcontractor: string;
  reason?: string;
  jobsImpacted: number;
}

export interface MonthlyReportData {
  month: string;
  year: number;
  totalJobs: number;
  completedJobs: number;
  totalSpent: number;
  averageJobCost: number;
  subcontractorPerformance: SubcontractorPerformance[];
  assignmentChanges: AssignmentChange[];
  pAndLImpact: {
    originalEstimate: number;
    actualCost: number;
    variance: number;
    variancePercentage: number;
  };
  topPerformers: SubcontractorPerformance[];
  leastPerformers: SubcontractorPerformance[];
}

/**
 * Generate comprehensive monthly report with assignment tracking
 */
export async function generateMonthlyReport(params: {
  jobs: CleaningJob[];
  contract: Contract;
  month: number; // 0-11
  year: number;
}): Promise<MonthlyReportData> {
  const { jobs, contract, month, year } = params;

  // Filter jobs for this month
  const monthlyJobs = jobs.filter((job) => {
    const jobDate = job.scheduledDate instanceof Date
      ? job.scheduledDate
      : job.scheduledDate.toDate();
    return jobDate.getMonth() === month && jobDate.getFullYear() === year;
  });

  // Calculate basic metrics
  const completedJobs = monthlyJobs.filter((job) => job.status === 'completed');
  const totalSpent = completedJobs.reduce((sum, job) => sum + job.rate * job.duration, 0);
  const averageJobCost = completedJobs.length > 0 ? totalSpent / completedJobs.length : 0;

  // Track subcontractor performance
  const performanceMap = new Map<string, SubcontractorPerformance>();

  for (const job of completedJobs) {
    const subId = job.completedBySubId || job.subcontractorId;
    const subName = job.subcontractorName || 'Unknown';

    if (!performanceMap.has(subId)) {
      performanceMap.set(subId, {
        subcontractorId: subId,
        subcontractorName: subName,
        jobsCompleted: 0,
        totalEarnings: 0,
        averageRating: 0,
        hoursWorked: 0,
      });
    }

    const perf = performanceMap.get(subId)!;
    perf.jobsCompleted += 1;
    perf.totalEarnings += job.rate * job.duration;
    perf.hoursWorked += job.duration;
  }

  const subcontractorPerformance = Array.from(performanceMap.values());

  // Track assignment changes
  const assignmentChanges: AssignmentChange[] = [];
  for (const job of monthlyJobs) {
    if (job.reassignmentHistory && job.reassignmentHistory.length > 0) {
      job.reassignmentHistory.forEach((change) => {
        const changeDate = change.reassignedAt instanceof Date
          ? change.reassignedAt
          : change.reassignedAt.toDate();

        if (changeDate.getMonth() === month && changeDate.getFullYear() === year) {
          assignmentChanges.push({
            date: changeDate,
            fromSubcontractor: change.from,
            toSubcontractor: change.to,
            reason: change.reason,
            jobsImpacted: 1,
          });
        }
      });
    }
  }

  // Calculate P&L impact
  const originalEstimate = monthlyJobs.length * averageJobCost;
  const actualCost = totalSpent;
  const variance = originalEstimate - actualCost;
  const variancePercentage = originalEstimate > 0 ? (variance / originalEstimate) * 100 : 0;

  // Get top and least performers
  const sorted = [...subcontractorPerformance].sort((a, b) => b.totalEarnings - a.totalEarnings);
  const topPerformers = sorted.slice(0, 3);
  const leastPerformers = sorted.slice(-3).reverse();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return {
    month: monthNames[month],
    year,
    totalJobs: monthlyJobs.length,
    completedJobs: completedJobs.length,
    totalSpent,
    averageJobCost,
    subcontractorPerformance,
    assignmentChanges,
    pAndLImpact: {
      originalEstimate,
      actualCost,
      variance,
      variancePercentage,
    },
    topPerformers,
    leastPerformers,
  };
}

/**
 * Generate P&L report for a specific period
 */
export async function generatePLReport(params: {
  jobs: CleaningJob[];
  startDate: Date;
  endDate: Date;
}): Promise<{
  period: string;
  totalJobs: number;
  totalSpent: number;
  profitMargin: number;
  costPerJob: number;
  subcontractorBreakdown: Array<{ name: string; earnings: number; jobsCompleted: number }>;
}> {
  const { jobs, startDate, endDate } = params;

  const periodJobs = jobs.filter((job) => {
    const jobDate = job.scheduledDate instanceof Date
      ? job.scheduledDate
      : job.scheduledDate.toDate();
    return jobDate >= startDate && jobDate <= endDate;
  });

  const completedJobs = periodJobs.filter((job) => job.status === 'completed');
  const totalSpent = completedJobs.reduce((sum, job) => sum + job.rate * job.duration, 0);
  const costPerJob = completedJobs.length > 0 ? totalSpent / completedJobs.length : 0;

  // Build subcontractor breakdown
  const subBreakdown = new Map<string, { earnings: number; jobs: number }>();
  completedJobs.forEach((job) => {
    const subName = job.subcontractorName || 'Unknown';
    if (!subBreakdown.has(subName)) {
      subBreakdown.set(subName, { earnings: 0, jobs: 0 });
    }
    const entry = subBreakdown.get(subName)!;
    entry.earnings += job.rate * job.duration;
    entry.jobs += 1;
  });

  const breakdown = Array.from(subBreakdown.entries()).map(([name, data]) => ({
    name,
    earnings: data.earnings,
    jobsCompleted: data.jobs,
  }));

  // Estimate profit margin (assuming 30% markup on labor)
  const profitMargin = totalSpent > 0 ? (totalSpent * 0.3) / (totalSpent * 1.3) * 100 : 0;

  const period = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return {
    period,
    totalJobs: completedJobs.length,
    totalSpent,
    profitMargin,
    costPerJob,
    subcontractorBreakdown: breakdown,
  };
}

/**
 * Calculate impact of reassignments on costs
 */
export function calculateReassignmentImpact(params: {
  assignmentChanges: AssignmentChange[];
  subcontractorRates: Map<string, number>; // Map of subcontractor ID to hourly rate
  jobsPerChange?: number; // Average jobs per change
}): {
  totalChanges: number;
  estimatedImpact: number;
  riskScore: number; // 0-100, higher = more risk of cost overruns
} {
  const { assignmentChanges, subcontractorRates, jobsPerChange = 1 } = params;

  let totalImpact = 0;

  assignmentChanges.forEach((change) => {
    const fromRate = subcontractorRates.get(change.fromSubcontractor) || 0;
    const toRate = subcontractorRates.get(change.toSubcontractor) || 0;
    const rateDifference = toRate - fromRate;
    totalImpact += rateDifference * jobsPerChange * 4; // Assuming 4 hour jobs
  });

  // Calculate risk score (higher reassignments = higher risk)
  const riskScore = Math.min(100, assignmentChanges.length * 10 + (totalImpact > 0 ? 20 : 0));

  return {
    totalChanges: assignmentChanges.length,
    estimatedImpact: totalImpact,
    riskScore,
  };
}

/**
 * Format report for display
 */
export function formatMonthlyReport(report: MonthlyReportData): string {
  const lines = [
    `MONTHLY REPORT - ${report.month} ${report.year}`,
    `${'='.repeat(50)}`,
    '',
    `Total Jobs: ${report.totalJobs}`,
    `Completed: ${report.completedJobs}`,
    `Total Spent: $${report.totalSpent.toFixed(2)}`,
    `Average Cost/Job: $${report.averageJobCost.toFixed(2)}`,
    '',
    'P&L Impact:',
    `  Original Estimate: $${report.pAndLImpact.originalEstimate.toFixed(2)}`,
    `  Actual Cost: $${report.pAndLImpact.actualCost.toFixed(2)}`,
    `  Variance: $${report.pAndLImpact.variance.toFixed(2)} (${report.pAndLImpact.variancePercentage.toFixed(1)}%)`,
    '',
    'Subcontractor Performance:',
    ...report.subcontractorPerformance.map(
      (p) => `  ${p.subcontractorName}: ${p.jobsCompleted} jobs, $${p.totalEarnings.toFixed(2)}`
    ),
    '',
    'Assignment Changes:',
    ...report.assignmentChanges.map(
      (a) =>
        `  ${a.date.toLocaleDateString()}: ${a.fromSubcontractor} → ${a.toSubcontractor}${
          a.reason ? ` (${a.reason})` : ''
        }`
    ),
  ];

  return lines.join('\n');
}
