

// Define the product card component
export default {
    props: ['product'],
    template: `
        <div class="col-md-4 mb-4 card-item">
            <a href="#" class="card-link">
                <img :src="product.imagepath + '/1.jpg'" alt="Card Image" class="card-image">
                <p class="badge" :class="product.categoryname">{{ product.categoryname }}</p>
                <h2 class="card-title">{{ product.description }}</h2>
                <div class="card-bottom">
                    <div class="price">
                        <span class="old-price">{{ formatPrice(product.oldprice) }} VNĐ</span>
                        <span class="current-price">{{ formatPrice(product.currentprice) }} VNĐ</span>
                    </div>
                    <button @click="addToCart" class="add-cart material-symbols-rounded">add_shopping_cart</button>
                </div>
            </a>
        </div>
    `,
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.product);
        },
        formatPrice(value) {
            if (value == null) {
                return 'N/A';
            }
            return value.toLocaleString('vi-VN');
        }
    }
};

