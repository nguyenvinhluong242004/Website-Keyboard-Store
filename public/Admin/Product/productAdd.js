// Hàm reset nội dung form và hình ảnh
function resetFormAndImages() {
    // Đặt lại nội dung của tất cả các trường nhập liệu
    document.getElementById('name').value = '';
    document.getElementById('listed-price').value = '';
    document.getElementById('adjusted-price').value = '';
    document.getElementById('type').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('specification').value = '';
    document.getElementById('description').value = '';

    // Đặt lại danh sách imageSlots
    imageSlots = imageSlots.map((slot) => ({ ...slot, url: null }));
    renderImageSlots();
}

// Gắn sự kiện cho nút Reset
document.querySelector('.reset-button').addEventListener('click', (event) => {
    event.preventDefault(); // Ngăn form reload
    resetFormAndImages(); // Reset nội dung form và hình ảnh
});

// Sự kiện khi bấm nút Submit
document.querySelector('.submit-button').addEventListener('click', async (event) => {
    event.preventDefault(); // Ngăn form reload

    // Thu thập dữ liệu từ các input
    const name = document.getElementById('name').value.trim();
    const listedPrice = parseFloat(document.getElementById('listed-price').value) || 0;
    const adjustedPrice = parseFloat(document.getElementById('adjusted-price').value) || 0;
    const type = document.getElementById('type').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value, 10) || 0;
    const brand = document.getElementById('brand').value.trim();
    const specification = document.getElementById('specification').value.trim();
    const description = document.getElementById('description').value.trim();

    const images = imageSlots.map((slot) => slot.url).filter((url) => url !== null);

    console.log(images);

    // Kiểm tra các trường bắt buộc
    if (!name || !type || !brand || !listedPrice || !adjustedPrice || !specification || !description || quantity <= 0) {
        alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
        return;
    }

    try {
        // Gửi request API
        //console.log("fetch")
        const response = await fetch('/Admin/product/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                listedPrice,
                adjustedPrice,
                type,
                quantity,
                brand,
                specification,
                description,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Thêm sản phẩm thành công!');
            const productId = result.productId; // Nhận productId từ kết quả API
        
            // Gửi từng ảnh một
            for (let i = 0; i < images.length; i++) {
                const imageFile = images[i]; // Đây là đối tượng file (File) từ input file
        
                // Tạo FormData để gửi ảnh lên server
                const formData = new FormData();
                formData.append('productId', productId);
                formData.append('image', imageFile); // Thêm file vào FormData
        
                console.log("formData", formData); // Kiểm tra FormData
        
                try {
                    const imageResponse = await fetch('/Admin/product/addImages', {
                        method: 'POST',
                        body: formData,
                    });
        
                    const imageResult = await imageResponse.json();
        
                    if (imageResponse.ok) {
                        console.log(`Ảnh ${i + 1} đã được thêm thành công!`);
                    } else {
                        console.error(`Có lỗi khi thêm ảnh ${i + 1}:`, imageResult.message);
                    }
                } catch (error) {
                    console.error(`Lỗi khi gửi ảnh ${i + 1}:`, error);
                }
            }
        
            // Reset form và hình ảnh sau khi thêm thành công
            resetFormAndImages();
        } else if (result.message === 'Product already exists') {
            alert('Sản phẩm đã tồn tại!');
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Không thể kết nối tới server!');
    }
});

// Biến lưu trữ imageSlots
let imageSlots = [
    { id: 1, url: null },
    { id: 2, url: null },
    { id: 3, url: null },
    { id: 4, url: null },
];

// Cập nhật giao diện của imageSlots
function renderImageSlots() {
    const imageUploadSection = document.querySelector('.image-upload-section');
    imageUploadSection.innerHTML = ''; // Xóa nội dung cũ

    imageSlots.forEach((slot) => {
        const slotElement = document.createElement('div');
        slotElement.classList.add('image-slot');

        const placeholderElement = document.createElement('div');
        placeholderElement.classList.add('image-placeholder');
        placeholderElement.dataset.slotId = slot.id;

        if (slot.url) {
            const imgElement = document.createElement('img');
            imgElement.src = slot.url;
            imgElement.alt = `Product image ${slot.id}`;
            imgElement.classList.add('preview-image');
            placeholderElement.appendChild(imgElement);
        } else {
            const iconElement = document.createElement('div');
            iconElement.classList.add('placeholder-icon');
            iconElement.textContent = '+';
            placeholderElement.appendChild(iconElement);
        }

        // Sự kiện khi nhấn vào khung ảnh
        placeholderElement.addEventListener('click', () => triggerFileInput(slot.id));

        slotElement.appendChild(placeholderElement);
        imageUploadSection.appendChild(slotElement);
    });
}

// Kích hoạt file input ẩn khi nhấp vào khung ảnh
function triggerFileInput(slotId) {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/*';

    inputElement.addEventListener('change', (event) => handleImageUpload(event, slotId));
    inputElement.click(); // Kích hoạt chọn file
}

// Xử lý khi người dùng tải ảnh lên
function handleImageUpload(event, slotId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const imageUrl = reader.result;
        const slot = imageSlots.find((slot) => slot.id === slotId);
        if (slot) {
            slot.url = imageUrl; // Cập nhật URL của slot
            renderImageSlots(); // Cập nhật giao diện
        }
    };
    reader.readAsDataURL(file);
}

// Gắn sự kiện ban đầu và hiển thị giao diện
document.addEventListener('DOMContentLoaded', () => {
    renderImageSlots();
});
