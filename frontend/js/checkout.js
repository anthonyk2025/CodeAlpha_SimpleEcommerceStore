// frontend/js/checkout.js

(function() {
  // --- 1. Security Checks ---
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  // --- 2. Group Cart Items for Display ---
  const groupedCart = new Map();
  cart.forEach(item => {
    if (groupedCart.has(item.productId)) {
      groupedCart.get(item.productId).qty += item.qty;
    } else {
      groupedCart.set(item.productId, { ...item });
    }
  });
  const groupedCartItems = Array.from(groupedCart.values());

  // --- 3. DOM Element Selection ---
  const productListElem = document.getElementById('summary-product-list');
  const subtotalElem = document.getElementById('summary-subtotal');
  const shippingElem = document.getElementById('summary-shipping');
  const totalElem = document.getElementById('summary-total');
  const paymentForm = document.getElementById('payment-form');
  const errorMessageElem = document.getElementById('error-message');
  const cardErrorsElem = document.getElementById('card-errors');
  const submitButton = document.getElementById('submit-button');
  
  // --- 4. Price Calculation & Rendering ---
  const itemsPrice = groupedCartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 5.00;
  const totalPrice = itemsPrice + shippingPrice;

  subtotalElem.textContent = `$${itemsPrice.toFixed(2)}`;
  shippingElem.textContent = `$${shippingPrice.toFixed(2)}`;
  totalElem.textContent = `$${totalPrice.toFixed(2)}`;
  submitButton.textContent = `Pay $${totalPrice.toFixed(2)}`;
  
  productListElem.innerHTML = groupedCartItems.map(item => `
    <li class="summary-item">
      <img src="${item.image}" alt="${item.name}" class="summary-item-image">
      <div class="summary-item-details">
        <span>${item.name} (x${item.qty})</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    </li>
  `).join('');

  // --- 5. Stripe Initialization ---
  let stripe, cardElement;
  async function initializeStripe() {
    try {
      const res = await fetch('/api/config/stripe');
      if (!res.ok) throw new Error('Could not fetch Stripe configuration.');
      const { publishableKey } = await res.json();
      stripe = Stripe(publishableKey);
      const elements = stripe.elements();
      cardElement = elements.create('card', { style: { base: { fontSize: '16px' } } });
      cardElement.mount('#card-element');
      cardElement.on('change', (event) => {
        cardErrorsElem.textContent = event.error ? event.error.message : '';
      });
    } catch (error) {
      errorMessageElem.textContent = "Failed to load payment form. Please refresh.";
    }
  }
  initializeStripe();

  // --- 6. Form Submission Handler ---
  paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    errorMessageElem.textContent = '';
    
    const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    if (error) {
      cardErrorsElem.textContent = error.message;
      submitButton.disabled = false;
      submitButton.textContent = `Pay $${totalPrice.toFixed(2)}`;
      return;
    }

    const orderData = {
      orderItems: cart,
      shippingAddress: {
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,
      },
      itemsPrice, shippingPrice, totalPrice,
      paymentMethodId: paymentMethod.id,
    };
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        localStorage.removeItem('cart');
        alert('Payment successful! Your order has been placed.');
        window.location.href = 'orders.html';
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to place order.');
      }
    } catch (err) {
      errorMessageElem.textContent = err.message;
      submitButton.disabled = false;
      submitButton.textContent = `Pay $${totalPrice.toFixed(2)}`;
    }
  });
})();