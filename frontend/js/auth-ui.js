(function() {
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");
  const ordersLink = document.getElementById("ordersLink");
  const userGreeting = document.getElementById("userGreeting"); // A new element for greeting

  // Helper function to decode a JWT payload
  function decodeJwt(token) {
    try {
      // The payload is the middle part of the token, Base64-encoded
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      // If decoding fails, the token is invalid
      return null;
    }
  }

  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    const decodedToken = decodeJwt(token);
    // Check if the token is valid and not expired
    if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
      user = decodedToken;
    } else {
      // Token is invalid or expired, so remove it
      localStorage.removeItem("token");
    }
  }

  // UI update logic based on whether a valid user exists
  if (user) {
    // User is logged in with a valid token
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    
    if (logoutLink) logoutLink.style.display = "inline";
    if (ordersLink) ordersLink.style.display = "inline";
    
    // Display a greeting if the element exists
    if (userGreeting) {
      userGreeting.textContent = `Hello, ${user.name}`; // Assumes 'name' is in the JWT payload
      userGreeting.style.display = "inline";
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = '/index.html'; // Redirect to home on logout
      });
    }
  } else {
    // User is logged out
    if (logoutLink) logoutLink.style.display = "none";
    if (ordersLink) ordersLink.style.display = "none";
    if (userGreeting) userGreeting.style.display = "none";
  }
})();