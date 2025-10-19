// Product Images Array - SPECIFIC untuk Reel Katana
const productImages = [
    '/image/Reel 1:1.jpeg',
    '/image/Reel 1:2.jpeg',
    '/image/Reel 1:3.jpeg'
];
let currentImageIndex = 0;
let selectedSize = null;
const CART_KEY = 'mancingmo_cart';

// Image Slider Functions
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
    mainImage.src = productImages[currentImageIndex];
    
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

// Cart Functions
function getCart() {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Quantity Control
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

// Size Selection
const sizeBtns = document.querySelectorAll('.size-btn');
sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.getAttribute('data-size');
    });
});

// Add to Cart Function
function addToCart() {
    if (!selectedSize) {
        alert('Silakan pilih warna terlebih dahulu!');
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

// Buy Now Function
function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 500);
}

// Show Toast Notification
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}