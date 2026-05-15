import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

interface JobRecord {
  date: string;
  type: string;
  location: string;
  duration: string;
  team: string;
  rating: number;
}

const addPageHeader = (doc: jsPDF, pageNumber: number, totalPages: number, month: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header bar
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, pageWidth, 25, 'F');

  // Company name
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('RESET', 15, 12);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Commercial Cleaning Solutions', 15, 18);

  // Page info (top right)
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 25, 15);
};

const addPageFooter = (doc: jsPDF, pageNumber: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | www.reset.com.au`, 15, pageHeight - 8);
};

export const generateMonthlyReportPDF = (report: ReportData, profile: CompanyProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = 35;

  // Title Section
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`Monthly Service Report - ${report.month}`, margin, yPosition);

  yPosition += 12;

  // Client Information Box
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPosition, contentWidth, 35, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPosition, contentWidth, 35);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT INFORMATION', margin + 3, yPosition + 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  const clientInfoLeftCol = [
    `Company: ${profile.company}`,
    `Contact: ${profile.name}`,
    `Email: ${profile.email}`,
  ];

  const clientInfoRightCol = [
    `Phone: ${profile.phone}`,
    `Address: ${profile.address}`,
    `Industry: ${profile.industry} | Space: ${profile.squareFeet}`,
  ];

  clientInfoLeftCol.forEach((info, idx) => {
    doc.text(info, margin + 3, yPosition + 12 + idx * 4);
  });

  clientInfoRightCol.forEach((info, idx) => {
    doc.text(info, margin + contentWidth / 2, yPosition + 12 + idx * 4);
  });

  yPosition += 42;

  // Key Performance Indicators
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY PERFORMANCE INDICATORS', margin, yPosition);

  yPosition += 8;

  // KPI Table
  const kpiData = [
    ['Metric', 'This Month', 'Target', 'Status'],
    ['Jobs Completed', report.jobsCompleted.toString(), '8', report.jobsCompleted >= 8 ? '✓ On Track' : '⚠ Below Target'],
    ['Cleaning Efficiency', report.cleaningEfficiency, '95%+', parseFloat(report.cleaningEfficiency) >= 95 ? '✓ Excellent' : '⚠ Good'],
    ['Service Quality Rating', `${report.averageRating}/5.0`, '4.5+', report.averageRating >= 4.5 ? '✓ Excellent' : '⚠ Good'],
    ['Cost per Sq Ft', report.costPerSqFt, '$0.40-0.50', '✓ Competitive'],
    ['Average Response Time', '2 hours', '4 hours', '✓ Excellent'],
    ['Completion Rate', '100%', '95%+', '✓ Excellent'],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [kpiData[0]],
    body: kpiData.slice(1),
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 50, textColor: [60, 60, 60], fontStyle: 'bold', fillColor: [245, 245, 245] },
      1: { cellWidth: 35, textColor: [80, 80, 80], halign: 'center' },
      2: { cellWidth: 35, textColor: [80, 80, 80], halign: 'center' },
      3: { cellWidth: 40, textColor: [20, 120, 80], halign: 'center', fontStyle: 'bold' },
    },
    headStyles: {
      fillColor: [20, 83, 45],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    lineColor: [200, 200, 200],
    lineWidth: 0.3,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Financial Summary
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL SUMMARY', margin, yPosition);

  yPosition += 8;

  const financialData = [
    ['Description', 'Amount'],
    ['Total Services Rendered', report.totalSpent],
    ['Number of Jobs', report.jobsCompleted.toString()],
    ['Average Cost per Job', `$${(parseFloat(report.totalSpent.replace('$', '')) / report.jobsCompleted).toFixed(2)}`],
    ['Cost per Square Foot', report.costPerSqFt],
    ['Monthly Total', report.totalSpent],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [financialData[0]],
    body: financialData.slice(1),
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 90, textColor: [60, 60, 60], fontStyle: 'bold', fillColor: [245, 245, 245] },
      1: { cellWidth: 60, textColor: [20, 120, 80], halign: 'right', fontStyle: 'bold', fillColor: [250, 250, 250] },
    },
    headStyles: {
      fillColor: [20, 83, 45],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [60, 60, 60],
    },
    lineColor: [200, 200, 200],
    lineWidth: 0.3,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Service Details
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE DETAILS & JOB BREAKDOWN', margin, yPosition);

  yPosition += 8;

  // Mock job records
  const jobRecords: JobRecord[] = [
    { date: 'Mar 5, 2025', type: 'Deep Cleaning', location: 'Level 3 - Open Office', duration: '4 hours', team: 'Elite Cleaning Crew', rating: 5 },
    { date: 'Mar 8, 2025', type: 'Standard Cleaning', location: 'Lobby & Reception', duration: '2 hours', team: 'Pro Services Team', rating: 4.8 },
    { date: 'Mar 12, 2025', type: 'Carpet Cleaning', location: 'Conference Rooms', duration: '3 hours', team: 'Elite Cleaning Crew', rating: 5 },
    { date: 'Mar 15, 2025', type: 'Floor Polish', location: 'Executive Floor', duration: '3.5 hours', team: 'Pro Services Team', rating: 4.7 },
    { date: 'Mar 19, 2025', type: 'Deep Cleaning', location: 'Restrooms & Kitchen', duration: '2.5 hours', team: 'Elite Cleaning Crew', rating: 4.9 },
    { date: 'Mar 22, 2025', type: 'Window Cleaning', location: 'Exterior Windows', duration: '2 hours', team: 'Pro Services Team', rating: 5 },
    { date: 'Mar 26, 2025', type: 'Deep Cleaning', location: 'Level 2 - Office Area', duration: '4 hours', team: 'Elite Cleaning Crew', rating: 4.8 },
    { date: 'Mar 29, 2025', type: 'Post-Event Cleaning', location: 'Event Hall', duration: '3 hours', team: 'Pro Services Team', rating: 5 },
  ];

  const jobData = [
    ['Date', 'Service Type', 'Location', 'Duration', 'Team', 'Rating'],
    ...jobRecords.map(job => [
      job.date,
      job.type,
      job.location,
      job.duration,
      job.team,
      `${job.rating}/5`,
    ]),
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [jobData[0]],
    body: jobData.slice(1),
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 28 },
      2: { cellWidth: 40 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 30 },
      5: { cellWidth: 12, halign: 'center', textColor: [20, 120, 80], fontStyle: 'bold' },
    },
    headStyles: {
      fillColor: [20, 83, 45],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    lineColor: [200, 200, 200],
    lineWidth: 0.3,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Quality Assurance Section
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('QUALITY ASSURANCE', margin, yPosition);

  yPosition += 8;

  const qualityData = [
    ['Inspection Point', 'Compliance', 'Notes'],
    ['Safety Standards', '✓ Compliant', 'All safety protocols followed'],
    ['Equipment Maintenance', '✓ Good Condition', 'Regular maintenance schedule maintained'],
    ['Staff Training', '✓ Current', 'All team members certified & trained'],
    ['Client Satisfaction', '✓ Excellent', 'Average rating: 4.8/5 stars'],
    ['Waste Management', '✓ Eco-Friendly', 'Using sustainable cleaning products'],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [qualityData[0]],
    body: qualityData.slice(1),
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 50, textColor: [60, 60, 60], fontStyle: 'bold', fillColor: [245, 245, 245] },
      1: { cellWidth: 35, textColor: [20, 120, 80], halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 60, textColor: [80, 80, 80] },
    },
    headStyles: {
      fillColor: [20, 83, 45],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [60, 60, 60],
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    lineColor: [200, 200, 200],
    lineWidth: 0.3,
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Highlights and Recommendations
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('HIGHLIGHTS & RECOMMENDATIONS', margin, yPosition);

  yPosition += 8;

  doc.setFillColor(245, 248, 245);
  doc.rect(margin, yPosition, contentWidth, 30, 'F');
  doc.setDrawColor(200, 220, 200);
  doc.rect(margin, yPosition, contentWidth, 30);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const summaryText = `${report.highlights}

Recommendations for next month: Continue current cleaning schedule. Consider scheduling additional deep cleaning during low-activity periods. All service standards are being met and exceeded.`;

  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 6);
  doc.text(splitSummary, margin + 3, yPosition + 4);

  // Add footer to each page
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageHeader(doc, i, totalPages, report.month);
    addPageFooter(doc, i);
  }

  // Save the PDF
  doc.save(report.filename);
};
