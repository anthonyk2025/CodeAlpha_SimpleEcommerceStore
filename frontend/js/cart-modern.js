// frontend/js/cart-modern.js

(function() {
  // --- 1. DOM Element Selection ---
  const cartItemsContainer = document.getElementById('cart-items-container');
  const orderSummaryContainer = document.getElementById('order-summary-container');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const summarySubtotalElem = document.getElementById('summary-subtotal');
  const summaryShippingElem = document.getElementById('summary-shipping');
  const summaryTotalElem = document.getElementById('summary-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // --- 2. Core Cart Logic ---

  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    // Ensure quantity is a valid number and at least 1
    const qty = Math.max(1, parseInt(newQuantity, 10) || 1);
    if (itemIndex > -1) {
      cart[itemIndex].qty = qty;
      saveCart(cart);
      renderCart();
    }
  }

  function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    renderCart();
  }

  /**
   * --- THIS IS THE FIX ---
   * This function is now more robust. It uses parseFloat to ensure all values are
   * treated as numbers before doing math, which fixes the $0.00 total bug.
   */
  function calculateTotals() {
    const cart = getCart();
    
    // ENHANCEMENT: Use parseFloat for safety, preventing calculation errors.
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.qty, 10) || 0;
        return sum + (price * qty);
    }, 0);

    const shipping = subtotal > 100 || subtotal === 0 ? 0 : 5.00; // Free shipping for orders over $100
    const total = subtotal + shipping;

    summarySubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    summaryShippingElem.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    summaryTotalElem.textContent = `$${total.toFixed(2)}`;
  }

  /**
   * --- THIS IS THE REDESIGN ---
   * The main render function now creates a more professional layout for each cart item.
   */
  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      emptyCartMessage.style.display = 'block';
      document.querySelector('.cart-grid').style.display = 'none';
      document.querySelector('.cart-actions-header').style.display = 'none';
      return;
    }

    emptyCartMessage.style.display = 'none';
    document.querySelector('.cart-grid').style.display = 'grid';
    document.querySelector('.cart-actions-header').style.display = 'block';
    
    orderSummaryContainer.style.display = 'block';

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
      const itemTotalPrice = (item.price * item.qty).toFixed(2);
      const cartItemHTML = `
        <div class="cart-item">
          <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
          <div class="item-quantity">
            <input type="number" value="${item.qty}" min="1" class="quantity-input" data-id="${item.productId}" aria-label="Quantity for ${item.name}">
          </div>
          <p class="item-total-price">$${itemTotalPrice}</p>
          <button class="remove-item-btn" data-id="${item.productId}" aria-label="Remove ${item.name}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
          </button>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    calculateTotals();
  }

  // --- 3. Event Listeners ---
  cartItemsContainer.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-item-btn');
    if (removeButton) {
      removeItem(removeButton.dataset.id);
    }
  });

  cartItemsContainer.addEventListener('change', (event) => {
    if (event.target.classList.contains('quantity-input')) {
      updateQuantity(event.target.dataset.id, event.target.value);
    }
  });
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html?redirect=checkout';
      } else {
        window.location.href = 'checkout.html';
      }
    });
  }

  // Initial Load
  renderCart();
})();