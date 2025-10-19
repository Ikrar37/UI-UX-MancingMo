// ========== CART & PRODUCT DETAIL JAVASCRIPT ==========

const CART_KEY = 'mancingmo_cart';
let selectedSize = null;

// Product Images Array
const productImages = [
    '/image/Reel 2:1.jpeg',
    '/image/Reel 2:2.jpeg'
];
let currentImageIndex = 0;

// ========== IMAGE SLIDER FUNCTIONS ==========
function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = productImages.length - 1;
    } else if (currentImageIndex >= productImages.length) {
        currentImageIndex = 0;
    }
    
    updateMainImage();
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

// ========== SIZE SELECTION (COLOR VARIANT) ==========
function initializeSizeSelection() {
    const sizeBtns = document.querySelectorAll('.size-btn');
    console.log('Initializing size buttons, found:', sizeBtns.length); // Debug
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Color selected:', btn.getAttribute('data-size')); // Debug
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
        });
    });
}

// ========== ADD TO CART FUNCTION ==========
function addToCart() {
    console.log('Add to cart clicked, selected color:', selectedSize); // Debug
    
    if (!selectedSize) {
        alert('Silakan pilih warna reel terlebih dahulu!');
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
    console.log('DOM Content Loaded - Reel 2'); // Debug
    updateCartBadge();
    initializeSizeSelection();
    
    // Additional check after delay
    setTimeout(() => {
        initializeSizeSelection();
    }, 100);
});