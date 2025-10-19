// ========== CART & PRODUCT DETAIL JAVASCRIPT WITH DYNAMIC PRICING ==========

const CART_KEY = 'mancingmo_cart';
let selectedType = null;
let selectedSize = null;

const productImages = ['image/Sling 1.jpeg'];
let currentImageIndex = 0;

// ========== PRICE MATRIX ==========
// Harga berdasarkan kombinasi Type dan Ukuran
const priceMatrix = {
    '1x7': {
        '5Lb': 12500,
        '10Lb': 13500,
        '15Lb': 13500,
        '20Lb': 13500,
        '25Lb': 14500,
        '30Lb': 15000,
        '40Lb': 16000,
        '50Lb': 17000,
        '60Lb': 18000,
        '80Lb': 19000,
        '100Lb': 20000
    },
    '7x7': {
        '5Lb': 45000,
        '10Lb': 45000,
        '15Lb': 45000,
        '20Lb': 45000,
        '25Lb': 45000,
        '30Lb': 40000,
        '40Lb': 40000,
        '50Lb': 37500,
        '60Lb': 37500,
        '80Lb': 35000,
        '100Lb': 32500
    }
};

// ========== STOCK STATUS MATRIX ==========
// Status stok berdasarkan kombinasi Type dan Ukuran
const stockStatus = {
    '1x7': {
        '5Lb': true,
        '10Lb': true,
        '15Lb': true,
        '20Lb': true,
        '25Lb': true,
        '30Lb': true,
        '40Lb': true,
        '50Lb': true,
        '60Lb': true,
        '80Lb': true,
        '100Lb': true
    },
    '7x7': {
        '5Lb': false,    // Habis
        '10Lb': true,
        '15Lb': false,   // Habis
        '20Lb': true,
        '25Lb': false,   // Habis
        '30Lb': true,
        '40Lb': true,
        '50Lb': true,
        '60Lb': true,
        '80Lb': true,
        '100Lb': true
    }
};

// ========== IMAGE FUNCTIONS ==========
function selectImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = productImages[currentImageIndex];
    }
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

// ========== PRICE UPDATE ==========
function updatePrice() {
    if (selectedType && selectedSize) {
        const price = priceMatrix[selectedType][selectedSize];
        const priceElement = document.getElementById('productPrice');
        if (priceElement) {
            priceElement.textContent = 'Rp ' + price.toLocaleString('id-ID');
            priceElement.setAttribute('data-price', price);
        }
    }
}

// ========== SIZE AVAILABILITY UPDATE ==========
function updateSizeAvailability() {
    if (!selectedType) return;
    
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        const size = btn.getAttribute('data-size');
        const isAvailable = stockStatus[selectedType][size];
        
        if (isAvailable) {
            btn.classList.remove('disabled');
        } else {
            btn.classList.add('disabled');
            btn.classList.remove('active');
        }
    });
    
    // Reset selected size jika yang dipilih habis
    if (selectedSize && !stockStatus[selectedType][selectedSize]) {
        selectedSize = null;
        // Reset price display
        const priceElement = document.getElementById('productPrice');
        if (priceElement) {
            priceElement.textContent = 'Rp 12.500 - Rp 45.000';
            priceElement.removeAttribute('data-price');
        }
    }
}

// ========== TYPE AND SIZE SELECTION ==========
function initializeSelections() {
    // Type Selection
    const typeBtns = document.querySelectorAll('.type-btn');
    console.log('Initializing type buttons, found:', typeBtns.length); // Debug
    
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('disabled')) return;
            
            console.log('Type selected:', btn.getAttribute('data-type')); // Debug
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.getAttribute('data-type');
            updateSizeAvailability();
            updatePrice();
        });
    });

    // Size Selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    console.log('Initializing size buttons, found:', sizeBtns.length); // Debug
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('disabled')) return;
            
            console.log('Size selected:', btn.getAttribute('data-size')); // Debug
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
            updatePrice();
        });
    });
}

// ========== ADD TO CART FUNCTION ==========
function addToCart() {
    console.log('Add to cart - Type:', selectedType, 'Size:', selectedSize); // Debug
    
    if (!selectedType) {
        alert('Silakan pilih type terlebih dahulu!');
        return;
    }
    if (!selectedSize) {
        alert('Silakan pilih ukuran terlebih dahulu!');
        return;
    }
    
    // Cek stok
    if (!stockStatus[selectedType][selectedSize]) {
        alert('Maaf, stok untuk kombinasi ini sedang habis!');
        return;
    }

    const productName = document.getElementById('productName').textContent;
    const priceElement = document.getElementById('productPrice');
    const productPrice = parseInt(priceElement.getAttribute('data-price'));
    const productImage = productImages[0];
    const quantity = parseInt(document.getElementById('qty-input').value);

    if (!productPrice) {
        alert('Silakan pilih type dan ukuran terlebih dahulu!');
        return;
    }

    const product = {
        name: productName,
        price: productPrice,
        image: productImage,
        variant: `${selectedType} - ${selectedSize}`,
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

// ========== BUY NOW FUNCTION ==========
function buyNow() {
    if (!selectedType || !selectedSize) {
        addToCart();
        return;
    }
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
    console.log('DOM Content Loaded - Sling'); // Debug
    updateCartBadge();
    initializeSelections();
    
    // Additional check after delay
    setTimeout(() => {
        initializeSelections();
    }, 100);
});