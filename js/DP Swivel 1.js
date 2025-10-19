// ========== CART & PRODUCT DETAIL JAVASCRIPT ==========

const CART_KEY = 'mancingmo_cart';
let selectedSize = null;

// Product Images Array (single image)
const productImages = [
    'image/Swivel 1.jpeg'
];
let currentImageIndex = 0;

// ========== IMAGE SLIDER FUNCTIONS ==========
// Note: Only one image, functions kept for consistency
function changeImage(direction) {
    // Not needed for single image, but kept for compatibility
    return;
}

function selectImage(index) {
    currentImageIndex = index;
    updateMainImage();
}

function updateMainImage() {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = productImages[currentImageIndex];
    }
    
    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
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
    if (input) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQty() {
    const input = document.getElementById('qty-input');
    if (input && parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ========== SIZE SELECTION ==========
function initializeSizeSelection() {
    const sizeBtns = document.querySelectorAll('.size-btn');
    console.log('Initializing size buttons, found:', sizeBtns.length); // Debug log
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Size button clicked:', btn.getAttribute('data-size')); // Debug log
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
        });
    });
}

// ========== ADD TO CART FUNCTION ==========
function addToCart() {
    console.log('Add to cart clicked, selected size:', selectedSize); // Debug log
    
    if (!selectedSize) {
        alert('Silakan pilih ukuran swivel terlebih dahulu!');
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
    
    // Check if product with same variant already exists
    const existingIndex = cart.findIndex(item => 
        item.name === product.name && item.variant === product.variant
    );

    if (existingIndex > -1) {
        // Update quantity if exists
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new product
        cart.push(product);
    }

    saveCart(cart);
    showToast();
}

// ========== BUY NOW FUNCTION ==========
function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 500);
}

// ========== SHOW TOAST NOTIFICATION ==========
function showToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log
    updateCartBadge();
    initializeSizeSelection();
    
    // Additional check after a short delay to ensure DOM is fully ready
    setTimeout(() => {
        initializeSizeSelection();
    }, 100);
});