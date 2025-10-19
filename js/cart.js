const CART_KEY = 'mancingmo_cart';

function getCart() {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.add('show');
    } else {
        badge.style.display = 'none';
    }
}

function loadCart() {
    const cart = getCart();
    const cartTable = document.getElementById('cartTable');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        showEmptyCart();
        return;
    }
    
    let cartHTML = `
        <div class="table-header">
            <div></div>
            <div>Produk</div>
            <div>Harga</div>
            <div>Jumlah Barang</div>
            <div>Total</div>
        </div>
    `;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        cartHTML += `
            <div class="cart-item">
                <div>
                    <input type="checkbox" class="item-checkbox" checked>
                </div>
                <div class="item-details">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        ${item.variant ? `<div class="item-variant">${item.variant}</div>` : ''}
                        <div class="item-actions">
                            <button class="action-btn" onclick="deleteItem(${index})">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
                <div class="item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                <div>
                    <div class="item-quantity">
                        <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
                        <div class="qty-display">${item.quantity}</div>
                        <button class="qty-btn" onclick="increaseQty(${index})">+</button>
                    </div>
                </div>
                <div class="item-total">Rp ${itemTotal.toLocaleString('id-ID')}</div>
            </div>
        `;
    });
    
    cartTable.innerHTML = cartHTML;
    updateSummary();
}

function decreaseQty(index) {
    const cart = getCart();
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart(cart);
        loadCart();
    }
}

function increaseQty(index) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity++;
        saveCart(cart);
        loadCart();
    }
}

function updateSummary() {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    document.getElementById('subtotal').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    document.getElementById('total').textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
}

function deleteItem(index) {
    if (confirm('Hapus produk dari keranjang?')) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        loadCart();
    }
}

function showEmptyCart() {
    const cartTable = document.getElementById('cartTable');
    const cartSummary = document.getElementById('cartSummary');
    
    cartTable.innerHTML = `
        <div class="empty-cart">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <h3>Keranjang Anda Kosong</h3>
            <p>Belum ada produk di keranjang Anda. Yuk mulai belanja!</p>
            <a href="shop.html" class="btn-shop">Mulai Belanja</a>
        </div>
    `;
    cartSummary.style.display = 'none';
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    alert('Fitur checkout akan segera tersedia!');
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartBadge();
});