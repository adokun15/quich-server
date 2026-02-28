//Generate waybill order;
const PDFDocument = require("pdfkit");

/**
 * Generate Invoice PDF
function generateInvoice(res, invoice) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Stream to response (serverless-safe)
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=invoice-${invoice.id}.pdf`);

  doc.pipe(res);

  // ===== HEADER =====
  doc
    .fontSize(20)
    .text(invoice.business.name, 50, 45)
    .fontSize(10)
    .text(invoice.business.address)
    .text(invoice.business.phone);

  doc
    .fontSize(20)
    .text('INVOICE', 400, 50, { align: 'right' });

  doc
    .fontSize(10)
    .text(`Invoice #: ${invoice.id}`, 400, 80, { align: 'right' })
    .text(`Date: ${invoice.date}`, { align: 'right' });

  // ===== CUSTOMER =====
  doc.moveDown(2);

  doc
    .fontSize(12)
    .text('Bill To:')
    .fontSize(10)
    .text(invoice.customer.name)
    .text(invoice.customer.phone)
    .text(invoice.customer.address);

    // ===== TABLE HEADER =====
  const tableTop = 250;
  
  doc
    .fontSize(10)
    .text('Item', 50, tableTop)
    .text('Qty', 280, tableTop)
    .text('Price', 330, tableTop)
    .text('Total', 420, tableTop);

    drawLine(doc, tableTop + 15);

    // ===== TABLE ROWS =====
  let y = tableTop + 25;
  
  invoice.items.forEach(item => {
    doc
    .fontSize(10)
      .text(item.name, 50, y)
      .text(item.quantity, 280, y)
      .text(`₦${item.price.toLocaleString()}`, 330, y)
      .text(`₦${(item.quantity * item.price).toLocaleString()}`, 420, y);
      
    y += 20;
  });

  drawLine(doc, y + 5);

  // ===== TOTAL =====
  doc
  .fontSize(12)
    .text(`Total: ₦${invoice.total.toLocaleString()}`, 400, y + 20, {
        align: 'right',
    });

    // ===== FOOTER =====
    doc
    .fontSize(10)
    .text(
      'Thank you for your business!',
      50,
      750,
      { align: 'center' }
    );
    
    doc.end();
}

function drawLine(doc, y) {
    doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

module.exports = generateInvoice;
*/
