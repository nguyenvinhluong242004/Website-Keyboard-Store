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
                <img src="${product.firstImage}" alt="${product.productname}" class="product-image">
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
                <button class="edit-button data-id="${product.productid}"">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zm1.586-.793 1 1L13.207 2l-1-1 1.586-1.586z"/>
                    </svg>
                </button>
                
                <button class="delete-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 3h6a1 1 0 0 1 1 1v1h5a1 1 0 1 1 0 2h-1v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7H3a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1zm1 2v1h4V5h-4zm-4 3v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8H6zm3 3a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1z"/>
                    </svg>
                </button>
            `;
            productList.appendChild(productCard);

            // Add event listener for edit button
            const editButton = productCard.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                const productId = product.productid;
                const popup = document.getElementById('product-popup');
                const saveButton = document.getElementById('save-button');
                const cancelButton = document.getElementById('cancel-button');

                console.log("edit-button clicked");
                
                // Show popup
                popup.classList.remove('hidden');

                // Fill the form with product data
                document.getElementById('edit-product-name').value = product.productname;
                document.getElementById('edit-specification').value = product.specification;
                document.getElementById('edit-old-price').value = product.oldprice;
                document.getElementById('edit-current-price').value = product.currentprice;
                document.getElementById('edit-estimate-arrive').value = product.estimatearrive;
                document.getElementById('edit-description').value = product.description;
                document.getElementById('edit-category').value = product.categoryid;
                document.getElementById('edit-brand').value = product.brandid;
                document.getElementById('edit-quantity').value = product.quantity;
                document.getElementById('edit-type').value = product.type;

                saveButton.onclick = () => saveProductChanges(productId);
                cancelButton.onclick = () => closePopup();
            });

            // Add event listener for delete button
            const deleteButton = productCard.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                const productId = product.productid;
                if (confirm('Are you sure you want to delete this product?')) {
                    deleteProduct(productId);
                }
            });
        });
    } else {
        productList.innerHTML = '<p>No products found.</p>';
    }
}

function saveProductChanges(productId) {
    const productName = document.getElementById('edit-product-name').value;
    const specification = document.getElementById('edit-specification').value;
    const oldPrice = document.getElementById('edit-old-price').value;
    const currentPrice = document.getElementById('edit-current-price').value;
    const estimateArrive = document.getElementById('edit-estimate-arrive').value;
    const description = document.getElementById('edit-description').value;
    const category = document.getElementById('edit-category').value;
    const brand = document.getElementById('edit-brand').value;
    const quantity = document.getElementById('edit-quantity').value;
    const type = document.getElementById('edit-type').value;

    // Đảm bảo tất cả các trường hợp không rỗng
    if (!productName || !oldPrice || !currentPrice || !category || !brand || !quantity || !type || !estimateArrive) {
        alert('Please fill out all required fields.');
        return;
    }

    // Tạo đối tượng sản phẩm từ các giá trị
    const updatedProduct = {
        productid: productId,
        productname: productName,
        specification: specification,
        oldprice: parseInt(oldPrice),
        currentprice: parseInt(currentPrice),
        estimateArrive: parseInt(estimateArrive) || 0,
        description: description,
        categoryname: parseInt(category),
        brandname: parseInt(brand),
        quantity: parseInt(quantity),
        type: parseInt(type),
    };

    // Call API hoặc xử lý lưu thay đổi sản phẩm tại đây
    // Giả sử bạn gọi hàm updateProduct để lưu thay đổi
    fetch(`/Admin/product/update/${productId}`, {
        method: 'PUT', // Sử dụng PUT vì đây là cập nhật thông tin
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product updated successfully!');
                closePopup();
                fetchProducts(data.currentPage); // Reload sản phẩm
            } else {
                alert('Failed to update product.');
            }
        })
        .catch(error => {
            console.error('Error updating product:', error);
            alert('Error updating product.');
        });
}

// Hàm đóng popup
function closePopup() {
    console.log("close")
    const popup = document.getElementById('product-popup');
    popup.classList.add('hidden');
}

function deleteProduct(productId) {
    fetch(`/Admin/product/delete/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async response => {
            if (response.ok) {
                const data = await response.json(); // Đọc nội dung JSON trả về
                alert(data.message || 'Product deleted successfully.');
                fetchProducts(data.currentPage); // Refresh the product list
            } else {
                const errorData = await response.json(); // Đọc lỗi từ response
                throw new Error(errorData.message || 'Failed to delete product.');
            }
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert(error.message || 'An error occurred while deleting the product.');
        });
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
fetchProducts(1);


// js edit popup
// document.addEventListener('DOMContentLoaded', () => {
//     const popup = document.getElementById('popup');
//     const editButtons = document.querySelectorAll('.edit-button');
//     const saveButton = document.getElementById('save-button');
//     const cancelButton = document.getElementById('cancel-button');
//     console.log("content loaded")

//     // Hiển thị pop-up khi nhấn nút Edit
//     editButtons.forEach(button => {
//         button.addEventListener('click', (event) => {
//             console.log("edit button clicked");
//             popup.classList.remove('hidden');
//             const productCard = event.target.closest('.product-card');
//             const productName = productCard.querySelector('.product-name').textContent.trim();
//             const category = productCard.querySelector('.price-row span:nth-child(2)').textContent.trim();
//             const price = productCard.querySelector('.price-row:last-child span:nth-child(2)').textContent.trim();

//             document.getElementById('edit-product-name').value = productName;
//             document.getElementById('edit-category').value = category;
//             document.getElementById('edit-price').value = price;
//         });
//     });

//     // Lưu thay đổi
//     saveButton.addEventListener('click', () => {
//         // Thực hiện hành động lưu dữ liệu
//         const productName = document.getElementById('edit-product-name').value;
//         const category = document.getElementById('edit-category').value;
//         const price = document.getElementById('edit-price').value;

//         console.log('Saving:', { productName, category, price });

//         // Đóng pop-up
//         popup.classList.add('hidden');
//     });

//     // Hủy bỏ
//     cancelButton.addEventListener('click', () => {
//         popup.classList.add('hidden');
//     });
// });