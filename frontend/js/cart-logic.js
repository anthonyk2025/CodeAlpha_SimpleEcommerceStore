// frontend/js/cart-logic.js

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
 * Adds an item to the cart. Handles existing items by increasing quantity.
 * @param {object} product - The product object to add.
 * @param {number} quantity - The quantity to add.
 */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.productId === product.productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }
  
  saveCart(cart);
}