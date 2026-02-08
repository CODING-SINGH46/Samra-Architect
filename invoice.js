// invoice.js - PDF Invoice Generation for Samra Architect

let downloadInvoiceInitialized = false;
let initAttempts = 0;
const maxAttempts = 100; // Try for up to 10 seconds (100 * 100ms)

// Wait for jsPDF to load, then initialize the download function
function initializeDownloadFunction() {
  if (downloadInvoiceInitialized) {
    return;
  }
  
  initAttempts++;
  
  // Check if jsPDF is available
  if (typeof window.jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
    // jsPDF not loaded yet
    if (initAttempts < maxAttempts) {
      setTimeout(initializeDownloadFunction, 100);
      return;
    } else {
      // Timeout - define a fallback function
      console.error('jsPDF failed to load after 10 seconds');
      window.downloadInvoice = function() {
        alert('PDF library failed to load. Please refresh the page and try again.');
      };
      downloadInvoiceInitialized = true;
      return;
    }
  }

  // jsPDF is now available, define the download function
  window.downloadInvoice = function() {
    try {
      if (typeof window.jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
        alert('PDF library is not available. Please refresh the page.');
        return;
      }
      
      // Get jsPDF from the loaded library
      const jsPDFLib = window.jsPDF || window.jspdf;
      const { jsPDF } = jsPDFLib;
      
      if (!jsPDF) {
        alert('PDF library is not properly initialized. Please refresh the page.');
        return;
      }
      
      const doc = new jsPDF();
      
      const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
      const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
      const paymentVerification = JSON.parse(localStorage.getItem('paymentVerification')) || {};
      
      // Get screen DPI for better quality
      const dpi = 300;
      const scale = dpi / 72;
      
      // Set document properties
      doc.setProperties({
        title: `Invoice ${invoiceData.id}`,
        subject: 'Architecture Services Invoice',
        author: 'Samra Architect',
        keywords: 'invoice, architecture, payment',
        creator: 'Samra Architect Invoice System'
      });
      
      // ==================== INVOICE HEADER ====================
      // Company Header with Gold Accent
      doc.setFillColor(44, 62, 80); // Dark blue
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(201, 161, 74); // Gold
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text('SAMRA ARCHITECT', 105, 20, null, null, 'center');
      
      doc.setTextColor(255, 255, 255); // White
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text('Designing Spaces. Defining Lifestyles.', 105, 28, null, null, 'center');
      doc.text('Tehsil Road, Sri Vijaynagar, Rajasthan,India Pin Code 335703', 105, 33, null, null, 'center');
      
      // Contact Info
      doc.setFontSize(8);
      doc.text('Phone: +91 6375626274', 20, 45);
      doc.text('Email: contact@samraarchitect.com', 105, 45);
      doc.text('Website: www.samraarchitect.com', 190, 45, null, null, 'right');
      
      // ==================== INVOICE TITLE ====================
      doc.setFontSize(16);
      doc.setTextColor(201, 161, 74); // Gold
      doc.setFont("helvetica", "bold");
      doc.text('TAX INVOICE', 105, 60, null, null, 'center');
      
      // Decorative line
      doc.setDrawColor(201, 161, 74);
      doc.setLineWidth(0.5);
      doc.line(20, 65, 190, 65);
      
      // ==================== INVOICE DETAILS ====================
      let yPos = 75;
      
      // Left Column - Invoice Details
      doc.setTextColor(44, 62, 80); // Dark blue
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text('INVOICE DETAILS', 20, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Invoice Number: ${invoiceData.id || 'INV-001'}`, 20, yPos + 7);
      doc.text(`Invoice Date: ${invoiceData.date || new Date().toLocaleDateString('en-IN')}`, 20, yPos + 12);
      doc.text(`Invoice Time: ${invoiceData.time || new Date().toLocaleTimeString('en-IN', {hour12: true})}`, 20, yPos + 17);
      doc.text(`Booking ID: ${invoiceData.bookingId || 'SAMRA-001'}`, 20, yPos + 22);
      
      // Right Column - Client Details
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text('CLIENT DETAILS', 120, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${invoiceData.client || bookingDetails.name || 'Client'}`, 120, yPos + 7);
      doc.text(`Email: ${invoiceData.email || bookingDetails.email || ''}`, 120, yPos + 12);
      doc.text(`Phone: ${invoiceData.phone || bookingDetails.phone || ''}`, 120, yPos + 17);
      doc.text(`Address: ${invoiceData.address || bookingDetails.address || ''}`, 120, yPos + 22);
      doc.text(`Project Type: ${invoiceData.projectType || bookingDetails.projectType || ''}`, 120, yPos + 27);
      
      // ==================== PAYMENT DETAILS ====================
      yPos += 35;
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text('PAYMENT DETAILS', 20, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`Payment Method: ${invoiceData.paymentMethod || 'UPI'}`, 20, yPos + 7);
      doc.text(`Payment Status: ${invoiceData.status || 'Paid'}`, 20, yPos + 12);
      doc.text(`Transaction ID: ${invoiceData.transactionId || 'TXN123456'}`, 20, yPos + 17);
      
      // UTR Details if available
      if (invoiceData.utrNumber || paymentVerification.utrNumber) {
        doc.text(`UTR/Reference Number: ${invoiceData.utrNumber || paymentVerification.utrNumber}`, 20, yPos + 22);
        doc.text(`Payment Time: ${invoiceData.paymentTime || paymentVerification.paymentDateTime || ''}`, 20, yPos + 27);
      }
      
      // ==================== SERVICE TABLE ====================
      yPos += 35;
      
      // Table Header
      doc.setFillColor(44, 62, 80);
      doc.rect(20, yPos, 170, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text('Description', 25, yPos + 7);
      doc.text('Amount (INR)', 165, yPos + 7, null, null, 'right');
      
      // Service Row
      doc.setFillColor(255, 255, 255);
      doc.rect(20, yPos + 10, 170, 15, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      const serviceDesc = invoiceData.service || 'Architectural Consultation';
      const serviceLines = doc.splitTextToSize(serviceDesc, 100);
      doc.text(serviceLines, 25, yPos + 18);
      
      // Amount - properly extract number from formatted string
      let amountStr = invoiceData.amount?.toString() || '999';
      const amount = parseFloat(amountStr.replace(/[₹,\s]/g, '')) || 999;
      doc.text(`Rs. ${amount.toFixed(2)}`, 165, yPos + 18, null, null, 'right');
      
      // ==================== CALCULATIONS ====================
      yPos += 30;
      
      // Calculations
      const gstRate = 0.18; // 18% GST
      const sgst = amount * (gstRate / 2);
      const cgst = amount * (gstRate / 2);
      const totalGST = sgst + cgst;
      const grandTotal = amount + totalGST;
      
      // Table for calculations
      doc.setFontSize(9);
      doc.text('Subtotal:', 130, yPos, null, null, 'right');
      doc.text(`Rs. ${amount.toFixed(2)}`, 165, yPos, null, null, 'right');
      yPos += 6;
      
      doc.text('SGST (9%):', 130, yPos, null, null, 'right');
      doc.text(`Rs. ${sgst.toFixed(2)}`, 165, yPos, null, null, 'right');
      yPos += 6;
      
      doc.text('CGST (9%):', 130, yPos, null, null, 'right');
      doc.text(`Rs. ${cgst.toFixed(2)}`, 165, yPos, null, null, 'right');
      yPos += 6;
      
      doc.setDrawColor(201, 161, 74);
      doc.setLineWidth(0.3);
      doc.line(120, yPos, 190, yPos);
      yPos += 6;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text('Total Amount:', 130, yPos, null, null, 'right');
      doc.text(`Rs. ${grandTotal.toFixed(2)}`, 165, yPos, null, null, 'right');
      
      // Amount in Words
      yPos += 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      const amountInWords = convertToWords(grandTotal);
      doc.text(`Amount in Words: ${amountInWords}`, 20, yPos);
      
      // ==================== TERMS & CONDITIONS ====================
      yPos += 15;
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.text('Terms & Conditions:', 20, yPos);
      
      yPos += 7;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      
      const terms = [
        '1. Consultation will be scheduled within 48 hours of payment confirmation.',
        '2. Cancellations must be made 24 hours in advance for full refund.',
        '3. Rescheduling is allowed with prior notice of at least 12 hours.',
        '4. All amounts are in Indian Rupees (INR) and include applicable taxes.',
        '5. For any queries, contact support@samraarchitect.com or call +91 98765 43210.',
        '6. This is a computer generated invoice and does not require signature.'
      ];
      
      terms.forEach(term => {
        const lines = doc.splitTextToSize(term, 170);
        lines.forEach(line => {
          if (yPos < 270) { // Check page boundary
            doc.text(line, 20, yPos);
            yPos += 4;
          }
        });
        yPos += 2;
      });
      
      // ==================== BANK DETAILS ====================
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(44, 62, 80);
      doc.text('BANK DETAILS FOR TRANSFER', 105, yPos, null, null, 'center');
      
      yPos += 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      
      const bankDetails = [
        'Bank Name: State Bank of India',
        'Account Name: Samra Architect',
        'Account Number: 12345678901',
        'IFSC Code: SBIN0001234',
        'Branch: Andheri West, Mumbai',
        'UPI ID: samraarchitect@upi'
      ];
      
      bankDetails.forEach(detail => {
        doc.text(detail, 20, yPos);
        yPos += 6;
      });
      
      // ==================== SIGNATURE ====================
      yPos += 15;
      doc.setDrawColor(201, 161, 74);
      doc.setLineWidth(0.5);
      doc.line(140, yPos, 190, yPos);
      yPos += 5;
      doc.text('Authorized Signatory', 165, yPos, null, null, 'right');
      
      // ==================== FOOTER ====================
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text('Thank you for choosing Samra Architect!', 105, 285, null, null, 'center');
      doc.text('For any queries, call +91 6375626274 or email support@samraarchitect.com', 105, 288, null, null, 'center');
      doc.text('This is a computer-generated invoice.', 105, 291, null, null, 'center');
      
      // ==================== SAVE PDF ====================
      const fileName = `Invoice_${invoiceData.id || 'SAMRA'}_${new Date().getTime()}.pdf`;
      doc.save(fileName);
      
      // Show success message
      showToast(`Invoice downloaded: ${fileName}`);
      
      // Track download
      trackInvoiceDownload(invoiceData.id);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      showToast('Error generating invoice. Please try again.', 'error');
    }
  };
  
  downloadInvoiceInitialized = true;
}

// Initialize the download function when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDownloadFunction);
} else {
  initializeDownloadFunction();
}

// Also try to initialize after various delays to allow jsPDF CDN time to load
setTimeout(initializeDownloadFunction, 100);
setTimeout(initializeDownloadFunction, 300);
setTimeout(initializeDownloadFunction, 800);
setTimeout(initializeDownloadFunction, 1500);
setTimeout(initializeDownloadFunction, 3000);
  
  // ==================== HELPER FUNCTIONS ====================
  
  // Convert number to words for invoice
  function convertToWords(num) {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    
    // Helper function for conversion without "Rupees" suffix
    function convertLessThanThousand(n) {
      if (n === 0) return '';
      
      let words = '';
      
      // Hundreds
      if (Math.floor(n / 100) > 0) {
        words += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      // Tens and Ones
      if (n > 0) {
        if (n < 20) {
          words += a[n];
        } else {
          words += b[Math.floor(n / 10)];
          if (n % 10 > 0) {
            words += ' ' + a[n % 10];
          }
        }
      }
      
      return words.trim();
    }
    
    const decimals = Math.round((num - Math.floor(num)) * 100);
    let n = Math.floor(num);
    
    if (n === 0) return 'Zero Rupees Only';
    
    let words = '';
    
    // Crores
    if (Math.floor(n / 10000000) > 0) {
      words += convertLessThanThousand(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }
    
    // Lakhs
    if (Math.floor(n / 100000) > 0) {
      words += convertLessThanThousand(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }
    
    // Thousands
    if (Math.floor(n / 1000) > 0) {
      words += convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }
    
    // Remainder
    if (n > 0) {
      words += convertLessThanThousand(n) + ' ';
    }
    
    words = words.trim() + ' Rupees';
    
    // Paise
    if (decimals > 0) {
      words += ' and ';
      if (decimals < 20) {
        words += a[decimals];
      } else {
        words += b[Math.floor(decimals / 10)];
        if (decimals % 10 > 0) {
          words += ' ' + a[decimals % 10];
        }
      }
      words += ' Paise';
    }
    
    return words + ' Only';
  }
  
  // Show toast notification
  window.showToast = function(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.invoice-toast');
    if (existingToast) existingToast.remove();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `invoice-toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#invoice-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'invoice-toast-styles';
      style.textContent = `
        .invoice-toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: white;
          color: #333;
          padding: 15px 25px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 10000;
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          font-weight: 500;
          min-width: 300px;
          max-width: 90%;
          text-align: center;
          border-top: 4px solid #28a745;
        }
        
        .invoice-toast.error {
          border-top-color: #dc3545;
        }
        
        .invoice-toast .toast-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .invoice-toast i {
          font-size: 20px;
          color: #28a745;
        }
        
        .invoice-toast.error i {
          color: #dc3545;
        }
        
        .invoice-toast.show {
          transform: translateX(-50%) translateY(0);
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 5000);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    });
  };
  
  // Track invoice download
  function trackInvoiceDownload(invoiceId) {
    const analyticsData = {
      invoiceId: invoiceId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
    
    // Save to localStorage for analytics
    const downloads = JSON.parse(localStorage.getItem('invoiceDownloads') || '[]');
    downloads.push(analyticsData);
    localStorage.setItem('invoiceDownloads', JSON.stringify(downloads.slice(-50))); // Keep last 50
    
    // Send to server (in production)
    if (window.sendAnalytics) {
      window.sendAnalytics('invoice_download', analyticsData);
    }
  }
  
  // Generate invoice screenshot for sharing
  window.generateInvoiceScreenshot = function() {
    try {
      const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
      
      // Create a temporary div for screenshot
      const screenshotDiv = document.createElement('div');
      screenshotDiv.id = 'invoice-screenshot';
      screenshotDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 400px;
        background: white;
        padding: 30px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        border-radius: 10px;
        z-index: 9999;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s;
      `;
      
      // Invoice content
      screenshotDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #c9a14a; padding-bottom: 15px;">
          <h2 style="color: #c9a14a; margin: 0; font-size: 28px;">SAMRA ARCHITECT</h2>
          <p style="color: #666; margin: 5px 0; font-size: 12px;">Designing Spaces. Defining Lifestyles.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px; font-size: 18px; border-left: 4px solid #c9a14a; padding-left: 10px;">
            INVOICE
          </h3>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Invoice ID:</strong> ${invoiceData.id || 'INV-001'}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Date:</strong> ${invoiceData.date || new Date().toLocaleDateString('en-IN')}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Client:</strong> ${invoiceData.client || 'Client'}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Service:</strong> ${invoiceData.service || 'Architectural Consultation'}</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Amount:</strong> ${invoiceData.amount || '₹999'}</p>
          ${invoiceData.utrNumber ? `<p style="margin: 8px 0; font-size: 14px;"><strong>UTR:</strong> ${invoiceData.utrNumber}</p>` : ''}
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 25px; border-left: 4px solid #28a745;">
          <p style="margin: 0; font-size: 13px; color: #155724;">
            <i class="fas fa-check-circle"></i> Payment Verified
          </p>
        </div>
        
        <div style="margin-top: 25px; text-align: center; font-size: 12px; color: #666; border-top: 1px dashed #ddd; padding-top: 15px;">
          <p style="margin: 5px 0;">Samra Architect</p>
          <p style="margin: 5px 0;">+91 98765 43210 | support@samraarchitect.com</p>
          <p style="margin: 5px 0;">www.samraarchitect.com</p>
        </div>
      `;
      
      document.body.appendChild(screenshotDiv);
      
      // Animate in
      setTimeout(() => {
        screenshotDiv.style.opacity = '1';
        screenshotDiv.style.transform = 'scale(1)';
      }, 10);
      
      // Use html2canvas for actual screenshot (if available)
      if (typeof html2canvas !== 'undefined') {
        setTimeout(() => {
          html2canvas(screenshotDiv, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
          }).then(canvas => {
            // Convert canvas to image
            const image = canvas.toDataURL('image/png');
            
            // Save image
            const link = document.createElement('a');
            link.download = `invoice_${invoiceData.id || 'samra'}.png`;
            link.href = image;
            link.click();
            
            // Clean up
            screenshotDiv.style.opacity = '0';
            screenshotDiv.style.transform = 'scale(0.8)';
            setTimeout(() => {
              screenshotDiv.remove();
            }, 300);
            
            showToast('Invoice screenshot saved!');
          });
        }, 1000);
      } else {
        // Fallback: Just show the div
        showToast('Take a screenshot manually', 'info');
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
          screenshotDiv.style.opacity = '0';
          screenshotDiv.style.transform = 'scale(0.8)';
          setTimeout(() => {
            screenshotDiv.remove();
          }, 300);
        }, 10000);
      }
      
    } catch (error) {
      console.error('Error generating screenshot:', error);
      showToast('Error generating screenshot', 'error');
    }
  };
  
  // Share invoice via WhatsApp with specific number
  window.shareInvoiceWhatsApp = function() {
    try {
      const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
      const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
      
      // WhatsApp number (remove + and spaces)
      const whatsappNumber = "919876543210";
      
      // Create message
      const message = `📋 *INVOICE - SAMRA ARCHITECT*\n\n` +
                     `*Invoice ID:* ${invoiceData.id || 'INV-001'}\n` +
                     `*Client:* ${invoiceData.client || bookingDetails.name || 'Client'}\n` +
                     `*Service:* ${invoiceData.service || 'Service'}\n` +
                     `*Amount:* ${invoiceData.amount || '₹0'}\n` +
                     `*Date:* ${invoiceData.date || new Date().toLocaleDateString('en-IN')}\n` +
                     `${invoiceData.utrNumber ? `*UTR:* ${invoiceData.utrNumber}\n` : ''}` +
                     `\n📞 *Contact:* +91 98765 43210\n` +
                     `📧 *Email:* support@samraarchitect.com\n\n` +
                     `_This is an automated invoice message._`;
      
      // Encode for URL
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      
      // Track share
      trackInvoiceShare('whatsapp', invoiceData.id);
      
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      showToast('Error sharing invoice', 'error');
    }
  };
  
  // Email invoice - opens default email client
  window.sendInvoiceEmail = function() {
    try {
      const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
      const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails')) || {};
      
      // Email addresses
      const clientEmail = invoiceData.email || bookingDetails.email || '';
      const companyEmail = "samraarchitect@gmail.com";
      
      // Subject
      const subject = `Invoice ${invoiceData.id} - Samra Architect`;
      
      // Body
      const body = `Dear ${invoiceData.client || bookingDetails.name || 'Client'},\n\n` +
                  `Thank you for your payment. Here are your invoice details:\n\n` +
                  `Invoice ID: ${invoiceData.id || 'INV-001'}\n` +
                  `Booking ID: ${invoiceData.bookingId || 'SAMRA-001'}\n` +
                  `Service: ${invoiceData.service || 'Architectural Consultation'}\n` +
                  `Amount: ${invoiceData.amount || '₹999'}\n` +
                  `Payment Method: ${invoiceData.paymentMethod || 'UPI'}\n` +
                  `${invoiceData.utrNumber ? `UTR Number: ${invoiceData.utrNumber}\n` : ''}` +
                  `Date: ${invoiceData.date || new Date().toLocaleDateString('en-IN')}\n\n` +
                  `Please find the invoice PDF attached.\n\n` +
                  `For any queries, please contact:\n` +
                  `Phone: +91 98765 43210\n` +
                  `Email: support@samraarchitect.com\n\n` +
                  `Best regards,\n` +
                  `Samra Architect Team\n` +
                  `www.samraarchitect.com`;
      
      // Create mailto link
      let mailtoLink = `mailto:${clientEmail}`;
      
      // Add CC to company email if client email exists
      if (clientEmail) {
        mailtoLink += `?cc=${companyEmail}`;
      } else {
        mailtoLink += `?to=${companyEmail}`;
      }
      
      mailtoLink += `&subject=${encodeURIComponent(subject)}`;
      mailtoLink += `&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Track email
      trackInvoiceShare('email', invoiceData.id);
      
    } catch (error) {
      console.error('Error sending email:', error);
      showToast('Error opening email client', 'error');
    }
  };
  
  // Track invoice sharing
  function trackInvoiceShare(platform, invoiceId) {
    const shareData = {
      invoiceId: invoiceId,
      platform: platform,
      timestamp: new Date().toISOString()
    };
    
    const shares = JSON.parse(localStorage.getItem('invoiceShares') || '[]');
    shares.push(shareData);
    localStorage.setItem('invoiceShares', JSON.stringify(shares.slice(-50)));
  }
  
  // Print invoice
  window.printInvoice = function() {
    try {
      // Create print-friendly version
      const printContent = document.getElementById('invoice-print') || document.querySelector('.invoice-content');
      
      if (printContent) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Invoice ${document.getElementById('invoiceId')?.textContent || ''}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .invoice-header { text-align: center; margin-bottom: 30px; }
              .invoice-header h1 { color: #c9a14a; }
              .invoice-details { margin: 20px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background: #2c3e50; color: white; padding: 10px; }
              td { padding: 10px; border: 1px solid #ddd; }
              .total { font-weight: bold; font-size: 1.2em; }
              .footer { margin-top: 50px; text-align: center; color: #666; font-size: 0.9em; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch (error) {
      console.error('Error printing invoice:', error);
      window.print(); // Fallback to default print
    }
  };
  
  // Initialize invoice page
  window.initializeInvoicePage = function() {
    // Check if jsPDF is loaded
    if (typeof jsPDF === 'undefined') {
      console.warn('jsPDF not loaded. Invoice download may not work.');
      
      // Load jsPDF dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = function() {
        console.log('jsPDF loaded dynamically');
      };
      document.head.appendChild(script);
    }
    
    // Auto-fill invoice data if on invoice page
    if (document.getElementById('invoiceId')) {
      const invoiceData = JSON.parse(localStorage.getItem('currentInvoice')) || {};
      
      // Populate fields
      const fields = {
        'invoiceId': invoiceData.id,
        'bookingId': invoiceData.bookingId,
        'invoiceDateTime': `${invoiceData.date || ''} ${invoiceData.time || ''}`,
        'invoiceService': invoiceData.service,
        'invoiceAmount': invoiceData.amount,
        'paymentMethod': invoiceData.paymentMethod,
        'transactionId': invoiceData.transactionId,
        'clientName': invoiceData.client,
        'clientEmail': invoiceData.email,
        'clientPhone': invoiceData.phone,
        'clientAddress': invoiceData.address,
        'projectType': invoiceData.projectType,
        'utrNumber': invoiceData.utrNumber
      };
      
      Object.keys(fields).forEach(id => {
        const element = document.getElementById(id);
        if (element && fields[id]) {
          element.textContent = fields[id];
        }
      });
    }
  };
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeInvoicePage);
  } else {
    window.initializeInvoicePage();
  }
  
  // Export functions for use in other scripts
  window.invoiceUtils = {
    downloadInvoice: window.downloadInvoice,
    generateInvoiceScreenshot: window.generateInvoiceScreenshot,
    shareInvoiceWhatsApp: window.shareInvoiceWhatsApp,
    sendInvoiceEmail: window.sendInvoiceEmail,
    printInvoice: window.printInvoice,
    showToast: window.showToast
  };

