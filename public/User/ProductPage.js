import ProductCard from './Component/ProductCard.js';
import FilterProduct from './Component/FilterProduct.js';

export default {
    props: ['productType'],
    components: {
        'product-card': ProductCard,
        'filter-product': FilterProduct
    },
    data() {
        return {
            product: {
                type: this.productType,
                quantity: 0
            },
            products: [],
            visibleCount: 12,
        };
    },

    computed: {
        visibleProducts() {
            return this.products;
        },
        imagePoster() {
            if (this.products && this.products.length > 0) {
                return this.products[0].imagepath + '/1.jpg';
            } else {
                return ''; // Return a default value or an empty string
            }
        }
    },

    methods: {
        async fetchKitPhim() {
            const response = await axios.get(`/kitPhim/api/get-kit-phim?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataKitPhim;
            this.product.quantity = data.totalProducts;
        },
        async fetchKeCap() {
            const response = await axios.get(`/keCap/api/get-ke-cap?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataKeCap;
            this.product.quantity = data.totalProducts;
        },
        async fetchSwitch() {
            const response = await axios.get(`/switch/api/get-switch?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataSwitch;
            this.product.quantity = data.totalProducts;
        },
        async fetchAccessories(){
            const response = await axios.get(`/accessories/api/get-accessories?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataAccessories;
            this.product.quantity = data.totalProducts;
        },
        addToCart(product) {
            alert(`${product.ProductName} đã được thêm vào giỏ hàng!`);
        },
        loadMore() {
            this.visibleCount += 12;
            if (this.product.type === 'Kit Phim') {
                this.fetchKitPhim();
            }
            else if (this.product.type === 'Kecap') {
                this.fetchKeCap();
            }
            else if (this.product.type === 'Switch') {
                this.fetchSwitch();
            }
            else if (this.product.type === 'Accessories') {
                this.fetchAccessories();
            }
        },
        filterProducts(type) {
            // Filter products by type and quantity
            if (type === 'all') {
                this.visibleCount = 12;
                return this.products;
            }
            else if (type === 'price') {
                this.visibleCount = 12;
                //ASC
                return this.products.sort((a, b) => a.CurrentPrice - b.CurrentPrice);
            }
            else if (type === 'priceDesc') {
                this.visibleCount = 12;
                //DESC
                return this.products.sort((a, b) => b.CurrentPrice - a.CurrentPrice);
            }
        },
    },
    mounted() {
        if (this.product.type === 'Kit Phim') {
            this.fetchKitPhim();
        }
        else if (this.product.type === 'Kecap') {
            this.fetchKeCap();
        }
        else if (this.product.type === 'Switch') {
            this.fetchSwitch();
        }
        else if (this.product.type === 'Accessories') {
            this.fetchAccessories();
        }
    },
    template: `
    <div class="container col-10 mt-3">
        <div class="img-container mx-auto text-center">
            <img :src="imagePoster" class="img-fluid h-100" alt="Tiêu đề">
        </div>

        <div class="responsive-font fw-bold mt-4 mb-4">
            <div class = "row">
                <div class="col-9">
                    <span>{{ product.type }}</span>
                    <span> Số lượng có: {{ product.quantity }}</span>
                </div>
                <filter-product @filter-change="filterProducts" />
            </div>
        </div>

        <div class="row">
            <product-card v-for="product in visibleProducts" :key="product.productid" :product="product" @add-to-cart="addToCart"></product-card>
        </div>
        <div class="text-center my-4">
            <button class="btn btn-secondary" @click="loadMore">Xem thêm sản phẩm</button>
        </div>
    </div>
    `
};