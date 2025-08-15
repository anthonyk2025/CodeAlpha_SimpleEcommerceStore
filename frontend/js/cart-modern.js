// js/cart-modern.js
(function() {
  // --- 1. DOM Element Selection ---
  const cartItemsContainer = document.getElementById('cart-items-container');
  const orderSummaryContainer = document.getElementById('order-summary-container');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  
  const summarySubtotalElem = document.getElementById('summary-subtotal');
  const summaryTotalElem = document.getElementById('summary-total');
  
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutMessage = document.getElementById('checkout-message');

  // --- 2. Core Cart Logic ---

  /**
   * Retrieves the cart from localStorage.
   * @returns {Array} The cart items.
   */
  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  /**
   * Saves the cart to localStorage.
   * @param {Array} cart - The cart array to save.
   */
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /**
   * Updates the quantity of a specific item in the cart.
   * @param {string} productId - The ID of the product to update.
   * @param {number} newQuantity - The new quantity for the product.
   */
  function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex > -1 && newQuantity > 0) {
      cart[itemIndex].qty = newQuantity;
      saveCart(cart);
      renderCart(); // Re-render the entire cart to reflect changes
    }
  }

  /**
   * Removes an item completely from the cart.
   * @param {string} productId - The ID of the product to remove.
   */
  function removeItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    renderCart(); // Re-render the entire cart
  }

  /**
   * Calculates and displays the subtotal and total.
   */
  function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = 5.00; // Example fixed shipping
    const total = subtotal + shipping;

    summarySubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    summaryTotalElem.textContent = `$${total.toFixed(2)}`;
  }

  /**
   * The main function to render the entire cart page.
   */
  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      // Show the empty cart message and hide the main content
      emptyCartMessage.style.display = 'block';
      cartItemsContainer.style.display = 'none';
      orderSummaryContainer.style.display = 'none';
      return;
    }

    // Ensure the main content is visible and empty message is hidden
    emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    orderSummaryContainer.style.display = 'block';

    cartItemsContainer.innerHTML = ''; // Clear previous items

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
            <label for="qty-${item.productId}" class="sr-only">Quantity:</label>
            <input type="number" id="qty-${item.productId}" value="${item.qty}" min="1" class="quantity-input" data-id="${item.productId}">
          </div>
          <p class="item-total-price">$${itemTotalPrice}</p>
          <button class="remove-item-btn" data-id="${item.productId}" aria-label="Remove ${item.name}">×</button>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    calculateTotals();
  }

  // --- 3. Event Listeners ---

  // Event Delegation for quantity changes and item removal
  cartItemsContainer.addEventListener('click', (event) => {
    const target = event.target;

    // Handle item removal
    if (target.classList.contains('remove-item-btn')) {
      const productId = target.dataset.id;
      removeItem(productId);
    }
  });

  cartItemsContainer.addEventListener('change', (event) => {
    const target = event.target;
    // Handle quantity updates
    if (target.classList.contains('quantity-input')) {
      const productId = target.dataset.id;
      const newQuantity = parseInt(target.value, 10);
      updateQuantity(productId, newQuantity);
    }
  });
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        // Redirect to the new checkout page
        window.location.href = 'checkout.html';
    });
  }

  // --- 4. Initial Load ---
  renderCart();

})();