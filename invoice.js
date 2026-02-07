// PDF Invoice Generation
function downloadInvoice() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
  
  // Invoice Header
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80);
  doc.text('SAMRA ARCHITECT', 105, 20, null, null, 'center');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('123 Design Street, Mumbai | +91 98765 43210', 105, 28, null, null, 'center');
  doc.text('GSTIN: 27ABCDE1234F1Z5 | contact@samraarchitect.com', 105, 33, null, null, 'center');
  
  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(201, 161, 74);
  doc.text('TAX INVOICE', 105, 45, null, null, 'center');
  
  doc.setDrawColor(201, 161, 74);
  doc.line(20, 50, 190, 50);
  
  // Invoice Details
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Left column
  doc.text(`Invoice No: ${invoiceData.id || 'INV-001'}`, 20, 60);
  doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`Payment Mode: UPI`, 20, 70);
  
  // Right column
  doc.text(`Client: ${bookingDetails.name || 'Client'}`, 120, 60);
  doc.text(`Email: ${bookingDetails.email || ''}`, 120, 65);
  doc.text(`Phone: ${bookingDetails.phone || ''}`, 120, 70);
  
  // Service Details Table
  doc.setFillColor(44, 62, 80);
  doc.rect(20, 80, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Service Description', 25, 87);
  doc.text('Amount', 165, 87, null, null, 'right');
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 90, 170, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.text(invoiceData.service || 'Architectural Consultation', 25, 100);
  doc.text(invoiceData.amount || '₹999', 165, 100, null, null, 'right');
  
  // Total
  doc.setFontSize(12);
  doc.text(`Total Amount: ${invoiceData.amount || '₹999'}`, 165, 120, null, null, 'right');
  
  // Terms
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Terms & Conditions:', 20, 140);
  doc.text('1. Consultation will be scheduled within 48 hours of payment.', 20, 145);
  doc.text('2. Cancellations must be made 24 hours in advance for refund.', 20, 150);
  doc.text('3. All amounts are in Indian Rupees (INR).', 20, 155);
  
  // Footer
  doc.setFontSize(8);
  doc.text('Thank you for choosing Samra Architect!', 105, 180, null, null, 'center');
  doc.text('This is a computer-generated invoice.', 105, 185, null, null, 'center');
  
  // Save PDF
  doc.save(`invoice-${invoiceData.id || 'samra'}.pdf`);
  
  // Show success message
  showToast('Invoice downloaded successfully!');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add toast styles
const toastStyles = `
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: var(--success);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10000;
  transition: transform 0.3s ease-out;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
}
`;

const style = document.createElement('style');
style.textContent = toastStyles;
document.head.appendChild(style);

// Enhanced PDF Invoice Generation
function downloadInvoice() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
  
  // Invoice Header with Logo
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80);
  doc.text('SAMRA ARCHITECT', 105, 20, null, null, 'center');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('123 Design Street, Mumbai, Maharashtra 400001', 105, 28, null, null, 'center');
  doc.text('Phone: +91 98765 43210 | Email: contact@samraarchitect.com', 105, 33, null, null, 'center');
  doc.text('GSTIN: 27ABCDE1234F1Z5 | PAN: ABCDE1234F', 105, 38, null, null, 'center');
  
  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(201, 161, 74);
  doc.text('TAX INVOICE', 105, 50, null, null, 'center');
  
  doc.setDrawColor(201, 161, 74);
  doc.line(20, 55, 190, 55);
  
  // Invoice & Client Details in two columns
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Left column - Invoice Details
  doc.text('INVOICE DETAILS', 20, 65);
  doc.text(`Invoice No: ${invoiceData.id || 'INV-001'}`, 20, 72);
  doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString()}`, 20, 77);
  doc.text(`Time: ${invoiceData.time || new Date().toLocaleTimeString()}`, 20, 82);
  doc.text(`Booking ID: ${invoiceData.bookingId || 'SAMRA-001'}`, 20, 87);
  doc.text(`Transaction ID: ${invoiceData.transactionId || 'TXN123456'}`, 20, 92);
  
  // Right column - Client Details
  doc.text('CLIENT DETAILS', 120, 65);
  doc.text(`Name: ${invoiceData.client || bookingDetails.name || 'Client'}`, 120, 72);
  doc.text(`Email: ${invoiceData.email || bookingDetails.email || ''}`, 120, 77);
  doc.text(`Phone: ${invoiceData.phone || bookingDetails.phone || ''}`, 120, 82);
  doc.text(`Address: ${invoiceData.address || bookingDetails.address || ''}`, 120, 87);
  doc.text(`Project Type: ${invoiceData.projectType || bookingDetails.projectType || ''}`, 120, 92);
  
  // Service Details Table
  doc.setFillColor(44, 62, 80);
  doc.rect(20, 100, 170, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Description', 25, 107);
  doc.text('Amount', 165, 107, null, null, 'right');
  
  doc.setFillColor(255, 255, 255);
  doc.rect(20, 110, 170, 20, 'F');
  doc.setTextColor(0, 0, 0);
  
  // Service Description
  const serviceDesc = invoiceData.service || 'Architectural Consultation';
  const serviceLines = doc.splitTextToSize(serviceDesc, 100);
  doc.text(serviceLines, 25, 118);
  
  // Amount
  doc.text(invoiceData.amount || '₹999', 165, 118, null, null, 'right');
  
  // Calculate position for totals
  let yPos = 135;
  
  // Tax Breakdown (if any)
  const amount = parseInt(invoiceData.amount?.replace('₹', '') || '999');
  const gst = amount * 0.18; // 18% GST
  const total = amount + gst;
  
  doc.setFontSize(9);
  doc.text('Subtotal:', 140, yPos);
  doc.text(`₹${amount.toFixed(2)}`, 165, yPos, null, null, 'right');
  yPos += 6;
  
  doc.text('GST (18%):', 140, yPos);
  doc.text(`₹${gst.toFixed(2)}`, 165, yPos, null, null, 'right');
  yPos += 6;
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Total:', 140, yPos);
  doc.text(`₹${total.toFixed(2)}`, 165, yPos, null, null, 'right');
  doc.setFont(undefined, 'normal');
  
  yPos += 10;
  
  // Payment Details
  doc.setFontSize(10);
  doc.text('PAYMENT DETAILS', 20, yPos);
  yPos += 7;
  doc.text(`Payment Method: ${invoiceData.paymentMethod || 'UPI'}`, 20, yPos);
  yPos += 6;
  doc.text(`Status: ${invoiceData.status || 'Paid'}`, 20, yPos);
  yPos += 6;
  doc.text(`Date: ${invoiceData.date || new Date().toLocaleDateString()}`, 20, yPos);
  
  // Terms and Conditions
  yPos = 160;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Terms & Conditions:', 20, yPos);
  yPos += 6;
  
  const terms = [
    '1. Consultation will be scheduled within 48 hours of payment confirmation.',
    '2. Cancellations must be made 24 hours in advance for full refund.',
    '3. Rescheduling is allowed with prior notice of at least 12 hours.',
    '4. All amounts are in Indian Rupees (INR) and include applicable taxes.',
    '5. This invoice is computer generated and does not require signature.',
    '6. For any queries, contact support@samraarchitect.com'
  ];
  
  terms.forEach(term => {
    const lines = doc.splitTextToSize(term, 170);
    lines.forEach(line => {
      doc.text(line, 20, yPos);
      yPos += 4;
    });
    yPos += 2;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.text('Thank you for choosing Samra Architect!', 105, 190, null, null, 'center');
  doc.text('Designing Spaces. Defining Lifestyles.', 105, 195, null, null, 'center');
  doc.text('This is a computer-generated invoice.', 105, 200, null, null, 'center');
  
  // Add page border
  doc.setDrawColor(201, 161, 74);
  doc.rect(10, 10, 190, 277); // A4 size with margin
  
  // Save PDF
  const fileName = `invoice-${invoiceData.id || 'samra'}.pdf`;
  doc.save(fileName);
  
  // Show success toast
  showToast(`Invoice downloaded as ${fileName}`);
  
  // Track download
  console.log('Invoice downloaded:', fileName);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-check-circle" style="color: #28a745;"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add toast styles if not already present
if (!document.querySelector('style[data-toast]')) {
  const toastStyle = document.createElement('style');
  toastStyle.setAttribute('data-toast', 'true');
  toastStyle.textContent = `
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: white;
      color: #333;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 10000;
      transition: transform 0.3s ease-out;
      font-weight: 500;
      border-left: 4px solid #28a745;
    }
    
    .toast.show {
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(toastStyle);
}