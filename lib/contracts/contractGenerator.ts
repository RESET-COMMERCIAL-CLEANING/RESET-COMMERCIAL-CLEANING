// Contract PDF generation utility
// Generates professional contract documents for business owners and subcontractors

import { Contract } from '@/lib/db/contracts';
import { calculatePricing, type PricingCalculationInput } from '@/lib/pricing/pricingCalculator';

export interface ContractGenerationData {
  contract: Contract;
  pricingInput?: PricingCalculationInput;
  clientSignatureDate?: string;
  superuserName?: string;
}

/**
 * Generate HTML contract template for business owner
 */
export function generateBusinessOwnerContractHTML(data: ContractGenerationData): string {
  const { contract, pricingInput, superuserName } = data;

  const pricing = pricingInput ? calculatePricing(pricingInput) : null;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RESET Commercial Cleaning Service Agreement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3a9e68;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #3a9e68;
      margin: 0;
    }
    .header p {
      margin: 5px 0;
      color: #666;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h2 {
      color: #3a9e68;
      border-bottom: 2px solid #3a9e68;
      padding-bottom: 5px;
      margin-top: 0;
    }
    .section h3 {
      color: #444;
      margin-top: 15px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }
    .detail-item {
      background: #f9f9f9;
      padding: 10px;
      border-left: 3px solid #3a9e68;
    }
    .detail-label {
      font-weight: bold;
      color: #3a9e68;
      font-size: 0.9em;
    }
    .detail-value {
      color: #333;
      font-size: 1em;
    }
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    .pricing-table th,
    .pricing-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .pricing-table th {
      background: #f0f0f0;
      font-weight: bold;
      color: #3a9e68;
    }
    .pricing-table .total {
      font-weight: bold;
      background: #f9f9f9;
    }
    .signature-section {
      margin-top: 40px;
      page-break-inside: avoid;
    }
    .signature-line {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .signature-block {
      border-top: 1px solid #333;
      padding-top: 5px;
    }
    .signature-block label {
      font-weight: bold;
      display: block;
      margin-top: 5px;
      font-size: 0.9em;
    }
    .terms {
      font-size: 0.9em;
      color: #666;
      background: #f9f9f9;
      padding: 15px;
      border-left: 3px solid #3a9e68;
    }
    .terms ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .terms li {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>RESET COMMERCIAL CLEANING</h1>
    <p>Professional Commercial Cleaning Services</p>
    <p>Contract ID: ${contract.id}</p>
    <p>Date: ${new Date().toLocaleDateString('en-AU')}</p>
  </div>

  <div class="section">
    <h2>SERVICE AGREEMENT</h2>
    <p>This Service Agreement ("Agreement") is entered into between RESET Commercial Cleaning ("Service Provider") and the below-named business ("Client").</p>
  </div>

  <div class="section">
    <h2>CLIENT INFORMATION</h2>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Company Name</div>
        <div class="detail-value">${contract.company || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Contact Person</div>
        <div class="detail-value">${contract.primaryContactName || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Address</div>
        <div class="detail-value">${contract.address || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Phone</div>
        <div class="detail-value">${contract.primaryContactPhone || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Property Type</div>
        <div class="detail-value">${contract.propertyType || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Company Size</div>
        <div class="detail-value">${contract.companySize || 'N/A'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>SERVICE DETAILS</h2>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Property Floors</div>
        <div class="detail-value">${contract.propertyFloors || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Cleaning Frequency</div>
        <div class="detail-value">${contract.cleaningFrequency || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Preferred Time</div>
        <div class="detail-value">${contract.preferredTime || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Service Types</div>
        <div class="detail-value">${contract.serviceTypes || 'N/A'}</div>
      </div>
    </div>
    ${contract.specialRequirements ? `<p><strong>Special Requirements:</strong> ${contract.specialRequirements}</p>` : ''}
    ${contract.focusAreas ? `<p><strong>Focus Areas:</strong> ${contract.focusAreas}</p>` : ''}
  </div>

  ${pricing ? `
  <div class="section">
    <h2>PRICING</h2>
    <table class="pricing-table">
      <tr>
        <th>Description</th>
        <th style="text-align: right;">Amount</th>
      </tr>
      ${pricing.breakdown.map(item => `
      <tr>
        <td>${item.category}</td>
        <td style="text-align: right;">$${item.amount.toFixed(2)}</td>
      </tr>
      `).join('')}
      <tr class="total">
        <td>Monthly Service Fee</td>
        <td style="text-align: right;">$${pricing.monthlyRate.toFixed(2)}</td>
      </tr>
      <tr class="total">
        <td>Annual Service Cost</td>
        <td style="text-align: right;">$${pricing.annualRate.toFixed(2)}</td>
      </tr>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <h2>TERMS & CONDITIONS</h2>
    <div class="terms">
      <h3>Payment Terms</h3>
      <ul>
        <li>Monthly invoices issued on the 1st of each month</li>
        <li>Payment due Net 30 (within 30 days of invoice)</li>
        <li>Automatic monthly billing as per agreed schedule</li>
      </ul>

      <h3>Service Standards</h3>
      <ul>
        <li>All cleaning performed by trained and vetted professionals</li>
        <li>Services completed according to agreed schedule</li>
        <li>Quality assurance inspections conducted regularly</li>
        <li>Response to concerns within 24 business hours</li>
      </ul>

      <h3>Cancellation & Termination</h3>
      <ul>
        <li>Month-to-month: 14 days written notice</li>
        <li>Annual contracts: 30 days notice with potential early termination fee</li>
        <li>Immediate termination for breach of contract</li>
      </ul>

      <h3>Liability & Insurance</h3>
      <ul>
        <li>RESET maintains comprehensive liability insurance</li>
        <li>Liability limited to service fee amount</li>
        <li>Client responsible for valuables and secured items</li>
      </ul>

      <h3>General</h3>
      <ul>
        <li>This agreement is governed by the laws of New South Wales, Australia</li>
        <li>Any modifications must be in writing and signed by both parties</li>
        <li>If any provision is invalid, remaining provisions remain in effect</li>
        <li>Service Provider reserves right to decline service in unsafe conditions</li>
      </ul>
    </div>
  </div>

  <div class="signature-section">
    <h2>AUTHORIZATION</h2>
    <p>By signing below, both parties agree to the terms and conditions outlined in this Service Agreement.</p>

    <div class="signature-line">
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>Client Signature</label>
        <label>${contract.primaryContactName || 'Client Name'}</label>
      </div>
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>Date</label>
      </div>
    </div>

    <div class="signature-line">
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>RESET Authorized Representative</label>
        <label>${superuserName || 'RESET Administrator'}</label>
      </div>
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>Date</label>
      </div>
    </div>
  </div>

  <p style="margin-top: 40px; text-align: center; color: #999; font-size: 0.85em;">
    RESET Commercial Cleaning | ABN: 12 345 678 901 | www.resetcleaning.com.au
  </p>
</body>
</html>
  `.trim();

  return htmlContent;
}

/**
 * Generate HTML contract template for subcontractor
 */
export function generateSubcontractorContractHTML(data: ContractGenerationData): string {
  const { contract, superuserName } = data;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RESET Service Provider Agreement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3a9e68;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .header h1 {
      color: #3a9e68;
      margin: 0;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h2 {
      color: #3a9e68;
      border-bottom: 2px solid #3a9e68;
      padding-bottom: 5px;
      margin-top: 0;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }
    .detail-item {
      background: #f9f9f9;
      padding: 10px;
      border-left: 3px solid #3a9e68;
    }
    .detail-label {
      font-weight: bold;
      color: #3a9e68;
      font-size: 0.9em;
    }
    .detail-value {
      color: #333;
      font-size: 1em;
    }
    .terms {
      font-size: 0.9em;
      color: #666;
      background: #f9f9f9;
      padding: 15px;
      border-left: 3px solid #3a9e68;
    }
    .terms ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .signature-section {
      margin-top: 40px;
    }
    .signature-line {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .signature-block {
      border-top: 1px solid #333;
      padding-top: 5px;
    }
    .signature-block label {
      font-weight: bold;
      display: block;
      margin-top: 5px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>RESET SERVICE PROVIDER AGREEMENT</h1>
    <p>Professional Cleaning Services Partnership</p>
    <p>Agreement ID: ${contract.id}</p>
    <p>Date: ${new Date().toLocaleDateString('en-AU')}</p>
  </div>

  <div class="section">
    <h2>AGREEMENT OVERVIEW</h2>
    <p>This Service Provider Agreement ("Agreement") establishes the terms under which ${contract.firstName} ${contract.lastName} ("Service Provider") will provide cleaning services through RESET Commercial Cleaning ("Company").</p>
  </div>

  <div class="section">
    <h2>SERVICE PROVIDER INFORMATION</h2>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Full Name</div>
        <div class="detail-value">${contract.firstName} ${contract.lastName}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Email</div>
        <div class="detail-value">${contract.email || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Phone</div>
        <div class="detail-value">${contract.phone || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Service Area</div>
        <div class="detail-value">${contract.suburb || 'N/A'} (${contract.serviceAreaKm || 0}km)</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">ABN</div>
        <div class="detail-value">${contract.abn || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Base Hourly Rate</div>
        <div class="detail-value">$${contract.baseHourlyRate || 'TBD'}/hour</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>QUALIFICATIONS & COMPLIANCE</h2>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Public Liability Insurance</div>
        <div class="detail-value">${contract.hasPublicLiability ? '✓ Verified' : '✗ Not Verified'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Police Check</div>
        <div class="detail-value">${contract.hasPoliceCheck ? '✓ Verified' : '✗ Not Verified'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Liability Expiry</div>
        <div class="detail-value">${contract.liabilityInsuranceExpiry || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Police Check Expiry</div>
        <div class="detail-value">${contract.policeCheckExpiry || 'N/A'}</div>
      </div>
    </div>
    ${contract.specializations ? `<p><strong>Specializations:</strong> ${contract.specializations}</p>` : ''}
    ${contract.equipmentOwned ? `<p><strong>Equipment Owned:</strong> Yes - ${contract.equipmentOwned}</p>` : ''}
  </div>

  <div class="section">
    <h2>AVAILABILITY & PREFERENCES</h2>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Weekly Available Hours</div>
        <div class="detail-value">${contract.weeklyAvailableHours || 'N/A'} hours</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Preferred Shifts</div>
        <div class="detail-value">${contract.preferredShifts || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Eco-Friendly Capable</div>
        <div class="detail-value">${contract.ecoFriendlyCapable ? '✓ Yes' : '✗ No'}</div>
      </div>
    </div>
    ${contract.references ? `<p><strong>References:</strong> ${contract.references}</p>` : ''}
  </div>

  <div class="section">
    <h2>TERMS & CONDITIONS</h2>
    <div class="terms">
      <h3>Payment & Compensation</h3>
      <ul>
        <li>Base hourly rate as agreed: $${contract.baseHourlyRate || 'TBD'}/hour</li>
        <li>Weekly payment via direct deposit</li>
        <li>Invoicing handled through RESET system</li>
        <li>Travel time compensated at agreed rate</li>
      </ul>

      <h3>Job Assignment & Scheduling</h3>
      <ul>
        <li>Jobs assigned through RESET platform</li>
        <li>Service Provider confirms acceptance within timeframe</li>
        <li>Flexibility required for scheduling changes</li>
        <li>At least 24 hours notice for cancellation</li>
      </ul>

      <h3>Work Standards</h3>
      <ul>
        <li>Must maintain professional appearance and conduct</li>
        <li>Follow all client health & safety requirements</li>
        <li>Report any damage or incidents immediately</li>
        <li>Quality review and feedback from clients</li>
      </ul>

      <h3>Insurance & Compliance</h3>
      <ul>
        <li>Service Provider responsible for maintaining public liability insurance</li>
        <li>Police check must be current throughout agreement</li>
        <li>ABN verification and tax compliance required</li>
        <li>Workers' compensation insurance as required by law</li>
      </ul>

      <h3>Confidentiality & Conduct</h3>
      <ul>
        <li>Maintain confidentiality of client information</li>
        <li>No solicitation of clients for independent work</li>
        <li>Professional behavior and communication required</li>
        <li>Immediate dismissal for breach of conduct</li>
      </ul>

      <h3>Termination</h3>
      <ul>
        <li>Either party may terminate with 7 days written notice</li>
        <li>Immediate termination for breaches of agreement</li>
        <li>Final payment within 7 business days of termination</li>
      </ul>
    </div>
  </div>

  <div class="signature-section">
    <h2>AUTHORIZATION</h2>
    <p>By signing below, both parties agree to the terms and conditions outlined in this Service Provider Agreement.</p>

    <div class="signature-line">
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>Service Provider Signature</label>
        <label>${contract.firstName} ${contract.lastName}</label>
      </div>
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>Date</label>
      </div>
    </div>

    <div class="signature-line">
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>RESET Authorized Representative</label>
        <label>${superuserName || 'RESET Administrator'}</label>
      </div>
      <div class="signature-block">
        <div style="height: 60px; border-bottom: 1px solid #333;"></div>
        <label>Date</label>
      </div>
    </div>
  </div>

  <p style="margin-top: 40px; text-align: center; color: #999; font-size: 0.85em;">
    RESET Commercial Cleaning | ABN: 12 345 678 901 | www.resetcleaning.com.au
  </p>
</body>
</html>
  `.trim();

  return htmlContent;
}

/**
 * Convert HTML to downloadable file
 * In production, use a library like pdfkit or html2pdf
 */
export function downloadContractPDF(html: string, filename: string) {
  const element = document.createElement('a');
  const file = new Blob([html], { type: 'text/html;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Function to generate contract name
export function getContractFilename(contract: Contract): string {
  const date = new Date().toISOString().split('T')[0];
  if (contract.contractType === 'business-owner') {
    return `RESET_Contract_${contract.company || 'Client'}_${date}.html`;
  } else {
    return `RESET_Contract_${contract.firstName}_${contract.lastName}_${date}.html`;
  }
}
