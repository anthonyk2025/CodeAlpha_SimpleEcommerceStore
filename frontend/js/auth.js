// frontend/js/auth.js

(function() {
  // --- 1. Configuration and DOM Selection ---
  const API_URL = window.location.origin.includes("localhost")
    ? "http://localhost:5000/api/users"
    : `${window.location.origin}/api/users`;

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  // A single error message element is used by both forms
  const errorMessageElem = document.getElementById('error-message');

  // --- 2. Login Form Handler ---
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginButton = document.getElementById('login-button');
      loginButton.disabled = true;
      loginButton.textContent = 'Logging in...';
      errorMessageElem.textContent = ''; // Clear previous errors

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Login failed.');
        }

        // --- Success! ---
        localStorage.setItem('token', data.token); // Save the token
        window.location.href = 'index.html'; // Redirect to the homepage

      } catch (error) {
        errorMessageElem.textContent = error.message;
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }
    });
  }

  // --- 3. Registration Form Handler ---
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const registerButton = document.getElementById('register-button');
      registerButton.disabled = true;
      registerButton.textContent = 'Creating Account...';
      errorMessageElem.textContent = ''; // Clear previous errors

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      // Client-side validation
      if (password !== confirmPassword) {
        errorMessageElem.textContent = 'Passwords do not match.';
        registerButton.disabled = false;
        registerButton.textContent = 'Create Account';
        return;
      }

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Registration failed.');
        }
        
        // --- Success! ---
        localStorage.setItem('token', data.token); // Save token to log them in
        window.location.href = 'index.html'; // Redirect to homepage

      } catch (error) {
        errorMessageElem.textContent = error.message;
      } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Create Account';
      }
    });
  }
})();