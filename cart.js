// ============================================
// cart.js
// Handles adding/removing items and rendering the cart page.
// Include on index.html AND cart.html AND checkout.html with:
// <script src="cart.js"></script>
// Must load AFTER products.js since it uses getProductById().
// ============================================

function getCart() {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : []; // array of { productId, quantity }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // keep the nav badge in sync every time the cart changes
}

// Adds one unit of a product (or increases quantity if it's already in the cart)
function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(function (item) { return item.productId === productId; });

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    saveCart(cart);
    alert("Added to cart!");
}

function updateQuantity(productId, newQuantity) {
    let cart = getCart();
    if (newQuantity <= 0) {
        cart = cart.filter(function (item) { return item.productId !== productId; });
    } else {
        const item = cart.find(function (item) { return item.productId === productId; });
        if (item) item.quantity = newQuantity;
    }
    saveCart(cart);
    renderCart(); // refresh the cart page display, if we're on it
}

function removeFromCart(productId) {
    updateQuantity(productId, 0);
}

function getCartTotal() {
    const cart = getCart();
    let total = 0;
    cart.forEach(function (item) {
        const product = getProductById(item.productId);
        if (product) total += product.price * item.quantity;
    });
    return total;
}

// Updates the little number badge on the cart icon in your nav.
// Requires an element with id="cartCount" near the cart icon, e.g.:
// <a href="cart.html">🛍 <span id="cartCount">0</span></a>
function updateCartCount() {
    const badge = document.getElementById("cartCount");
    if (!badge) return; // this page has no badge — skip quietly
    const cart = getCart();
    const totalItems = cart.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    badge.textContent = totalItems;
}

// Builds the cart page's item list. Requires an element with
// id="cartItems" in cart.html to render into.
function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return; // not on the cart page — skip

    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach(function (item) {
            const product = getProductById(item.productId);
            if (!product) return;

            const row = document.createElement("div");
            row.className = "cart-row";
            row.innerHTML =
                "<span>" + product.name + "</span>" +
                "<span>\u20B9" + product.price + " &times; " +
                "<input type='number' value='" + item.quantity + "' min='0' style='width:50px' " +
                "onchange='updateQuantity(" + product.id + ", parseInt(this.value))'>" +
                "</span>" +
                "<button onclick='removeFromCart(" + product.id + ")'>Remove</button>";
            container.appendChild(row);
        });
    }

    const totalEl = document.getElementById("cartTotal");
    if (totalEl) totalEl.textContent = "Total: \u20B9" + getCartTotal();
}

function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
}

// Runs automatically whenever ANY page finishes loading, so the
// nav cart badge is always correct without you calling it manually.
document.addEventListener("DOMContentLoaded", updateCartCount);