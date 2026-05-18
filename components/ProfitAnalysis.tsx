'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { subscribeToAllContracts, Contract } from '@/lib/db/contracts';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { TrendingUp, DollarSign, Users, Zap } from 'lucide-react';

const PROPERTY_TYPE_RATES: Record<string, number> = {
  office: 75,
  warehouse: 65,
  retail: 70,
  medical: 90,
  restaurant: 80,
  school: 62,
  other: 70,
};

const FREQUENCY_VISITS: Record<string, number> = {
  daily: 22,
  'twice-weekly': 8,
  weekly: 4,
  'bi-weekly': 2,
  monthly: 1,
  'one-time': 0.5,
};

export default function ProfitAnalysis() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    const unsub1 = subscribeToAllContracts((allContracts) => {
      const activeContracts = allContracts.filter(c => c.status === 'active');
      setContracts(activeContracts);
      if (!selectedContract && activeContracts.length > 0) {
        setSelectedContract(activeContracts[0]);
      }
    });
    const unsub2 = subscribeToAllUsers(setUsers);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const getClientProfile = (clientId: string): UserProfile | null => {
    return users.find(u => u.id === clientId) || null;
  };

  const getSubcontractorProfile = (subId: string): UserProfile | null => {
    return users.find(u => u.id === subId) || null;
  };

  const calculateMonthly = (contract: Contract) => {
    const clientProfile = getClientProfile(contract.clientId);
    const subProfile = getSubcontractorProfile(contract.subcontractorId);

    // Charge rate: from contract, or based on property type
    const chargeRate = contract.chargeRate || PROPERTY_TYPE_RATES[clientProfile?.propertyType || 'other'] || 70;

    // Sub rate: from contract, or from subcontractor's baseHourlyRate
    const subRate = contract.subcontractorRate || subProfile?.baseHourlyRate || 0;

    // Hours per visit: from contract, or 3 as default
    const hoursPerVisit = contract.estimatedHoursPerVisit || 3;

    // Visits per month: from contract, or based on cleaning frequency
    const visitsPerMonth = contract.visitsPerMonth || FREQUENCY_VISITS[clientProfile?.cleaningFrequency || 'weekly'] || 4;

    // Overhead percent
    const overheadPct = contract.overheadPercent || 10;

    const monthlyRevenue = chargeRate * hoursPerVisit * visitsPerMonth;
    const monthlySubCost = subRate * hoursPerVisit * visitsPerMonth;
    const overhead = monthlyRevenue > 0 ? (monthlyRevenue - monthlySubCost) * (overheadPct / 100) : 0;
    const grossProfit = monthlyRevenue - monthlySubCost;
    const netProfit = grossProfit - overhead;

    return { monthlyRevenue, monthlySubCost, overhead, grossProfit, netProfit, chargeRate, subRate, hoursPerVisit, visitsPerMonth };
  };

  const calculateContractTotal = (contract: Contract) => {
    if (!contract.startDate || !contract.endDate) return null;

    try {
      const start = new Date(contract.startDate);
      const end = new Date(contract.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      const monthlyPnL = calculateMonthly(contract);

      return {
        months: Math.max(1, months),
        totalRevenue: monthlyPnL.monthlyRevenue * months,
        totalSubCost: monthlyPnL.monthlySubCost * months,
        totalGrossProfit: monthlyPnL.grossProfit * months,
      };
    } catch {
      return null;
    }
  };

  const calculateActualProgress = (contract: Contract) => {
    const totalHours = contract.totalHoursCompleted || 0;
    const actualRevenue = contract.actualRevenue || 0;
    const actualSubCost = contract.actualSubcontractorCost || 0;
    const actualGrossProfit = actualRevenue - actualSubCost;

    return { totalHours, actualRevenue, actualSubCost, actualGrossProfit };
  };

  const selected = selectedContract || contracts[0];
  const monthly = selected ? calculateMonthly(selected) : null;
  const contractTotal = selected ? calculateContractTotal(selected) : null;
  const actual = selected ? calculateActualProgress(selected) : null;

  return (
    <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30">
      <h2 className="text-2xl font-bold text-white mb-8">Profit & Loss Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Contract List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-4">Contracts</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {contracts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No contracts found</p>
            ) : (
              contracts.map((contract) => {
                const pnl = calculateMonthly(contract);
                return (
                  <button
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className={`w-full p-3 rounded-lg border transition-all text-left text-sm ${
                      selected?.id === contract.id
                        ? 'bg-reset-green/20 border-reset-green/50'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-bold text-white truncate">
                      {contract.clientName} / {contract.subcontractorName}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{contract.type}</p>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        contract.status === 'active' ? 'bg-reset-green/20 text-reset-green' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {contract.status}
                      </span>
                      <span className="text-reset-green font-bold">
                        ${pnl.netProfit.toFixed(0)}/mo
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detail View */}
        {selected && monthly && (
          <div className="lg:col-span-3">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-white">{selected.clientName}</h3>
                <p className="text-sm text-gray-400 mt-1">Service Provider: {selected.subcontractorName}</p>
                <p className="text-sm text-gray-400 mt-1">{selected.type} • {selected.status}</p>
              </div>

              {/* Projected Monthly Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-2">
                    <DollarSign size={16} />
                    MONTHLY REVENUE
                  </div>
                  <p className="text-2xl font-bold text-white">${monthly.monthlyRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    ${selected.chargeRate}/hr × {selected.estimatedHoursPerVisit}h × {selected.visitsPerMonth}x/month
                  </p>
                </div>

                <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-2">
                    <Users size={16} />
                    MONTHLY SUB COST
                  </div>
                  <p className="text-2xl font-bold text-white">${monthly.monthlySubCost.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    ${selected.subcontractorRate}/hr × {selected.estimatedHoursPerVisit}h × {selected.visitsPerMonth}x/month
                  </p>
                </div>

                <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold mb-2">
                    <Zap size={16} />
                    MONTHLY GROSS PROFIT
                  </div>
                  <p className="text-2xl font-bold text-white">${monthly.grossProfit.toFixed(2)}</p>
                </div>

                <div className="p-4 bg-reset-green/20 rounded-lg border border-reset-green/50">
                  <div className="flex items-center gap-2 text-reset-green text-xs font-bold mb-2">
                    <TrendingUp size={16} />
                    MONTHLY NET PROFIT
                  </div>
                  <p className="text-2xl font-bold text-white">${monthly.netProfit.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">After {selected.overheadPercent}% overhead</p>
                </div>
              </div>

              {/* Actuals Section */}
              {actual && actual.totalHours > 0 && (
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-bold text-white mb-4">Actuals So Far</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total Hours Completed</p>
                      <p className="text-lg font-bold text-white">{actual.totalHours}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Revenue Earned</p>
                      <p className="text-lg font-bold text-reset-green">${actual.actualRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Sub Cost Paid</p>
                      <p className="text-lg font-bold text-red-400">${actual.actualSubCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Gross Profit So Far</p>
                      <p className="text-lg font-bold text-yellow-400">${actual.actualGrossProfit.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Breakdown Table */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-bold text-white mb-4">Full Cost Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-gray-400 font-bold">Item</th>
                        <th className="text-right py-2 text-gray-400 font-bold">Rate</th>
                        <th className="text-right py-2 text-gray-400 font-bold">Est./Month</th>
                        <th className="text-right py-2 text-gray-400 font-bold">Value</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      <tr className="border-b border-gray-700">
                        <td className="py-2 text-gray-300">Client Charge</td>
                        <td className="text-right text-gray-300">${selected.chargeRate}/hr</td>
                        <td className="text-right text-gray-300">{selected.estimatedHoursPerVisit}h × {selected.visitsPerMonth}x</td>
                        <td className="text-right font-bold text-reset-green">${monthly.monthlyRevenue.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2 text-gray-300">Subcontractor Cost</td>
                        <td className="text-right text-gray-300">${selected.subcontractorRate}/hr</td>
                        <td className="text-right text-gray-300">{selected.estimatedHoursPerVisit}h × {selected.visitsPerMonth}x</td>
                        <td className="text-right font-bold text-red-400">-${monthly.monthlySubCost.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2 text-gray-300">Overhead ({selected.overheadPercent}%)</td>
                        <td className="text-right text-gray-300">—</td>
                        <td className="text-right text-gray-300">—</td>
                        <td className="text-right font-bold text-red-400">-${monthly.overhead.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-reset-green/10">
                        <td className="py-2 font-bold text-white">Gross Profit</td>
                        <td className="text-right"></td>
                        <td className="text-right"></td>
                        <td className="text-right font-bold text-reset-green">${monthly.grossProfit.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-reset-green/20">
                        <td className="py-2 font-bold text-white">Net Profit</td>
                        <td className="text-right"></td>
                        <td className="text-right"></td>
                        <td className="text-right font-bold text-reset-green text-lg">${monthly.netProfit.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-400">Margin</td>
                        <td className="text-right"></td>
                        <td className="text-right"></td>
                        <td className="text-right text-gray-300 font-bold">
                          {monthly.monthlyRevenue > 0 ? ((monthly.netProfit / monthly.monthlyRevenue) * 100).toFixed(1) : '0'}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Contract Term Totals */}
              {contractTotal && (
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h4 className="font-bold text-white mb-4">Contract Term Totals ({contractTotal.months} months)</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Total Revenue</p>
                      <p className="text-lg font-bold text-reset-green">${contractTotal.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Sub Cost</p>
                      <p className="text-lg font-bold text-red-400">${contractTotal.totalSubCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Gross Profit</p>
                      <p className="text-lg font-bold text-yellow-400">${contractTotal.totalGrossProfit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Period</p>
                      <p className="text-lg font-bold text-white">{selected.startDate} → {selected.endDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
