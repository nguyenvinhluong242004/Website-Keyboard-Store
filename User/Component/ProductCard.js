import { createApp } from 'vue';

// Define the product card component
export default {
    props: ['product'],
    template: `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img :src="product.ImagePath" class="card-img-top" :alt="product.name">
                <div class="card-body responsive-font">
                    <span class="card-title row fw-bold ms-4">{{ product.ProductName }}</span>
                    <span class="card-title row text-danger fw-bold ms-4">{{ formatPrice(product.CurrentPrice) }} VNĐ</span>
                    <button class="btn btn-primary responsive-font" @click="addToCart">
                        <i class="bi bi-cart-plus"></i> Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    `,
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.product);
        },
        formatPrice(value) {
            return value.toLocaleString('vi-VN');
        }
    }
};