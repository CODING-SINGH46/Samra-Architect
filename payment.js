// Payment functionality
let selectedPaymentMethod = 'upi';

function selectPayment(method) {
  selectedPaymentMethod = method;
  
  // Update UI
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  // Show corresponding section
  document.querySelectorAll('.payment-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(method + 'Section').classList.add('active');
}

function payWithApp(app) {
  const amount = document.getElementById('orderAmount').textContent.replace('₹', '');
  const service = document.getElementById('orderService').textContent;
  
  let upiUrl = '';
  switch(app) {
    case 'gpay':
      upiUrl = `tez://upi/pay?pa=samraarchitect@upi&pn=Samra Architect&am=${amount}&cu=INR`;
      break;
    case 'phonepe':
      upiUrl = `phonepe://pay?pa=samraarchitect@upi&pn=Samra Architect&am=${amount}`;
      break;
    case 'paytm':
      upiUrl = `paytmmp://pay?pa=samraarchitect@upi&pn=Samra Architect&am=${amount}`;
      break;
    default:
      upiUrl = `upi://pay?pa=samraarchitect@upi&pn=Samra Architect&am=${amount}&cu=INR`;
  }
  
  window.location.href = upiUrl;
  
  // Fallback if app not installed
  setTimeout(() => {
    if (!document.hidden) {
      alert(`Please open ${app} app manually to complete payment`);
    }
  }, 1000);
}

function openUPIApp() {
  const amount = document.getElementById('orderAmount').textContent.replace('₹', '');
  const service = document.getElementById('orderService').textContent;
  
  const upiUrl = `upi://pay?pa=samraarchitect@upi&pn=Samra%20Architect&am=${amount}&cu=INR&tn=${encodeURIComponent(service)}`;
  
  window.location.href = upiUrl;
  
  setTimeout(() => {
    if (!document.hidden) {
      alert('Please open your UPI app to complete payment');
    }
  }, 1000);
}

function downloadQR() {
  const canvas = document.querySelector('#qrcode canvas');
  const link = document.createElement('a');
  link.download = 'samra-payment-qr.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function processCardPayment() {
  // Simulate payment processing
  showPaymentLoader();
  
  setTimeout(() => {
    hidePaymentLoader();
    completePayment();
  }, 2000);
}

function completePayment() {
  // Get booking details from localStorage or URL
  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails') || '{}');
  const amount = document.getElementById('orderAmount').textContent;
  const service = document.getElementById('orderService').textContent;
  
  // Generate invoice
  const invoiceId = 'INV-' + Date.now();
  const invoiceData = {
    id: invoiceId,
    date: new Date().toLocaleDateString(),
    amount: amount,
    service: service,
    client: bookingDetails.name || 'Client',
    email: bookingDetails.email || ''
  };
  
  // Save invoice data
  localStorage.setItem('currentInvoice', JSON.stringify(invoiceData));
  
  // Send email notification (simulated)
  sendBookingEmail(bookingDetails, invoiceData);
  
  // Redirect to thank you page
  window.location.href = `thankyou.html?invoice=${invoiceId}&payment=success`;
}

function showPaymentLoader() {
  const loader = document.createElement('div');
  loader.className = 'payment-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="spinner"></div>
      <p>Processing payment...</p>
    </div>
  `;
  document.body.appendChild(loader);
}

function hidePaymentLoader() {
  const loader = document.querySelector('.payment-loader');
  if (loader) loader.remove();
}

// Add to style.css
const paymentStyles = `
.payment-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = paymentStyles;
document.head.appendChild(styleSheet);