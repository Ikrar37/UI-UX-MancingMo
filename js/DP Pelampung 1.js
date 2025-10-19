// Product Images Array - SPECIFIC untuk Pelampung
const productImages = [
    '/image/Pelampung 1:1.jpeg',
    '/image/Pelampung 1:2.jpeg',
    '/image/Pelampung 1:3.jpeg'
];
let currentImageIndex = 0;
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

// Add to Cart Function (TANPA VARIAN - produk tidak punya pilihan warna)
function addToCart() {
    const productName = document.getElementById('productName').textContent;
    const productPrice = parseInt(document.getElementById('productPrice').getAttribute('data-price'));
    const productImage = productImages[0];
    const quantity = parseInt(document.getElementById('qty-input').value);

    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        variant: null, // Tidak ada varian
        quantity: quantity
    };

    const cart = getCart();
    
    // Check if product already exists (tanpa pengecekan variant)
    const existingIndex = cart.findIndex(item => item.name === product.name);

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