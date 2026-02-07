// EmailJS integration for sending booking details
(function() {
  // Initialize EmailJS with your user ID
  emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your actual EmailJS user ID
  
  // Email template for Samra Architect
  const TEMPLATE_ID = "template_samra_booking"; // Create this template in EmailJS
  const SERVICE_ID = "service_samra_architect"; // Create this service in EmailJS
})();

function sendBookingEmail(bookingDetails, invoiceData) {
  // Prepare email parameters
  const templateParams = {
    to_email: "samraarchitect@gmail.com", // Replace with actual email
    from_name: bookingDetails.name || "New Client",
    client_name: bookingDetails.name,
    client_email: bookingDetails.email,
    client_phone: bookingDetails.phone,
    service_type: invoiceData.service,
    project_type: bookingDetails.projectType,
    project_details: bookingDetails.details,
    amount: invoiceData.amount,
    invoice_id: invoiceData.id,
    date: new Date().toLocaleString(),
    project_location: bookingDetails.address,
    timeline: bookingDetails.timeline
  };
  
  // Send email using EmailJS
  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
    .then(function(response) {
      console.log('Email sent successfully!', response.status, response.text);
    }, function(error) {
      console.log('Failed to send email:', error);
      // Fallback: Log to console or send to alternative service
      console.log('Booking Details:', templateParams);
    });
  
  // Also send confirmation email to client
  sendClientConfirmation(bookingDetails, invoiceData);
}

function sendClientConfirmation(bookingDetails, invoiceData) {
  const clientTemplateParams = {
    to_email: bookingDetails.email,
    client_name: bookingDetails.name,
    service_type: invoiceData.service,
    amount: invoiceData.amount,
    invoice_id: invoiceData.id,
    date: invoiceData.date,
    next_steps: "Our team will contact you within 24 hours to schedule your consultation."
  };
  
  emailjs.send(SERVICE_ID, "template_client_confirmation", clientTemplateParams)
    .then(function(response) {
      console.log('Confirmation email sent to client');
    }, function(error) {
      console.log('Failed to send confirmation:', error);
    });
}

// Alternative: Form submission if EmailJS not available
function submitBooking(event) {
  event.preventDefault();
  
  // Collect form data
  const bookingDetails = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    service: document.getElementById('service').value,
    projectType: document.getElementById('projectType').value,
    timeline: document.getElementById('timeline').value,
    details: document.getElementById('details').value,
    source: document.getElementById('source').value,
    date: new Date().toISOString()
  };
  
  // Save to localStorage for payment page
  localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
  
  // Get selected service price
  const serviceSelect = document.getElementById('service');
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  const [serviceId, price, serviceName] = selectedOption.value.split('|');
  
  // Redirect to payment page
  window.location.href = `payment.html?service=${encodeURIComponent(serviceName)}&price=${price}`;
}

// Update price summary in booking form
function updatePrice() {
  const serviceSelect = document.getElementById('service');
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
  
  if (selectedOption.value) {
    const [serviceId, price, serviceName] = selectedOption.value.split('|');
    
    document.getElementById('serviceName').textContent = serviceName;
    document.getElementById('servicePrice').textContent = price === '0' ? 'Custom Quote' : `₹${price}`;
    document.getElementById('priceSummary').style.display = 'block';
  } else {
    document.getElementById('priceSummary').style.display = 'none';
  }
}