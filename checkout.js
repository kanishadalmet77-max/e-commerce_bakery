// ============================================
// checkout.js
// Renders the order summary, handles payment method choice
// (Pay on Delivery vs UPI), and saves the finished order —
// including its payment status — so admin.html can show it.
// ============================================

function renderCheckoutSummary() {
    const container = document.getElementById("checkoutItems");
    if (!container) return;

    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>No items to checkout.</p>";
    }

    cart.forEach(function (item) {
        const product = getProductById(item.productId);
        if (!product) return;
        const row = document.createElement("p");
        row.textContent = product.name + " x " + item.quantity + " — \u20B9" + (product.price * item.quantity);
        container.appendChild(row);
    });

    const totalEl = document.getElementById("checkoutTotal");
    if (totalEl) totalEl.textContent = "Total: \u20B9" + getCartTotal();
}

// Runs whenever the payment method radio buttons change.
// Shows/hides the QR code box, and builds a fresh QR image
// whenever UPI is selected (so the amount in the QR always
// matches the current cart total).
function onPaymentMethodChange() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    const upiBox = document.getElementById("upiDetails");
    if (!selected || !upiBox) return;

    if (selected.value === "upi") {
        upiBox.style.display = "block";

        const total = getCartTotal();
        const upiId = "deliciouscakes@upi"; // demo UPI ID — replace with a real one for production
        // This builds a standard "UPI intent" string, the same format real UPI apps read from a QR code.
        const upiIntent = "upi://pay?pa=" + upiId + "&pn=DeliciousCakes&am=" + total + "&cu=INR";

        // api.qrserver.com is a free public API that turns any text into a QR code image on the fly.
        const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(upiIntent);

        document.getElementById("upiQr").src = qrUrl;
        document.getElementById("upiIdText").textContent = upiId;
    } else {
        upiBox.style.display = "none";
    }
}

// Saves the order with the correct payment status depending on
// the method chosen, then clears the cart.
function placeOrder() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const methodInput = document.querySelector('input[name="paymentMethod"]:checked');
    if (!methodInput) {
        alert("Please choose a payment method.");
        return;
    }

    const method = methodInput.value;
    const total = getCartTotal();
    const user = getCurrentUser();

    // UPI is treated as paid immediately (this is a simulation — a real
    // UPI integration would only mark this "Paid" after a confirmed
    // callback from the bank/payment provider). Pay on Delivery is
    // always "Pending" since money hasn't actually changed hands yet.
    let status, methodLabel;
    if (method === "upi") {
        status = "Paid";
        methodLabel = "UPI";
    } else {
        status = "Pending (Pay on Delivery)";
        methodLabel = "Cash on Delivery";
    }

    const stored = localStorage.getItem("orders");
    const orders = stored ? JSON.parse(stored) : [];
    orders.push({
        customerEmail: user ? user.email : "guest",
        customerName: user ? user.fullName : "Guest",
        items: cart,
        total: total,
        paymentMethod: methodLabel,
        status: status,
        date: new Date().toISOString()
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    clearCart();

    if (method === "upi") {
        alert("Payment received via UPI! Your order total was \u20B9" + total + ". Thank you!");
    } else {
        alert("Order placed! Please pay \u20B9" + total + " in cash when your order is delivered.");
    }

    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", renderCheckoutSummary);