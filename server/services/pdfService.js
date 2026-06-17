import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const brandBlue = '#0f2744';
const gold = '#c9a227';
const brightBlue = '#1DA1FF';
const deepBlue = '#005BFF';

const drawCompanyLogo = (doc, x, y) => {
  // Vector logo approximation (CCL mark) so PDF does not depend on external image files.
  doc.save();
  doc.lineWidth(10).strokeColor(brightBlue).lineCap('round');
  doc.arc(x + 16, y + 16, 16, 40, 320).stroke();
  doc.strokeColor(deepBlue).lineWidth(8);
  doc.arc(x + 24, y + 16, 10, 40, 320).stroke();
  doc.strokeColor('#E5E7EB').lineWidth(7);
  doc.moveTo(x + 33, y + 7).lineTo(x + 33, y + 26).lineTo(x + 45, y + 26).stroke();
  doc.restore();
};

const drawPartnerLogos = (doc, y, { centered = true, height = 26 } = {}) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const logosDir = path.join(__dirname, '../assets/logos');

  const logoItems = [
    { label: 'AICTE', filename: 'aicte.png' },
    // MSME provided file is WEBP-in-disguise; use converted PNG if present.
    { label: 'MSME', filename: 'msme_converted.png' },
    { label: 'Made in India', filename: 'made-in-india.png' },
  ];

  const gap = 28;
  const widths = [52, 64, 78]; // tuned per logo aspect ratio
  const totalWidth = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
  const startX = centered ? (doc.page.width - totalWidth) / 2 : 60;

  logoItems.forEach((item, index) => {
    const x = startX + widths.slice(0, index).reduce((a, b) => a + b, 0) + gap * index;
    const filePath = path.join(logosDir, item.filename);
    const exists = fs.existsSync(filePath);

    if (exists) {
      doc.image(filePath, x, y, { fit: [widths[index], height], align: 'center', valign: 'center' });
    } else {
      doc.fillColor('#475569')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(item.label, x, y + 6, { width: widths[index], align: 'center' });
    }
  });
};

