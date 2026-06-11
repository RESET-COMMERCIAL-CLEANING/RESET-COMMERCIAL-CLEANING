'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Contract } from '@/lib/db/contracts';

interface Step {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

interface ContractApprovalChecklistProps {
  contract: Contract;
  signedContractUrl?: string;
}

export default function ContractApprovalChecklist({
  contract,
  signedContractUrl,
}: ContractApprovalChecklistProps) {
  const steps: Step[] = [
    {
      id: 'info-review',
      label: 'Information Review',
      description: 'Review all contract information',
      completed: contract.status !== 'under-review',
      current: contract.status === 'under-review',
    },
    {
      id: 'generate-contract',
      label: 'Generate Contract',
      description: 'Generate contract PDF document',
      completed: ['generated', 'awaiting-signature', 'signed', 'ready-for-approval', 'approved', 'rejected'].includes(contract.status),
      current: contract.status === 'generated',
    },
    {
      id: 'pricing',
      label: 'Pricing Review',
      description: 'Review and finalize pricing with profit margin',
      completed: ['awaiting-signature', 'signed', 'ready-for-approval', 'approved', 'rejected'].includes(contract.status),
      current: contract.status === 'generated',
    },
    {
      id: 'sign-upload',
      label: 'Sign & Upload Contract',
      description: `Upload signed contract${signedContractUrl ? ' ✓' : ''}`,
      completed: ['signed', 'ready-for-approval', 'approved', 'rejected'].includes(contract.status),
      current: contract.status === 'awaiting-signature' || (contract.status === 'generated' && !signedContractUrl),
    },
    {
      id: 'approval',
      label: 'Final Approval',
      description: 'Approve contract and move to assignment',
      completed: contract.status === 'approved',
      current: contract.status === 'signed' || contract.status === 'ready-for-approval',
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-reset-green/10 to-reset-green/5 border border-reset-green/30 rounded-lg p-6 mb-6"
    >
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Clock size={18} className="text-reset-green" />
        Contract Approval Progress
      </h3>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">
            {completedSteps} of {steps.length} steps completed
          </span>
          <span className="text-sm font-bold text-reset-green">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-reset-green to-reset-green/60"
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-4 p-3 rounded-lg transition-colors ${
              step.completed
                ? 'bg-reset-green/10'
                : step.current
                ? 'bg-yellow-500/10 border border-yellow-500/30'
                : 'bg-gray-800/30'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-reset-green" />
              ) : step.current ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                  <Clock className="w-5 h-5 text-yellow-400" />
                </motion.div>
              ) : (
                <Circle className="w-5 h-5 text-gray-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${step.completed ? 'text-reset-green' : step.current ? 'text-yellow-400' : 'text-gray-400'}`}>
                {step.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Action */}
      {contract.status !== 'approved' && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <span className="font-semibold">Next:</span>{' '}
            {contract.status === 'under-review'
              ? 'Generate contract PDF and review all information'
              : contract.status === 'generated'
              ? 'Download pricing PDF and review pricing with margins'
              : contract.status === 'awaiting-signature' || !signedContractUrl
              ? 'Upload signed contract PDF'
              : contract.status === 'signed' || contract.status === 'ready-for-approval'
              ? 'Approve contract to proceed with assignment'
              : 'Waiting for approval'}
          </p>
        </div>
      )}

      {contract.status === 'approved' && (
        <div className="mt-4 p-3 bg-reset-green/20 border border-reset-green/30 rounded-lg">
          <p className="text-sm text-reset-green font-semibold">✓ Contract approved! Ready for assignment.</p>
        </div>
      )}
    </motion.div>
  );
}
