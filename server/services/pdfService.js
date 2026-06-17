import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const brandBlue = '#0f2744';
const gold = '#c9a227';

export const generateOfferLetterPDF = async (data) => {
  const { studentName, collegeName, courseName, duration, startDate, endDate, internshipId } = data;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.rect(0, 0, 612, 80).fill(brandBlue);
    doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold')
      .text('LEARNOVATE', 50, 25);
    doc.fontSize(10).font('Helvetica')
      .text('Innovation Through Learning', 50, 52);

    doc.fillColor('#333333').fontSize(10)
      .text(`Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 400, 100, { align: 'right' });

    doc.moveDown(3).fontSize(18).fillColor(brandBlue).font('Helvetica-Bold')
      .text('INTERNSHIP OFFER LETTER', { align: 'center' });

    doc.moveDown(1.5).fontSize(11).fillColor('#333333').font('Helvetica')
      .text(`Dear ${studentName},`, 50, doc.y);

    doc.moveDown(0.8).text(
      `We are pleased to offer you an internship position at Learnovate. Based on your enrollment and successful payment, you are hereby offered the following internship opportunity:`,
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(1);
    const details = [
      ['Internship ID', internshipId],
      ['Course', courseName],
      ['College', collegeName],
      ['Duration', duration],
      ['Start Date', new Date(startDate).toLocaleDateString('en-IN')],
      ['End Date', new Date(endDate).toLocaleDateString('en-IN')],
      ['Mode', 'Remote / Online'],
    ];

    details.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
        .font('Helvetica').text(value);
      doc.moveDown(0.3);
    });

    doc.moveDown(1).text(
      'During this internship, you will gain hands-on experience and industry-relevant skills. Upon successful completion and submission of your completion form, you will receive an official internship completion certificate with QR verification.',
      { align: 'justify', lineGap: 4 }
    );

    doc.moveDown(2);
    doc.rect(50, doc.y, 200, 1).fill(gold);
    doc.moveDown(0.5).font('Helvetica-Bold').text('Authorized Signatory');
    doc.font('Helvetica').fontSize(9).text('Learnovate - Internship Management Platform');

    doc.end();
  });
};

export const generateCertificatePDF = async (data) => {
  const {
    studentName,
    courseName,
    internshipId,
    duration,
    certificateId,
    issueDate,
    completionDate,
    verifyUrl,
  } = data;

  const dateIssued = issueDate || completionDate;
  const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 120, margin: 1 });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.rect(20, 20, 752, 532).lineWidth(3).stroke(gold);
    doc.rect(30, 30, 732, 512).lineWidth(1).stroke(brandBlue);

    doc.fillColor(brandBlue).fontSize(32).font('Helvetica-Bold')
      .text('CAMPUS CODE LABS', 0, 60, { align: 'center' });
    doc.fontSize(12).font('Helvetica').fillColor('#666666')
      .text('THINK. CODE. DELIVER.', { align: 'center' });

    doc.moveDown(2).fillColor(gold).fontSize(14).font('Helvetica-Bold')
      .text('INTERNSHIP CERTIFICATE', { align: 'center' });

    doc.moveDown(1).fillColor('#333333').fontSize(11).font('Helvetica')
      .text('This is to certify that', { align: 'center' });

    doc.moveDown(0.5).fillColor(brandBlue).fontSize(28).font('Helvetica-Bold')
      .text(studentName.toUpperCase(), { align: 'center' });

    doc.moveDown(0.8).fillColor('#333333').fontSize(11).font('Helvetica')
      .text('has successfully completed the internship program in', { align: 'center' });

    doc.moveDown(0.3).fillColor(brandBlue).fontSize(18).font('Helvetica-Bold')
      .text(courseName, { align: 'center' });

    doc.moveDown(0.8).fontSize(11).font('Helvetica').fillColor('#333333')
      .text(`Duration: ${duration}`, { align: 'center' });
    if (internshipId) doc.text(`Internship ID: ${internshipId}`, { align: 'center' });
    doc.text(`Certificate ID: ${certificateId}`, { align: 'center' })
      .text(`Issue Date: ${new Date(dateIssued).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' })
      .text(`Verify: ${verifyUrl}`, { align: 'center' });

    doc.image(qrBuffer, 620, 380, { width: 100, height: 100 });
    doc.fontSize(8).fillColor('#666666').text('Scan to Verify', 635, 485);

    doc.fontSize(10).fillColor(brandBlue)
      .text('Authorized Signatory', 80, 420)
      .text('Campus Code Labs', 80, 435)
      .text('_________________________', 80, 400);

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
