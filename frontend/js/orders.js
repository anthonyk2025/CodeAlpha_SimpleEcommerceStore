// frontend/js/orders.js

(function() {
  // --- 1. Security Check ---
  const token = localStorage.getItem('token');
  if (!token) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return;
  }

  // --- 2. DOM Element Selection ---
  const ordersListContainer = document.getElementById('orders-list');
  const loadingIndicator = document.getElementById('loading-indicator');
  const emptyOrdersMessage = document.getElementById('empty-orders-message');

  /**
   * Fetches and displays the logged-in user's order history.
   */
  async function loadOrders() {
    if (!ordersListContainer || !loadingIndicator || !emptyOrdersMessage) {
      console.error('Required elements for orders page are missing!');
      return;
    }

    loadingIndicator.style.display = 'block';

    try {
      const res = await fetch('/api/orders/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch your orders. Please try again later.');
      }

      const orders = await res.json();
      
      loadingIndicator.style.display = 'none';

      if (orders.length === 0) {
        // If there are no orders, show the "empty" message
        emptyOrdersMessage.style.display = 'block';
        ordersListContainer.style.display = 'none';
      } else {
        // If there are orders, hide the "empty" message and render the list
        emptyOrdersMessage.style.display = 'none';
        ordersListContainer.style.display = 'block';
        
        ordersListContainer.innerHTML = orders.map(order => {
          const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });
          
          return `
            <div class="order-card">
              <div class="order-header">
                <div class="order-info">
                  <p><strong>Order Placed:</strong></p>
                  <p>${orderDate}</p>
                </div>
                <div class="order-info">
                  <p><strong>Total:</strong></p>
                  <p>$${order.totalPrice.toFixed(2)}</p>
                </div>
                <div class="order-info">
                  <p><strong>Order ID:</strong></p>
                  <p>#${order._id}</p>
                </div>
              </div>
              <div class="order-body">
                <p><strong>Status:</strong> 
                  <span class="status-${order.isDelivered ? 'delivered' : 'processing'}">
                    ${order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </p>
                <!-- In a real app, this would link to a page showing items in this specific order -->
                <!-- <a href="order-details.html?id=${order._id}" class="btn-secondary">View Details</a> -->
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (error) {
      loadingIndicator.style.display = 'none';
      ordersListContainer.innerHTML = `<p class="error-text">${error.message}</p>`;
    }
  }

  // Initial Load
  loadOrders();

})();