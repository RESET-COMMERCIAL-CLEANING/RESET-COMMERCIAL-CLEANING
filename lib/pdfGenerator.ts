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

export const generateMonthlyReportPDF = (report: ReportData, profile: CompanyProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Header with RESET branding
  doc.setFillColor(11, 11, 11);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(124, 255, 79);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RESET', margin, 18);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Commercial Cleaning Solutions', margin, 27);

  yPosition = 50;

  // Report Title
  doc.setTextColor(124, 255, 79);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Monthly Report - ${report.month}`, margin, yPosition);

  yPosition += 15;

  // Company Information Section
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Company Information', margin, yPosition);

  yPosition += 6;
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const companyInfo = [
    `Company: ${profile.company}`,
    `Contact: ${profile.name}`,
    `Email: ${profile.email}`,
    `Phone: ${profile.phone}`,
    `Address: ${profile.address}`,
    `Industry: ${profile.industry}`,
    `Space Size: ${profile.squareFeet}`,
  ];

  companyInfo.forEach((info) => {
    doc.text(info, margin, yPosition);
    yPosition += 4.5;
  });

  yPosition += 5;

  // Key Metrics Section
  doc.setDrawColor(124, 255, 79);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 8;

  doc.setTextColor(124, 255, 79);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Metrics', margin, yPosition);

  yPosition += 10;

  // Metrics in 2x2 grid
  const metrics = [
    { label: 'Jobs Completed', value: report.jobsCompleted.toString() },
    { label: 'Total Spent', value: report.totalSpent },
    { label: 'Average Rating', value: `⭐ ${report.averageRating}/5` },
    { label: 'Efficiency Score', value: report.cleaningEfficiency },
    { label: 'Cost Per Sq Ft', value: report.costPerSqFt },
  ];

  doc.setFontSize(9);

  metrics.forEach((metric, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);

    const xPos = margin + col * (contentWidth / 2 + 5);
    const currentY = yPosition + row * 18;

    if (currentY < pageHeight - 40) {
      // Label
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`${metric.label}:`, xPos, currentY);

      // Value
      doc.setTextColor(124, 255, 79);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(metric.value, xPos, currentY + 6);
    }
  });

  yPosition += 45;

  // Highlights Section
  doc.setDrawColor(124, 255, 79);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 8;

  doc.setTextColor(124, 255, 79);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, yPosition);

  yPosition += 8;

  doc.setTextColor(200, 200, 200);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const splitText = doc.splitTextToSize(report.highlights, contentWidth);
  doc.text(splitText, margin, yPosition);

  yPosition += splitText.length * 5 + 10;

  // Footer
  doc.setDrawColor(124, 255, 79);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 12);
  doc.text('RESET Commercial Cleaning | www.reset.com.au', pageWidth - margin, pageHeight - 12, { align: 'right' });

  // Save the PDF
  doc.save(report.filename);
};
