// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Search Functionality
    const searchInput = document.querySelector('.search-box input');
    const productCards = document.querySelectorAll('.product-card');

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productBrand.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Filter Functionality
    const filterBtn = document.querySelector('.filter-btn');
    
    // Create filter modal
    const filterModal = document.createElement('div');
    filterModal.className = 'filter-modal';
    filterModal.innerHTML = `
        <div class="filter-content">
            <div class="filter-header">
                <h3>Filter Produk</h3>
                <button class="close-filter">&times;</button>
            </div>
            <div class="filter-body">
                <div class="filter-group">
                    <h4>Kategori</h4>
                    <label><input type="checkbox" value="all" checked> Semua Produk</label>
                    <label><input type="checkbox" value="umpan"> Umpan</label>
                    <label><input type="checkbox" value="kail"> Kail</label>
                    <label><input type="checkbox" value="senar"> Senar Pancing</label>
                    <label><input type="checkbox" value="joran"> Joran</label>
                    <label><input type="checkbox" value="reel"> Reel</label>
                    <label><input type="checkbox" value="alat"> Alat Pancing Lainnya</label>
                </div>
                <div class="filter-group">
                    <h4>Harga</h4>
                    <label><input type="radio" name="price" value="all" checked> Semua Harga</label>
                    <label><input type="radio" name="price" value="low"> < Rp 50.000</label>
                    <label><input type="radio" name="price" value="mid"> Rp 50.000 - Rp 200.000</label>
                    <label><input type="radio" name="price" value="high"> > Rp 200.000</label>
                </div>
                <div class="filter-group">
                    <h4>Urutkan</h4>
                    <select id="sortSelect">
                        <option value="default">Default</option>
                        <option value="name-asc">Nama A-Z</option>
                        <option value="name-desc">Nama Z-A</option>
                        <option value="price-asc">Harga Terendah</option>
                        <option value="price-desc">Harga Tertinggi</option>
                    </select>
                </div>
            </div>
            <div class="filter-footer">
                <button class="reset-btn">Reset</button>
                <button class="apply-btn">Terapkan</button>
            </div>
        </div>
    `;
    document.body.appendChild(filterModal);

    // Toggle filter modal
    filterBtn.addEventListener('click', function() {
        filterModal.classList.add('active');
    });

    filterModal.querySelector('.close-filter').addEventListener('click', function() {
        filterModal.classList.remove('active');
    });

    // Close modal when clicking outside
    filterModal.addEventListener('click', function(e) {
        if (e.target === filterModal) {
            filterModal.classList.remove('active');
        }
    });

    // Apply filter
    filterModal.querySelector('.apply-btn').addEventListener('click', function() {
        applyFilters();
        filterModal.classList.remove('active');
    });

    // Reset filter
    filterModal.querySelector('.reset-btn').addEventListener('click', function() {
        filterModal.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb.value === 'all') cb.checked = true;
            else cb.checked = false;
        });
        filterModal.querySelector('input[name="price"][value="all"]').checked = true;
        filterModal.querySelector('#sortSelect').value = 'default';
        applyFilters();
    });

    // Category filter logic
    const categoryCheckboxes = filterModal.querySelectorAll('input[type="checkbox"]');
    const allCheckbox = filterModal.querySelector('input[value="all"]');
    
    allCheckbox.addEventListener('change', function() {
        if (this.checked) {
            categoryCheckboxes.forEach(cb => {
                if (cb !== allCheckbox) cb.checked = false;
            });
        }
    });

    categoryCheckboxes.forEach(cb => {
        if (cb !== allCheckbox) {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    allCheckbox.checked = false;
                }
                // If no category selected, check "all"
                const anyChecked = Array.from(categoryCheckboxes).some(c => c !== allCheckbox && c.checked);
                if (!anyChecked) {
                    allCheckbox.checked = true;
                }
            });
        }
    });

    // Apply filters function
    function applyFilters() {
        const selectedCategories = Array.from(filterModal.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        const selectedPrice = filterModal.querySelector('input[name="price"]:checked').value;
        const sortBy = filterModal.querySelector('#sortSelect').value;

        // Filter products
        productCards.forEach(card => {
            const brand = card.querySelector('.product-brand').textContent.toLowerCase();
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));

            let showProduct = true;

            // Category filter
            if (!selectedCategories.includes('all')) {
                const matchCategory = selectedCategories.some(cat => {
                    if (cat === 'umpan' && brand.includes('umpan')) return true;
                    if (cat === 'kail' && brand.includes('kail')) return true;
                    if (cat === 'senar' && brand.includes('senar')) return true;
                    if (cat === 'joran' && brand.includes('joran')) return true;
                    if (cat === 'reel' && brand.includes('reel')) return true;
                    if (cat === 'alat' && brand.includes('alat pancing lainnya')) return true;
                    return false;
                });
                if (!matchCategory) showProduct = false;
            }

            // Price filter
            if (selectedPrice !== 'all') {
                if (selectedPrice === 'low' && price >= 50000) showProduct = false;
                if (selectedPrice === 'mid' && (price < 50000 || price > 200000)) showProduct = false;
                if (selectedPrice === 'high' && price <= 200000) showProduct = false;
            }

            card.style.display = showProduct ? 'block' : 'none';
        });

        // Sort products
        sortProducts(sortBy);
    }

    // Sort products function
    function sortProducts(sortBy) {
        const grid = document.querySelector('.product-grid');
        const cardsArray = Array.from(productCards);

        if (sortBy === 'default') return;

        cardsArray.sort((a, b) => {
            if (sortBy === 'name-asc') {
                return a.querySelector('.product-name').textContent.localeCompare(
                    b.querySelector('.product-name').textContent
                );
            }
            if (sortBy === 'name-desc') {
                return b.querySelector('.product-name').textContent.localeCompare(
                    a.querySelector('.product-name').textContent
                );
            }
            if (sortBy === 'price-asc' || sortBy === 'price-desc') {
                const priceA = parseInt(a.querySelector('.product-price').textContent.replace(/\D/g, ''));
                const priceB = parseInt(b.querySelector('.product-price').textContent.replace(/\D/g, ''));
                return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
            }
        });

        // Re-append sorted cards
        cardsArray.forEach(card => grid.appendChild(card));
    }

    // Sort on change
    filterModal.querySelector('#sortSelect').addEventListener('change', function() {
        sortProducts(this.value);
    });
});