export const generateOfferLetterPDF = async (data) => {
  const { studentName, collegeName, year, branch, courseName, duration, startDate, endDate, internshipId } = data;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.rect(0, 0, 612, 95).fill(brandBlue);
    drawCompanyLogo(doc, 42, 26);
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
      .text('CAMPUS CODE LABS', 92, 35);
    doc.fontSize(10).font('Helvetica')
      .fillColor('#bfdbfe')
      .text('THINK. CODE. DELIVER.', 92, 58);

    const orgRef = `CORPORATE${crypto.createHash('sha1').update(String(internshipId)).digest('hex').slice(0, 18).toUpperCase()}`;

    doc.fillColor('#111827').fontSize(10).font('Helvetica')
      .text(`Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 400, 112, { align: 'right' });
    doc.text(`Ref No: OL/${new Date().getFullYear()}/${internshipId}`, 360, 128, { align: 'right' });

    // Partner logos at bottom-most
    // (keep them clean — no boxes / borders)

    doc.moveDown(3.0).fontSize(18).fillColor('#111827').font('Helvetica-Bold')
      .text('OFFER LETTER', { align: 'center' });
    doc.moveDown(0.2).strokeColor(gold).lineWidth(1).moveTo(190, doc.y).lineTo(420, doc.y).stroke();

    doc.moveDown(1.0).fontSize(11).fillColor('#1f2937').font('Helvetica')
      .text(`Dear ${studentName},`, 50, doc.y);

    doc.moveDown(0.6);
    doc.font('Helvetica-Bold').text('Intern ID: ', { continued: true }).font('Helvetica').text(internshipId);
    doc.moveDown(0.3);
    if (collegeName) doc.font('Helvetica').text(collegeName);
    if (branch) doc.text(branch);
    if (year) doc.text(year);
    doc.moveDown(0.4);
    doc.font('Helvetica-Bold').text('Organization Reference ID: ', { continued: true }).font('Helvetica').text(orgRef);

    doc.moveDown(0.9).font('Helvetica-Bold').fillColor('#111827').text('Congratulations!');
    doc.moveDown(0.6).font('Helvetica').fillColor('#1f2937').text(
      `We are delighted to present you with an offer for the position of ${courseName} Intern at Campus Code Labs.`,
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(0.6).text(
      `Internship commencing from ${new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} to ${new Date(endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}.`,
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(0.6).text(
      'As an intern, you will have the opportunity to gain valuable industry experience through structured tasks and a project submission. Please note this is an internship engagement and does not constitute full-time employment.',
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(0.8).text(
      "Kindly adhere to our company's policies, including those related to conduct, punctuality, and confidentiality. We have every confidence that your internship with us will prove to be fulfilling and we extend our best wishes for success in this promising opportunity.",
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(0.8).text(
      'We look forward to welcoming you to our team and witnessing your growth and contributions firsthand.',
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(1);
    doc.fontSize(9.5).fillColor('#4b5563').text(
      'This offer letter is generated electronically by Campus Code Labs and is valid without a physical signature.',
      { align: 'justify', lineGap: 3 }
    );

    // Signature block (bottom)
    const yBase = 640;
    doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text('Authorized Signatory', 60, yBase);
    doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text('Campus Code Labs', 60, yBase + 16);

    doc.fontSize(10).fillColor('#111827').font('Helvetica-Bold').text('HR Department', 370, yBase);
    doc.fontSize(9).fillColor('#6b7280').font('Helvetica').text('Campus Code Labs', 370, yBase + 16);

    drawPartnerLogos(doc, 742, { height: 26 });

    doc.end();
  });
};

export const generateCertificatePDF = async (data) => {
  const {
    studentName,
    email,
    collegeName,
    branch,
    year,
    courseName,
    internshipId,
    duration,
    certificateId,
    certificateNo,
    issueDate,
    completionDate,
    internshipFromDate,
    internshipToDate,
    projectTitle,
    verifyUrl,
  } = data;

    const dateIssued = issueDate || completionDate;
  const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 120, margin: 1 });
  const fromDate = internshipFromDate ? new Date(internshipFromDate) : null;
  const toDate = internshipToDate ? new Date(internshipToDate) : null;
  const formatShortDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fillColor(brandBlue).fontSize(32).font('Helvetica-Bold')
      .text('CAMPUS CODE LABS', 0, 60, { align: 'center' });
    doc.fontSize(12).font('Helvetica').fillColor('#666666')
      .text('THINK. CODE. DELIVER.', { align: 'center' });

    doc.moveDown(2).fillColor(gold).fontSize(20).font('Helvetica-Bold')
      .text('INTERNSHIP COMPLETION CERTIFICATE', { align: 'center' });

    doc.moveDown(0.9).fillColor('#333333').fontSize(12).font('Helvetica')
      .text('This is to certify that', { align: 'center' });

    doc.moveDown(0.5).fillColor(brandBlue).fontSize(30).font('Helvetica-Bold')
      .text(studentName.toUpperCase(), { align: 'center' });

    if (branch) {
      doc.moveDown(0.3).fillColor('#374151').fontSize(14).font('Helvetica-Bold')
        .text(branch.toUpperCase(), { align: 'center' });
    }
    if (collegeName) {
      doc.moveDown(0.2).fillColor('#374151').fontSize(14).font('Helvetica-Bold')
        .text(collegeName.toUpperCase(), { align: 'center' });
    }

    doc.moveDown(0.8).fillColor('#333333').fontSize(11).font('Helvetica')
      .text(
        `has effectively completed a ${duration.toLowerCase()} internship in ${courseName}, spanning from ${fromDate ? formatShortDate(fromDate) : 'N/A'} to ${toDate ? formatShortDate(toDate) : 'N/A'}.`,
        90,
        doc.y,
        { align: 'center', width: 620, lineGap: 3 }
      );

    const projectLine = projectTitle
      ? `Additionally, the intern has satisfactorily completed and submitted a project titled '${projectTitle}'.`
      : 'Additionally, the intern has satisfactorily completed and submitted the internship project work.';
    doc.moveDown(0.6).text(
      `${projectLine} We extend our best wishes for the future endeavors.`,
      90,
      doc.y,
      { align: 'center', width: 620, lineGap: 3 }
    );

    doc.moveDown(1).fontSize(11).fillColor(brandBlue).font('Helvetica-Bold')
      .text(`Certificate No: ${certificateNo}`, { align: 'center' });
    doc.moveDown(0.3).fontSize(9).fillColor('#666666').font('Helvetica')
      .text(`Certificate ID: ${certificateId}`, { align: 'center' });
    if (internshipId) doc.text(`Internship ID: ${internshipId}`, { align: 'center' });

    doc.image(qrBuffer, 620, 380, { width: 100, height: 100 });
    doc.fontSize(8).fillColor('#666666').text('Scan to Verify', 635, 485);

    doc.fontSize(10).fillColor(brandBlue)
      .text('Authorized Signatory', 80, 420)
      .text('Campus Code Labs', 80, 435)
      .text('_________________________', 80, 400);

    // Partner logos at bottom-most (no boxes / borders)
    drawPartnerLogos(doc, 540, { height: 26 });

    doc.end();
  });
};

export const generateRecommendationPDF = async (data) => {
  const { studentName, courseName, internshipId, issueDate } = data;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.rect(0, 0, 612, 80).fill(brandBlue);
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
      .text('CAMPUS CODE LABS', 50, 28);
    doc.fontSize(10).text('THINK. CODE. DELIVER.', 50, 52);

    doc.fillColor('#333333').fontSize(10)
      .text(`Date: ${new Date(issueDate).toLocaleDateString('en-IN')}`, 400, 100, { align: 'right' });

    doc.moveDown(3).fontSize(18).fillColor(brandBlue).font('Helvetica-Bold')
      .text('LETTER OF RECOMMENDATION', { align: 'center' });

    doc.moveDown(1.5).fontSize(11).font('Helvetica').fillColor('#333333')
      .text('To Whom It May Concern,', 50, doc.y)
      .moveDown(0.8)
      .text(
        `We are pleased to recommend ${studentName} who successfully completed the ${courseName} internship program (ID: ${internshipId}) at Campus Code Labs. During the program, they demonstrated strong technical skills, commitment, and professionalism.`,
        { align: 'justify', lineGap: 4 }
      )
      .moveDown(1)
      .text('We confidently recommend them for employment and further academic opportunities.', { align: 'justify' })
      .moveDown(2)
      .font('Helvetica-Bold').text('Authorized Signatory')
      .font('Helvetica').text('Campus Code Labs');

    doc.end();
  });
};
