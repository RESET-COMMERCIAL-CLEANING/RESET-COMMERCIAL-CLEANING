'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToJobs, CleaningJob } from '@/lib/db/jobs';
import { subscribeToContractsByType, Contract } from '@/lib/db/contracts';
import { TrendingUp, DollarSign, Users, AlertCircle, Zap } from 'lucide-react';

const PROPERTY_TYPE_RATES: Record<string, number> = {
  office: 75,
  warehouse: 65,
  retail: 70,
  medical: 90,
  restaurant: 80,
  school: 62,
  other: 70,
};

interface ClientProfitData {
  clientId: string;
  clientName: string;
  propertyType?: string;
  cleaningFrequency?: string;
  totalJobs: number;
  completedJobs: CleaningJob[];
  totalRevenue: number;
  totalSubcontractorCost: number;
  grossProfit: number;
  subcontractorBreakdown: Record<string, {
    name: string;
    jobsCompleted: number;
    hoursWorked: number;
    costPaid: number;
  }>;
}

export default function ProfitAnalysis() {
  const [jobs, setJobs] = useState<CleaningJob[]>([]);
  const [businessOwnerContracts, setBusinessOwnerContracts] = useState<Contract[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  useEffect(() => {
    const unsub1 = subscribeToJobs(setJobs);
    const unsub2 = subscribeToContractsByType('business-owner', setBusinessOwnerContracts);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Get client name from contract
  const getClientName = (clientId: string): string => {
    const contract = businessOwnerContracts.find(c => c.userId === clientId);
    return contract?.company || 'Unknown Client';
  };

  const getClientPropertyType = (clientId: string): string | undefined => {
    const contract = businessOwnerContracts.find(c => c.userId === clientId);
    return contract?.propertyType;
  };

  const getClientFrequency = (clientId: string): string | undefined => {
    const contract = businessOwnerContracts.find(c => c.userId === clientId);
    return contract?.cleaningFrequency;
  };

  // Calculate P&L for all clients
  const calculateAllClientsProfit = (): ClientProfitData[] => {
    const clientMap: Record<string, ClientProfitData> = {};

    // Get unique client IDs from completed jobs
    const completedJobs = jobs.filter(j => j.status === 'completed' && j.completedBySubId);

    completedJobs.forEach(job => {
      if (!clientMap[job.contractId]) {
        clientMap[job.contractId] = {
          clientId: job.contractId,
          clientName: getClientName(job.contractId),
          propertyType: getClientPropertyType(job.contractId),
          cleaningFrequency: getClientFrequency(job.contractId),
          totalJobs: 0,
          completedJobs: [],
          totalRevenue: 0,
          totalSubcontractorCost: 0,
          grossProfit: 0,
          subcontractorBreakdown: {},
        };
      }

      const client = clientMap[job.contractId];
      client.completedJobs.push(job);
      client.totalJobs += 1;

      // Use job.rate as charge rate (what we charged the client)
      const chargeAmount = job.rate * job.duration;
      client.totalRevenue += chargeAmount;

      // Use job.subcontractorRate or fallback to rate
      const subRate = job.subcontractorRate || job.rate;
      const subCost = subRate * job.duration;
      client.totalSubcontractorCost += subCost;

      // Track by subcontractor
      if (job.completedBySubId) {
        if (!client.subcontractorBreakdown[job.completedBySubId]) {
          client.subcontractorBreakdown[job.completedBySubId] = {
            name: job.subcontractorName || 'Unknown',
            jobsCompleted: 0,
            hoursWorked: 0,
            costPaid: 0,
          };
        }
        const subBreakdown = client.subcontractorBreakdown[job.completedBySubId];
        subBreakdown.jobsCompleted += 1;
        subBreakdown.hoursWorked += job.duration;
        subBreakdown.costPaid += subCost;
      }
    });

    // Calculate gross profit
    Object.values(clientMap).forEach(client => {
      client.grossProfit = client.totalRevenue - client.totalSubcontractorCost;
    });

    return Object.values(clientMap);
  };

  const clientProfits = calculateAllClientsProfit();
  const selectedClient = selectedClientId
    ? clientProfits.find(c => c.clientId === selectedClientId)
    : clientProfits[0];

  return (
    <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30">
      <h2 className="text-2xl font-bold text-white mb-8">Profit & Loss Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Client List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-4">Clients</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clientProfits.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No completed jobs yet</p>
            ) : (
              clientProfits.map((client) => (
                <button
                  key={client.clientId}
                  onClick={() => setSelectedClientId(client.clientId)}
                  className={`w-full p-3 rounded-lg border transition-all text-left text-sm ${
                    selectedClient?.clientId === client.clientId
                      ? 'bg-reset-green/20 border-reset-green/50'
                      : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="font-bold text-white truncate">{client.clientName}</div>
                  <p className="text-xs text-gray-400 truncate">{client.totalJobs} completed jobs</p>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gray-400">{client.propertyType || 'Property'}</span>
                    <span className="text-reset-green font-bold">
                      ${client.grossProfit.toFixed(0)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Detail View */}
        {selectedClient && (
          <div className="lg:col-span-3">
            <motion.div
              key={selectedClient.clientId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white">{selectedClient.clientName}</h3>
                <p className="text-sm text-gray-400 mt-1">Property Type: {selectedClient.propertyType || '—'}</p>
                <p className="text-sm text-gray-400">Cleaning Frequency: {selectedClient.cleaningFrequency || '—'}</p>
                <p className="text-sm text-gray-400 mt-1">{selectedClient.totalJobs} completed jobs</p>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
                    <DollarSign size={16} />
                    TOTAL REVENUE
                  </div>
                  <p className="text-2xl font-bold text-white">${selectedClient.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">{selectedClient.totalJobs} jobs</p>
                </div>

                <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-2">
                    <Users size={16} />
                    TOTAL SUB COST
                  </div>
                  <p className="text-2xl font-bold text-white">${selectedClient.totalSubcontractorCost.toFixed(2)}</p>
                </div>

                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold mb-2">
                    <Zap size={16} />
                    GROSS PROFIT
                  </div>
                  <p className="text-2xl font-bold text-white">${selectedClient.grossProfit.toFixed(2)}</p>
                </div>

                <div className="p-4 bg-reset-green/20 rounded-lg border border-reset-green/50">
                  <div className="flex items-center gap-2 text-reset-green text-xs font-bold mb-2">
                    <TrendingUp size={16} />
                    MARGIN
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {selectedClient.totalRevenue > 0
                      ? ((selectedClient.grossProfit / selectedClient.totalRevenue) * 100).toFixed(1)
                      : '0'}%
                  </p>
                </div>
              </div>

              {/* Subcontractor Breakdown */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={18} />
                  Service Provider Breakdown
                </h4>
                <div className="space-y-3">
                  {Object.values(selectedClient.subcontractorBreakdown).length === 0 ? (
                    <p className="text-gray-400 text-sm">No service provider data</p>
                  ) : (
                    Object.entries(selectedClient.subcontractorBreakdown).map(([subId, breakdown]) => (
                      <div key={subId} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-white">{breakdown.name}</p>
                            <p className="text-xs text-gray-400">{breakdown.jobsCompleted} jobs</p>
                          </div>
                          <p className="text-lg font-bold text-red-400">-${breakdown.costPaid.toFixed(2)}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-400">Hours Worked: <span className="text-white">{breakdown.hoursWorked}h</span></div>
                          <div className="text-gray-400">Avg Rate: <span className="text-white">${(breakdown.costPaid / breakdown.hoursWorked).toFixed(2)}/hr</span></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Completed Jobs List */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-bold text-white mb-4">Completed Jobs</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedClient.completedJobs.length === 0 ? (
                    <p className="text-gray-400 text-sm">No completed jobs</p>
                  ) : (
                    selectedClient.completedJobs.map((job) => (
                      <div key={job.id} className="p-3 bg-gray-800/50 rounded border border-gray-700 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">{job.type}</p>
                            <p className="text-xs text-gray-400">
                              {job.location} • {job.duration}h
                            </p>
                            <p className="text-xs text-gray-400">
                              by {job.subcontractorName || 'Unknown'} • {job.completedAt ? new Date(job.completedAt.seconds * 1000).toLocaleDateString() : '—'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-reset-green">${(job.rate * job.duration).toFixed(2)}</p>
                            <p className="text-xs text-red-400">-${((job.subcontractorRate || job.rate) * job.duration).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
