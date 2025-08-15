// frontend/js/auth-ui.js
(function() {
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");
  const ordersLink = document.getElementById("ordersLink");
  const userGreeting = document.getElementById("userGreeting");

  function decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  function updateUI() {
    const token = localStorage.getItem("token");
    let user = null;
    if (token) {
      const decodedToken = decodeJwt(token);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        user = decodedToken;
      } else {
        localStorage.removeItem("token");
      }
    }

    if (user) {
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
      if (logoutLink) logoutLink.style.display = "inline";
      if (ordersLink) ordersLink.style.display = "inline";
      if (userGreeting) {
        userGreeting.textContent = `Hello, ${user.name}`;
        userGreeting.style.display = "inline";
      }
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          window.location.href = '/index.html';
        });
      }
    } else {
      if (logoutLink) logoutLink.style.display = "none";
      if (ordersLink) ordersLink.style.display = "none";
      if (userGreeting) userGreeting.style.display = "none";
      if (loginLink) loginLink.style.display = "inline";
      if (registerLink) registerLink.style.display = "inline";
    }
  }

  document.addEventListener('DOMContentLoaded', updateUI);
})();