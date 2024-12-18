function fetchProducts(page = 1) {
    const search = document.getElementById('search')?.value || '';
    const availability = document.getElementById('availability')?.value || '';
    const category = document.getElementById('category')?.value || '';
    const brand = document.getElementById('brand')?.value || '';
    const price = document.getElementById('price')?.value || '';
    const sortBy = document.getElementById('sort')?.value || '';

    // console.log(`Filters: search=${search}, availability=${availability}, category=${category}, brand=${brand}, price=${price}, sortBy=${sortBy}`);

    fetch(`/Admin/product/filter?search=${encodeURIComponent(search)}&availability=${encodeURIComponent(availability)}&category=${encodeURIComponent(category)}&brand=${encodeURIComponent(brand)}&price=${encodeURIComponent(price)}&sortBy=${encodeURIComponent(sortBy)}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            renderProducts(data.products);
            renderPagination(data.totalPages, data.currentPage);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing products
    if (products.length > 0) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.imagepath}/1.jpg" alt="${product.productname}" class="product-image">
                <div class="product-details">
                    <p class="product-name">[ ${product.status} ] ${product.productname}</p>
                    <div class="product-info">
                        <div class="price-row">
                            <span class="price-label">Type:</span>
                            <span>${product.categoryname}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Listed price:</span>
                            <span>${product.oldprice}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Brand:</span>
                            <span>${product.brandname}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Adjusted price:</span>
                            <span>${product.currentprice}</span>
                        </div>
                    </div>
                </div>
                <button class="share-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="share-icon">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
            `;
            productList.appendChild(productCard);
        });
    } else {
        productList.innerHTML = '<p>No products found.</p>';
    }
}

function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Xóa nội dung phân trang cũ

    const maxVisiblePages = 5; // Số trang hiển thị tối đa

    // Nút Previous
    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => fetchProducts(currentPage - 1));
        pagination.appendChild(prevButton);
    }

    // Tính toán phạm vi nút trang
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Nút "1 ..." nếu cần
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';
        firstPageButton.addEventListener('click', () => fetchProducts(1));
        pagination.appendChild(firstPageButton);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
    }

    // Hiển thị các nút trong phạm vi đã tính
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.addEventListener('click', () => fetchProducts(i));
        pagination.appendChild(pageButton);
    }

    // Nút "... n" nếu cần
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            pagination.appendChild(dots);
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener('click', () => fetchProducts(totalPages));
        pagination.appendChild(lastPageButton);
    }

    // Nút Next
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => fetchProducts(currentPage + 1));
        pagination.appendChild(nextButton);
    }
}


document.getElementById('sort-button').addEventListener('click', () => fetchProducts(1));
document.getElementById('sort-button2').addEventListener('click', () => fetchProducts(1));

// Fetch initial products on page load
//fetchProducts(1);
