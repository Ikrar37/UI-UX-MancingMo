// ========== PRODUCT DETAIL PAGE JAVASCRIPT ==========
const CART_KEY = 'mancingmo_cart';
let selectedSize = null;

// Product Images Array (only 1 image)
const productImages = [
    '/image/Joran Set 1.jpeg'
];
let currentImageIndex = 0;

// ========== IMAGE FUNCTIONS (Simplified for single image) ==========
function selectImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    mainImage.src = productImages[currentImageIndex];
}

// ========== CART FUNCTIONS ==========
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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
}

// ========== QUANTITY CONTROL ==========
function increaseQty() {
    const input = document.getElementById('qty-input');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    const input = document.getElementById('qty-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ========== SIZE SELECTION ==========
document.addEventListener('DOMContentLoaded', function() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Store selected size
            selectedSize = this.getAttribute('data-size');
        });
    });
    
    // Initialize cart badge
    updateCartBadge();
});

// ========== ADD TO CART FUNCTION ==========
function addToCart() {
    // Validasi: Warna harus dipilih
    if (!selectedSize) {
        alert('⚠️ Silakan pilih warna terlebih dahulu!');
        return;
    }

    const productName = document.getElementById('productName').textContent;
    const productPrice = parseInt(document.getElementById('productPrice').getAttribute('data-price'));
    const productImage = productImages[0];
    const quantity = parseInt(document.getElementById('qty-input').value);

    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        variant: selectedSize,
        quantity: quantity
    };

    const cart = getCart();
    
    // Check if product already exists with same variant
    const existingIndex = cart.findIndex(item => 
        item.name === product.name && item.variant === product.variant
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    showToast();
}

// ========== BUY NOW FUNCTION ==========
function buyNow() {
    // Validasi: Warna harus dipilih
    if (!selectedSize) {
        alert('⚠️ Silakan pilih warna terlebih dahulu!');
        return;
    }
    
    addToCart();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 500);
}

// ========== TOAST NOTIFICATION ==========
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}