const API = window.location.origin.includes("localhost")
  ? "http://localhost:5000/api"
  : window.location.origin + "/api";

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    const line = item.price * item.qty;
    total += line;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <div>
        <div><strong>${item.name}</strong></div>
        <div>$${item.price.toFixed(2)}</div>
      </div>
      <div>
        <input type="number" min="1" value="${item.qty}" data-index="${i}" />
      </div>
      <div>
        <button data-remove="${i}">Remove</button>
      </div>
    `;
    row.querySelector("input").addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.index);
      const cart2 = JSON.parse(localStorage.getItem("cart") || "[]");
      cart2[idx].qty = Math.max(1, Number(e.target.value) || 1);
      localStorage.setItem("cart", JSON.stringify(cart2));
      renderCart();
    });
    row.querySelector("button[data-remove]").addEventListener("click", (e) => {
      const idx = Number(e.target.dataset.remove);
      const cart2 = JSON.parse(localStorage.getItem("cart") || "[]");
      cart2.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart2));
      renderCart();
    });
    list.appendChild(row);
  });
  document.getElementById("cartTotal").innerText = "Total: $" + total.toFixed(2);
}

async function checkout() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("checkoutMsg").innerText = "Please login first.";
    return;
  }
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    document.getElementById("checkoutMsg").innerText = "Cart is empty.";
    return;
  }
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ items: cart.map(c => ({ productId: c.productId, name: c.name, price: c.price, qty: c.qty })), total })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.removeItem("cart");
    document.getElementById("checkoutMsg").innerText = "Order placed successfully!";
    renderCart();
  } else {
    document.getElementById("checkoutMsg").innerText = data.message || "Checkout failed.";
  }
}

document.getElementById("checkoutBtn").addEventListener("click", checkout);
renderCart();
