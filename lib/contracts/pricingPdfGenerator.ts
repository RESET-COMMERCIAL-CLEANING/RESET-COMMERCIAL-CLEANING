// Generate pricing explanation PDF for superuser

import { Contract } from '@/lib/db/contracts';
import { calculatePricing, type PricingCalculationInput } from '@/lib/pricing/pricingCalculator';

/**
 * Generate HTML pricing explanation for PDF
 */
export function generatePricingExplanationHTML(params: {
  contract: Contract;
  pricingInput: PricingCalculationInput;
  companyName?: string;
}): string {
  const { contract, pricingInput, companyName } = params;

  const pricing = calculatePricing(pricingInput);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            background: white;
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
          }

          .header {
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .header h1 {
            color: #10b981;
            font-size: 28px;
            margin-bottom: 5px;
          }

          .header p {
            color: #666;
            font-size: 14px;
          }

          .section {
            margin-bottom: 30px;
          }

          .section h2 {
            color: #1f2937;
            font-size: 18px;
            margin-bottom: 15px;
            border-left: 4px solid #10b981;
            padding-left: 12px;
          }

          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .info-item {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
          }

          .info-item label {
            font-weight: 600;
            color: #374151;
            font-size: 13px;
            display: block;
            margin-bottom: 4px;
          }

          .info-item value {
            color: #10b981;
            font-size: 16px;
            font-weight: 500;
          }

          .breakdown-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .breakdown-table th {
            background: #10b981;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
          }

          .breakdown-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }

          .breakdown-table tr:nth-child(even) {
            background: #f9fafb;
          }

          .breakdown-table .label {
            color: #374151;
          }

          .breakdown-table .value {
            text-align: right;
            color: #10b981;
            font-weight: 500;
          }

          .summary-box {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }

          .summary-row.total {
            border-top: 2px solid #10b981;
            padding-top: 12px;
            font-weight: 600;
            color: #10b981;
          }

          .summary-label {
            color: #374151;
          }

          .summary-value {
            color: #10b981;
            font-weight: 500;
          }

          .notes {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #92400e;
            margin-top: 20px;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pricing Calculation Breakdown</h1>
            <p>Contract ID: ${contract.id}</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Service Details</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Client / Company</label>
                <value>${companyName || contract.company || 'N/A'}</value>
              </div>
              <div class="info-item">
                <label>Property Type</label>
                <value>${pricingInput.propertyType}</value>
              </div>
              <div class="info-item">
                <label>Cleaning Type</label>
                <value>${pricingInput.cleaningType}</value>
              </div>
              <div class="info-item">
                <label>Frequency</label>
                <value>${pricingInput.frequency}</value>
              </div>
              <div class="info-item">
                <label>Number of Floors</label>
                <value>${pricingInput.numberOfFloors}</value>
              </div>
              <div class="info-item">
                <label>Distance from Hub</label>
                <value>${pricingInput.distanceKm || 'N/A'} km</value>
              </div>
              <div class="info-item">
                <label>Properties</label>
                <value>${pricingInput.numProperties}</value>
              </div>
              <div class="info-item">
                <label>Contract Duration</label>
                <value>${pricingInput.contractMonths} months</value>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Pricing Breakdown</h2>
            <table class="breakdown-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${pricing.breakdown
                  .map(
                    (item) => `
                  <tr>
                    <td class="label">${item.category}</td>
                    <td class="value">$${item.amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Final Pricing</h2>
            <div class="summary-box">
              <div class="summary-row">
                <span class="summary-label">Per-Visit Rate:</span>
                <span class="summary-value">$${pricing.perVisitRate.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Monthly Rate (${pricingInput.frequency === 'daily' ? '22 visits' : pricingInput.frequency === 'weekly' ? '4 visits' : '1 visit'}):</span>
                <span class="summary-value">$${pricing.monthlyRate.toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                <span class="summary-label">Annual Rate:</span>
                <span class="summary-value">$${pricing.annualRate.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="notes">
            <strong>Note:</strong> This pricing is based on the RESET Cleaning Services pricing matrix as of ${new Date().getFullYear()}.
            Actual pricing may vary based on special requirements, market conditions, or agreed-upon adjustments.
          </div>

          <div class="footer">
            <p>This document is for internal use and should not be shared directly with clients.</p>
            <p>For questions about pricing, contact the RESET Finance team.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Download pricing PDF
 */
export async function downloadPricingPDF(params: {
  contract: Contract;
  pricingInput: PricingCalculationInput;
  companyName?: string;
}): Promise<void> {
  const html = generatePricingExplanationHTML(params);

  // Create a blob from the HTML
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Use print-to-PDF approach (browser built-in)
  const win = window.open(url);
  if (win) {
    win.print();
  }

  // Cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
