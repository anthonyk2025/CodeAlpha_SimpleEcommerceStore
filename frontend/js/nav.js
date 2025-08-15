// js/nav.js
(function() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('main-nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      // Toggle the 'active' class on both the button and the nav menu
      hamburgerBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
})();