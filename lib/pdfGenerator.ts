import { jsPDF } from 'jspdf';

interface ReportData {
  month: string;
  filename: string;
  jobsCompleted: number;
  totalSpent: string;
  averageRating: number;
  cleaningEfficiency: string;
  highlights: string;
  costPerSqFt: string;
}

interface CompanyProfile {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  squareFeet: string;
}

const drawSimpleTable = (
  doc: jsPDF,
  startY: number,
  headers: string[],
  rows: string[][],
  margin: number,
  pageWidth: number
) => {
  const columnWidth = (pageWidth - 2 * margin) / headers.length;
  let yPos = startY;
  const rowHeight = 6;

  // Draw header
  doc.setFillColor(20, 83, 45);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);

  headers.forEach((header, i) => {
    doc.rect(margin + i * columnWidth, yPos, columnWidth, rowHeight, 'F');
    doc.text(header, margin + i * columnWidth + 1, yPos + 4, { maxWidth: columnWidth - 2, align: 'left' });
  });

  yPos += rowHeight;

  // Draw rows
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  rows.forEach((row, rowIndex) => {
    // Alternate row colors
    if (rowIndex % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, yPos, pageWidth - 2 * margin, rowHeight, 'F');
    }

    row.forEach((cell, colIndex) => {
      doc.rect(margin + colIndex * columnWidth, yPos, columnWidth, rowHeight);
      doc.text(cell, margin + colIndex * columnWidth + 1, yPos + 4, { maxWidth: columnWidth - 2, align: 'left' });
    });

    yPos += rowHeight;
  });

  return yPos;
};

export const generateMonthlyReportPDF = (report: ReportData, profile: CompanyProfile) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 10;

    // Header
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, 20, 'F');

    doc.setTextColor(20, 83, 45);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESET', margin, 10);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Commercial Cleaning Solutions', margin, 15);

    yPosition = 30;

    // Title
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Monthly Report - ${report.month}`, margin, yPosition);
    yPosition += 10;

    // Client Info Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition, contentWidth, 25, 'FD');

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    doc.text(`Company: ${profile.company}`, margin + 3, yPosition + 4);
    doc.text(`Contact: ${profile.name} | Email: ${profile.email}`, margin + 3, yPosition + 8);
    doc.text(`Address: ${profile.address}`, margin + 3, yPosition + 12);
    doc.text(`Phone: ${profile.phone} | Industry: ${profile.industry} | Space: ${profile.squareFeet}`, margin + 3, yPosition + 16);
    doc.text(`Service Period: ${report.month}`, margin + 3, yPosition + 20);

    yPosition += 30;

    // KPI Section
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('KEY PERFORMANCE INDICATORS', margin, yPosition);
    yPosition += 6;

    const kpiRows = [
      ['Jobs Completed', report.jobsCompleted.toString(), '8', report.jobsCompleted >= 8 ? '✓ On Track' : '⚠ Below'],
      ['Efficiency', report.cleaningEfficiency, '95%+', parseFloat(report.cleaningEfficiency) >= 95 ? '✓ Excellent' : '⚠ Good'],
      ['Quality Rating', `${report.averageRating}/5`, '4.5+', report.averageRating >= 4.5 ? '✓ Excellent' : '⚠ Good'],
      ['Cost/Sq Ft', report.costPerSqFt, '$0.40-0.50', '✓ Competitive'],
      ['Response Time', '2h', '4h', '✓ Excellent'],
      ['Completion Rate', '100%', '95%+', '✓ Excellent'],
    ];

    yPosition = drawSimpleTable(doc, yPosition, ['Metric', 'This Month', 'Target', 'Status'], kpiRows, margin, pageWidth);
    yPosition += 5;

    // Financial Summary
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FINANCIAL SUMMARY', margin, yPosition);
    yPosition += 6;

    const avgCost = `$${(parseFloat(report.totalSpent.replace('$', '')) / report.jobsCompleted).toFixed(2)}`;
    const financialRows = [
      ['Total Services', report.totalSpent],
      ['Number of Jobs', report.jobsCompleted.toString()],
      ['Avg Cost per Job', avgCost],
      ['Cost per Sq Ft', report.costPerSqFt],
      ['Monthly Total', report.totalSpent],
    ];

    yPosition = drawSimpleTable(doc, yPosition, ['Description', 'Amount'], financialRows, margin, pageWidth);
    yPosition += 5;

    // Service Details
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE DETAILS & JOB BREAKDOWN', margin, yPosition);
    yPosition += 6;

    const serviceRows = [
      ['Mar 5', 'Deep Cleaning', 'Level 3', '4h', 'Elite Crew', '5.0'],
      ['Mar 8', 'Standard Clean', 'Lobby', '2h', 'Pro Team', '4.8'],
      ['Mar 12', 'Carpet Clean', 'Conf Room', '3h', 'Elite Crew', '5.0'],
      ['Mar 15', 'Floor Polish', 'Exec Floor', '3.5h', 'Pro Team', '4.7'],
      ['Mar 19', 'Deep Cleaning', 'Rest/Kitchen', '2.5h', 'Elite Crew', '4.9'],
      ['Mar 22', 'Window Clean', 'Exterior', '2h', 'Pro Team', '5.0'],
      ['Mar 26', 'Deep Cleaning', 'Level 2', '4h', 'Elite Crew', '4.8'],
      ['Mar 29', 'Post-Event', 'Event Hall', '3h', 'Pro Team', '5.0'],
    ];

    yPosition = drawSimpleTable(doc, yPosition, ['Date', 'Type', 'Location', 'Duration', 'Team', 'Rating'], serviceRows, margin, pageWidth);
    yPosition += 5;

    // Quality Assurance
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('QUALITY ASSURANCE', margin, yPosition);
    yPosition += 6;

    const qualityRows = [
      ['Safety Standards', '✓ Compliant', 'All protocols followed'],
      ['Equipment', '✓ Good', 'Regular maintenance'],
      ['Staff Training', '✓ Current', 'Certified team'],
      ['Satisfaction', '✓ Excellent', '4.8/5 rating'],
      ['Eco-Friendly', '✓ Yes', 'Sustainable products'],
    ];

    yPosition = drawSimpleTable(doc, yPosition, ['Item', 'Status', 'Notes'], qualityRows, margin, pageWidth);
    yPosition += 5;

    // Highlights
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setTextColor(20, 83, 45);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('HIGHLIGHTS & RECOMMENDATIONS', margin, yPosition);
    yPosition += 6;

    doc.setFillColor(245, 248, 245);
    doc.setDrawColor(200, 220, 200);
    doc.rect(margin, yPosition, contentWidth, 20, 'FD');

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const summaryText = `${report.highlights}. Continue current cleaning schedule. All service standards being met and exceeded.`;
    const splitText = doc.splitTextToSize(summaryText, contentWidth - 6);
    doc.text(splitText, margin + 2, yPosition + 3);

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, pageHeight - 6);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 6);
      doc.text('www.reset.com.au', pageWidth / 2, pageHeight - 6, { align: 'center' });
    }

    // Save PDF
    doc.save(report.filename);
  } catch (error) {
    console.error('PDF Error:', error);
    throw new Error('Failed to download report');
  }
};
