// frontend/js/product-list.js
(function() {
  const API_URL = "/api/products";
  let allProducts = [];
  let currentFilters = {
    category: 'all',
    sort: 'default',
    search: ''
  };

  const productGrid = document.getElementById("product-grid");
  const loadingIndicator = document.getElementById("loading-indicator");
  const noResultsMessage = document.getElementById("no-results-message");
  const searchBar = document.getElementById("search-bar");
  const filterButtonsContainer = document.getElementById("filter-buttons");
  const sortBySelect = document.getElementById("sort-by");

  async function fetchProducts() {
    loadingIndicator.style.display = "block";
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      allProducts = await res.json();
      renderProducts();
    } catch (error) {
      console.error("Failed to load products:", error);
      productGrid.innerHTML = `<p class="error-text">Could not load products. Please try refreshing the page.</p>`;
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  function renderProducts() {
    let productsToDisplay = [...allProducts];

    // Filter by category
    if (currentFilters.category !== 'all') {
      productsToDisplay = productsToDisplay.filter(p => p.category === currentFilters.category);
    }
    // Filter by search term
    if (currentFilters.search) {
      productsToDisplay = productsToDisplay.filter(p => p.name.toLowerCase().includes(currentFilters.search));
    }
    
    // Sort products
    switch (currentFilters.sort) {
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
    
    productGrid.innerHTML = "";
    if (productsToDisplay.length === 0) {
      noResultsMessage.style.display = "block";
      return;
    }
    noResultsMessage.style.display = "none";

    productsToDisplay.forEach(product => {
      const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
      const productCardHTML = `
        <article class="product-card">
          <a href="product.html?id=${product._id}">
            ${badgeHTML}
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

  function addToCart(productData) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.productId === productData.productId);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ ...productData, qty: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  productGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-add-to-cart');
    if (button) {
      const productId = button.dataset.productId;
      const productToAdd = allProducts.find(p => p._id === productId);

      if (productToAdd) {
        addToCart({
            productId: productToAdd._id,
            name: productToAdd.name,
            price: productToAdd.price,
            image: productToAdd.image,
        });
        button.textContent = "Added!";
        button.disabled = true;
        setTimeout(() => {
          button.textContent = "Add to Cart";
          button.disabled = false;
        }, 1500);
      }
    }
  });
  
  searchBar.addEventListener('input', () => {
    currentFilters.search = searchBar.value.toLowerCase();
    renderProducts();
  });

  filterButtonsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (button) {
      currentFilters.category = button.dataset.category;
      filterButtonsContainer.querySelector('.active').classList.remove('active');
      button.classList.add('active');
      renderProducts();
    }
  });

  sortBySelect.addEventListener('change', (event) => {
    currentFilters.sort = event.target.value;
    renderProducts();
  });

  fetchProducts();
})();