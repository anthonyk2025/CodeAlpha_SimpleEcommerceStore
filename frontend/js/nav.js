// frontend/js/nav.js
(function() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('main-nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
})();