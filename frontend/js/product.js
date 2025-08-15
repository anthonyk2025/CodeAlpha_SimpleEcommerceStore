// frontend/js/product.js

(function() {
  const API_URL = window.location.origin.includes("localhost") ? "http://localhost:5000/api/products" : `${window.location.origin}/api/products`;

  // --- DOM Element Selection ---
  const productLayout = document.querySelector('.product-layout');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorMessageElem = document.getElementById('error-message');
  
  const productNameElem = document.getElementById('product-name');
  const productPriceElem = document.getElementById('product-price');
  const productImageElem = document.getElementById('product-image');
  const productStockElem = document.getElementById('product-stock');
  const productDescriptionElem = document.getElementById('product-description');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const addToCartMessage = document.getElementById('add-to-cart-message');
  const quantitySelector = document.getElementById('quantity-selector');

  async function loadProduct() {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) {
      showError('No product ID specified.');
      return;
    }
    showLoading(true);
    try {
      const res = await fetch(`${API_URL}/${productId}`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'Product not found.' : 'Could not fetch product.');
      }
      const product = await res.json();
      renderProduct(product);
    } catch (error) {
      showError(error.message);
    } finally {
      showLoading(false);
    }
  }

  function renderProduct(product) {
    productLayout.style.display = 'grid';
    document.title = `${product.name} - TechNova`;
    
    productNameElem.textContent = product.name;
    productPriceElem.textContent = `$${product.price.toFixed(2)}`;
    productImageElem.src = product.image;
    productImageElem.alt = product.name;
    productDescriptionElem.textContent = product.description;

    if (product.countInStock > 0) {
      productStockElem.textContent = 'In Stock';
      productStockElem.style.color = 'var(--success-color)';
      addToCartBtn.disabled = false;
    } else {
      productStockElem.textContent = 'Out of Stock';
      productStockElem.style.color = 'var(--error-color)';
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Out of Stock';
    }
    addToCartBtn.dataset.productId = product._id;
  }

  function addToCart() {
    const productId = addToCartBtn.dataset.productId;
    const qty = parseInt(quantitySelector.value, 10);
    
    const product = {
      productId,
      name: productNameElem.textContent,
      price: parseFloat(productPriceElem.textContent.replace('$', '')),
      image: productImageElem.src,
      qty: qty
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].qty += qty;
    } else {
      cart.push(product);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    addToCartMessage.textContent = 'Added to cart!';
    setTimeout(() => { addToCartMessage.textContent = ''; }, 2000);
  }

  function showLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
    if (isLoading) {
      productLayout.style.display = 'none';
      errorMessageElem.style.display = 'none';
    }
  }

  function showError(message) {
    productLayout.style.display = 'none';
    errorMessageElem.style.display = 'block';
    errorMessageElem.querySelector('p').textContent = message;
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', addToCart);
  }

  loadProduct();
})();