// frontend/js/orders.js
(function() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html?redirect=orders';
    return;
  }

  const ordersListContainer = document.getElementById('orders-list');
  const loadingIndicator = document.getElementById('loading-indicator');
  const emptyOrdersMessage = document.getElementById('empty-orders-message');

  async function loadOrders() {
    loadingIndicator.style.display = 'block';
    try {
      const res = await fetch('/api/orders/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch your orders. Please try again later.');
      }
      const orders = await res.json();
      
      loadingIndicator.style.display = 'none';

      if (orders.length === 0) {
        emptyOrdersMessage.style.display = 'block';
        ordersListContainer.style.display = 'none';
      } else {
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
                  <p>Order Placed</p>
                  <p><strong>${orderDate}</strong></p>
                </div>
                <div class="order-info">
                  <p>Total</p>
                  <p><strong>$${order.totalPrice.toFixed(2)}</strong></p>
                </div>
                <div class="order-info">
                  <p>Order ID</p>
                  <p>#${order._id}</p>
                </div>
              </div>
              <div class="order-body">
                <p><strong>Status:</strong> 
                  <span class="status-${order.isDelivered ? 'delivered' : 'processing'}">
                    ${order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </p>
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
  loadOrders();
})();