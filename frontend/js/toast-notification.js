// frontend/js/toast-notification.js

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  // Create the toast element
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;

  // Add it to the container
  container.appendChild(toast);

  // Animate it in
  setTimeout(() => {
    toast.classList.add('show');
  }, 10); // A tiny delay to allow CSS transitions to work

  // Set a timer to remove it
  setTimeout(() => {
    toast.classList.remove('show');
    // Remove the element from the DOM after the fade-out animation completes
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000); // The toast will be visible for 3 seconds
}