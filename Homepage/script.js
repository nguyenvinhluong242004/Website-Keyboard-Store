new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.new-product-button-next',
        prevEl: '.new-product-button-prev',
    },

    // Responsive breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1  // Màn hình nhỏ sẽ hiển thị 1 thẻ
        },
        768: {
            slidesPerView: 2  // Màn hình vừa sẽ hiển thị 2 thẻ
        },
        1024: {
            slidesPerView: 4  // Màn hình lớn sẽ hiển thị 3 thẻ
        },
    }
});

new Swiper('.sales-card-wrapper', {
    loop: true,
    spaceBetween: 30,

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.sales-button-next',
        prevEl: '.sales-button-prev',
    },

    // Responsive breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1  // Màn hình nhỏ sẽ hiển thị 1 thẻ
        },
        768: {
            slidesPerView: 2  // Màn hình vừa sẽ hiển thị 2 thẻ
        },
        1024: {
            slidesPerView: 4  // Màn hình lớn sẽ hiển thị 3 thẻ
        },
    }
});

new Swiper('.banner-wrapper', {
    loop: true,
    spaceBetween: 30,

    // Pagination bullets
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Responsive breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1  // Màn hình nhỏ sẽ hiển thị 1 thẻ
        },
        768: {
            slidesPerView: 1  // Màn hình vừa sẽ hiển thị 2 thẻ
        },
        1024: {
            slidesPerView: 1  // Màn hình lớn sẽ hiển thị 3 thẻ
        },
    }
});
