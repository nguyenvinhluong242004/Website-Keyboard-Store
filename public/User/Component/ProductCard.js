

// Define the product card component
export default {
    props: ['product','type'],
    data() {
        return {
            firstImage: '',
            href: ''
        };
    },
    computed: {
        productNameWithPrefix() {
            if (this.type === 'GroupBy Product') {
                return `[GroupBy] ${this.product.productname}`;
            } else {
                return `[Instock] ${this.product.productname}`;
            }
        }
    },
    template: `
        <div class="col-md-4 mb-4 card-item">
            <a :href="href" class="card-link">
                <img :src="firstImage" alt="Card Image" class="card-image">
                <p class="badge" :class="product.categoryname">{{ product.categoryname }}</p>
                <h2 class="card-title">{{ productNameWithPrefix }}</h2>
                <div class="card-bottom">
                    <div class="price">
                        <span class="old-price">$ {{ formatPrice(product.oldprice) }}</span>
                        <span class="current-price">$ {{ formatPrice(product.currentprice) }}</span>
                    </div>
                    <button @click.stop.prevent="addToCart" class="add-cart material-symbols-rounded">add_shopping_cart</button>
                </div>
            </a>
        </div>
    `,
    methods: {
        fetchHref() {
            fetch(`/search/api/check-group-by-product?productid=${this.product.productid}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        this.href = `/detail-group-by/${this.product.productid}`;
                    } else {
                        this.href = `/detail-product/instock/${this.product.productid}`;
                    }
                })
                .catch(error => {
                    console.error('Error fetching group by product status:', error);
                    this.href = `/detail-product?id=${this.product.productid}`; // Default fallback
                });
        },
        addToCart() {
            this.$emit('add-to-cart', this.product);
        },
        formatPrice(value) {
            if (value == null) {
                return 'N/A';
            }
            return value.toLocaleString('vi-VN');
        },
        fetchFirstImage() {
            fetch(`/detail-product/image-product/api/${this.product.productid}`)
                .then(response => response.json())
                .then(data => {
                    this.firstImage = data[0];
                })
                .catch(error => {
                    console.error('Error fetching images:', error);
                });
        }
    },
    mounted() {
        this.fetchFirstImage();
        this.fetchHref();
    }
};