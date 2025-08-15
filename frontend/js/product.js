// frontend/js/product.js
(function() {
  const API_URL = "/api/products";
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

  function showLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
    if (isLoading) {
      productLayout.style.display = 'none';
      errorMessageElem.style.display = 'none';
    }
  }

  function showError(message) {
    showLoading(false);
    productLayout.style.display = 'none';
    errorMessageElem.style.display = 'block';
    errorMessageElem.querySelector('p').textContent = message;
  }
  
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
      quantitySelector.max = product.countInStock;
    } else {
      productStockElem.textContent = 'Out of Stock';
      productStockElem.style.color = 'var(--error-color)';
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = 'Out of Stock';
    }
    addToCartBtn.dataset.productId = product._id;
  }

  function handleAddToCart() {
    const productId = addToCartBtn.dataset.productId;
    const qty = parseInt(quantitySelector.value, 10);
    
    const productData = {
      productId,
      name: productNameElem.textContent,
      price: parseFloat(productPriceElem.textContent.replace('$', '')),
      image: productImageElem.src,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.push({ ...productData, qty });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    addToCartBtn.textContent = 'Added!';
    addToCartBtn.disabled = true;
    setTimeout(() => { 
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.disabled = false;
    }, 2000);
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', handleAddToCart);
  }

  loadProduct();
})();