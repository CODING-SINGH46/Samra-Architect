// Payment functionality

function completePayment() {
  // Get booking details from localStorage or URL
  const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails') || '{}');
  const amount = document.getElementById('orderAmount').textContent;
  const service = document.getElementById('orderService').textContent;
  const paymentVerification = JSON.parse(localStorage.getItem('paymentVerification') || '{}');
  const invoiceId = 'INV-' + Date.now();

const invoiceData = {
  id: invoiceId,
  date: new Date().toLocaleDateString('en-IN'),
  time: new Date().toLocaleTimeString('en-IN'),
  amount,
  service,
  client: bookingDetails.name,
  email: bookingDetails.email,
  phone: bookingDetails.phone,
  address: bookingDetails.address,
  projectType: bookingDetails.projectType,
  bookingId: `SAMRA-${Date.now()}`,
  paymentMethod: 'UPI',
  utrNumber: paymentVerification.utrNumber,
  paymentTime: paymentVerification.paymentDateTime,
  status: 'Paid'
};

  
  // Save invoice data
  localStorage.setItem('currentInvoice', JSON.stringify(invoiceData));
  
  // Send email notification if function exists
  if (typeof sendBookingEmail === 'function') {
    try {
      sendBookingEmail(bookingDetails, invoiceData);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  
  // Redirect to thank you page
  window.location.href = `thankyou.html?invoice=${invoiceId}&payment=success`;
}