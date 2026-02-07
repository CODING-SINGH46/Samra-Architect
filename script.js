// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  window.toggleMenu = function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
  };
  
  // Close offer banner
  window.closeOffer = function() {
    const offerBanner = document.querySelector('.offer-banner');
    offerBanner.style.display = 'none';
  };
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Form validation for booking
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      
      // Phone validation
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(phone.value)) {
        alert('Please enter a valid phone number');
        e.preventDefault();
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        alert('Please enter a valid email address');
        e.preventDefault();
        return;
      }
    });
  }
  
  // Auto-slide offer text (if multiple offers)
  const offerTexts = [
    "🎉 Get 15% off on your first project! Limited time offer.",
    "🌟 New client special: Free 3D visualization with any full package!",
    "🏆 Award-winning design team now accepting new projects."
  ];
  
  let currentOffer = 0;
  const offerElement = document.querySelector('.offer-text');
  
  if (offerElement) {
    setInterval(() => {
      currentOffer = (currentOffer + 1) % offerTexts.length;
      offerElement.style.opacity = 0;
      
      setTimeout(() => {
        offerElement.textContent = offerTexts[currentOffer];
        offerElement.style.opacity = 1;
      }, 300);
    }, 5000);
  }
  
  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  document.querySelectorAll('.service-card, .portfolio-item, .stat-item').forEach(el => {
    observer.observe(el);
  });
});

// Price calculation function
function calculateCustomQuote() {
  const area = prompt('Enter project area (in sq ft):');
  const type = prompt('Project type (Residential/Commercial):');
  
  if (area && type) {
    const baseRate = type.toLowerCase() === 'residential' ? 50 : 70;
    const quote = area * baseRate;
    
    alert(`Estimated quote for ${area} sq ft ${type} project: ₹${quote.toLocaleString()}`);
    
    // Pre-fill booking form
    localStorage.setItem('customQuote', quote);
    localStorage.setItem('projectType', type);
    
    window.location.href = 'book.html';
  }
}