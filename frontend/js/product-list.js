// frontend/js/product-list.js

(function() {
  const API_URL = window.location.origin.includes("localhost") ? "http://localhost:5000/api" : `${window.location.origin}/api`;
  let allProducts = [];
  let currentCategory = 'all';
  let currentSort = 'default';

  const productGrid = document.getElementById("product-grid");
  const loadingIndicator = document.getElementById("loading-indicator");
  const noResultsMessage = document.getElementById("no-results-message");
  const searchBar = document.getElementById("search-bar");
  const filterButtonsContainer = document.getElementById("filter-buttons");
  const sortBySelect = document.getElementById("sort-by");

  async function fetchAndRenderProducts() {
    showLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      allProducts = await res.json();
      renderProducts();
    } catch (error) {
      console.error("Failed to load products:", error);
      showError("Could not load products. Please try again later.");
    } finally {
      showLoading(false);
    }
  }

  function renderProducts() {
    productGrid.innerHTML = "";
    const searchTerm = searchBar.value.toLowerCase();
    let productsToDisplay = [...allProducts];

    if (currentCategory !== 'all') {
      productsToDisplay = productsToDisplay.filter(product => product.category === currentCategory);
    }
    if (searchTerm) {
      productsToDisplay = productsToDisplay.filter(product => product.name.toLowerCase().includes(searchTerm));
    }
    
    switch (currentSort) {
      case 'price-asc':
        productsToDisplay.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        productsToDisplay.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    if (productsToDisplay.length === 0) {
      noResultsMessage.style.display = "block";
      return;
    }
    noResultsMessage.style.display = "none";

    productsToDisplay.forEach(product => {
      const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
      const productCardHTML = `
        <article class="product-card">
          ${badgeHTML}
          <a href="product.html?id=${product._id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
              <span class="product-category">${product.category}</span>
              <h3 class="product-name">${product.name}</h3>
              <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
          </a>
          <button class="btn-primary btn-add-to-cart" data-product-id="${product._id}">Add to Cart</button>
        </article>
      `;
      productGrid.insertAdjacentHTML('beforeend', productCardHTML);
    });
  }

  // --- THIS IS THE NEW, CORRECT addToCart FUNCTION ---
  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(item => item.productId === product.productId);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].qty += 1; // Add one to the quantity
    } else {
      cart.push({ ...product, qty: 1 }); // Add the new item with quantity 1
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function showLoading(isLoading) { /* ... (This function is fine) ... */ }
  function showError(message) { /* ... (This function is fine) ... */ }

  // --- THIS IS THE CORRECTED EVENT LISTENER ---
  if (productGrid) {
    productGrid.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-add-to-cart');
      if (button) {
        event.preventDefault();
        const productId = button.dataset.productId;
        
        // Find the full product object from our list
        const productToAdd = allProducts.find(p => p._id === productId);

        if (productToAdd) {
          // Pass the necessary details to the addToCart function
          addToCart({
              productId: productToAdd._id,
              name: productToAdd.name,
              price: productToAdd.price,
              image: productToAdd.image,
          });

          // Provide user feedback
          button.textContent = "Added!";
          button.disabled = true;
          setTimeout(() => {
            button.textContent = "Add to Cart";
            button.disabled = false;
          }, 1500);
        }
      }
    });
  }
  
  if (searchBar) { searchBar.addEventListener('input', renderProducts); }

  if (filterButtonsContainer) {
    filterButtonsContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-btn');
      if (button) {
        currentCategory = button.dataset.category;
        filterButtonsContainer.querySelector('.active').classList.remove('active');
        button.classList.add('active');
        renderProducts();
      }
    });
  }

  if (sortBySelect) {
    sortBySelect.addEventListener('change', (event) => {
      currentSort = event.target.value;
      renderProducts();
    });
  }

  fetchAndRenderProducts();
})();