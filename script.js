document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.querySelector('.products');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const sortSelect = document.getElementById('sort');
    let products = [];

    async function fetchingProducts(url) {
        let data = await fetch(url);
        products = await data.json();
        displayProducts(products);
    }

    function displayProducts(products) {
        productsContainer.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            let description = product.description || "";
            let title = product.title || "";
            let image = product.image || "";
            let price = product.price || "";
            let id = product.id || "";
            let category = product.category || "";
            let rating = product.rating ? product.rating.rate : "";

            productsContainer.innerHTML += `
                <div class="product">
                    <img src="${image}" alt="${title}" class="product-img">
                    <div class="product-content">
                        <h2 class="product-title">${title}</h2>
                        <h4 class="product-category">${category}</h4>
                        <p class="product-description">${description.length > 80 ? description.substring(0, 80).concat(' ...more') : description}</p>
                        <div class="product-price-container">
                            <h3 class="product-price">$${price}</h3>
                            <a href="#!" data-productId="${id}" class="add-to-cart">
                                <ion-icon name="cart-outline"></ion-icon>Add to Cart
                            </a>
                        </div>
                        <div class="product-rating">Rating: ${rating}</div>
                    </div>
                </div>`;
        });
    }

    function filterProducts() {
        let searchTerm = searchInput.value.toLowerCase();
        let minPrice = parseFloat(minPriceInput.value) || 0;
        let maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        let selectedCategory = Array.from(categoryButtons).find(button => button.classList.contains('active'))?.dataset.category || 'all';

        let filteredProducts = products.filter(product => {
            let matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm);
            let matchesPrice = product.price >= minPrice && product.price <= maxPrice;
            let matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

            return matchesSearch && matchesPrice && matchesCategory;
        });

        sortProducts(filteredProducts);
    }

    function sortProducts(filteredProducts) {
        const sortValue = sortSelect.value;

        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    }

    searchInput.addEventListener('input', filterProducts);
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterProducts();
        });
    });
    minPriceInput.addEventListener('input', filterProducts);
    maxPriceInput.addEventListener('input', filterProducts);
    sortSelect.addEventListener('change', function() {
        filterProducts();
    });

    fetchingProducts('https://fakestoreapi.com/products'); 
});
