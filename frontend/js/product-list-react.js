// frontend/js/product-list-react.js
'use strict';

function ProductList() {
    // --- 1. STATE MANAGEMENT ---
    // We now have state for everything that can change.
    const [allProducts, setAllProducts] = React.useState([]); // Holds the original, unfiltered list
    const [filters, setFilters] = React.useState({
        category: 'all',
        sort: 'default',
        search: ''
    });
    const [isLoading, setIsLoading] = React.useState(true);

    // --- 2. DATA FETCHING ---
    // This runs only once to get the products from the backend.
    React.useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setAllProducts(data); // Store the original list
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch products:", error);
                setIsLoading(false);
            });
    }, []);

    // --- 3. CART LOGIC (Same as before) ---
    const addToCart = (product) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find(item => item.productId === product._id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ productId: product._id, name: product.name, price: product.price, image: product.image, qty: 1 });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        showToast(`${product.name} added to cart!`);
    };

    // --- 4. DERIVED STATE: THE FILTERING LOGIC ---
    // This is the "magic". We calculate the products to display based on the current state.
    // This code runs every time the 'filters' or 'allProducts' state changes.
    const filteredAndSortedProducts = React.useMemo(() => {
        let productsToDisplay = [...allProducts];

        // Filter by category
        if (filters.category !== 'all') {
            productsToDisplay = productsToDisplay.filter(p => p.category === filters.category);
        }
        // Filter by search term
        if (filters.search) {
            productsToDisplay = productsToDisplay.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
        }
        // Sort products
        switch (filters.sort) {
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
        return productsToDisplay;
    }, [allProducts, filters]);


    // --- 5. CONNECT REACT TO EXTERNAL HTML CONTROLS ---
    // This effect connects our "dumb" HTML to our "smart" React state.
    React.useEffect(() => {
        const filterButtonsContainer = document.getElementById("filter-buttons");
        const sortBySelect = document.getElementById("sort-by");
        const searchBar = document.getElementById("search-bar");

        const handleCategoryClick = (event) => {
            const button = event.target.closest('.filter-btn');
            if (button) {
                // Update React state
                setFilters(prevFilters => ({ ...prevFilters, category: button.dataset.category }));
                
                // Also update the active class on the button itself
                filterButtonsContainer.querySelector('.active').classList.remove('active');
                button.classList.add('active');
            }
        };

        const handleSortChange = (event) => {
            setFilters(prevFilters => ({ ...prevFilters, sort: event.target.value }));
        };

        const handleSearchInput = (event) => {
            setFilters(prevFilters => ({ ...prevFilters, search: event.target.value }));
        };

        // Attach the event listeners
        filterButtonsContainer.addEventListener('click', handleCategoryClick);
        sortBySelect.addEventListener('change', handleSortChange);
        searchBar.addEventListener('input', handleSearchInput);

        // Cleanup: Remove listeners when the component is unmounted
        return () => {
            filterButtonsContainer.removeEventListener('click', handleCategoryClick);
            sortBySelect.removeEventListener('change', handleSortChange);
            searchBar.removeEventListener('input', handleSearchInput);
        };
    }, []); // Empty array means this runs only once to set up listeners.


    // --- 6. RENDERING LOGIC ---
    if (isLoading) {
        return <p>Loading products...</p>;
    }

    if (filteredAndSortedProducts.length === 0) {
        return <p>No products found matching your criteria.</p>;
    }

    return (
        <div className="grid">
            {filteredAndSortedProducts.map(product => (
                <article key={product._id} className="product-card">
                    <a href={`product.html?id=${product._id}`}>
                        {product.badge && <div className="product-badge">{product.badge}</div>}
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <span className="product-category">{product.category}</span>
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">${product.price.toFixed(2)}</p>
                        </div>
                    </a>
                    <button className="btn-primary btn-add-to-cart" onClick={() => addToCart(product)}>
                        Add to Cart
                    </button>
                </article>
            ))}
        </div>
    );
}

// Render the component into the page
ReactDOM.render(<ProductList />, document.getElementById('react-product-list'));