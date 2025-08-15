// Enhanced hamburger menu functionality
document.getElementById('hamburger-btn').addEventListener('click', function() {
  this.classList.toggle('active');
  document.getElementById('main-nav').classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  if (window.scrollY > 50) { // Trigger effect sooner
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = 'var(--shadow-md)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = 'none';
  }
});

// Enhanced product card interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  // This function can be called by product-list.js after products are rendered
  window.observeProductCards = () => {
    document.querySelectorAll('.product-card').forEach(card => {
      // Set initial state for animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(card);
    });
  };
});