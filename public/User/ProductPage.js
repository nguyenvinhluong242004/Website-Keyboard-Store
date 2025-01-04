import ProductCard from './Component/ProductCard.js';
import FilterProduct from './Component/FilterProduct.js';

export default {
    props: ['productType', 'searchQuery'],
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
            loading: false
        };
    },

    computed: {
        visibleProducts() {
            return this.products;
        },
        imagePoster() {
            if (this.products && this.products.length > 0) {
                if (this.product.type === 'Keyboards') {
                     return '/category/kitPhim.jpg';
                 }
                 else if (this.product.type === 'Kecap') {
                     return '/category/kecap.jpg';
                 }
                 else if (this.product.type === 'Switch') {
                     return '/category/switch.jpg';
                 }
                 else if (this.product.type === 'Deskpads') {
                     return '/category/deskpads.jpg';
                 }
                 else if (this.product.type === 'Supplies') {
                      return '/category/supplies.jpg';
                 }
                 else if (this.product.type === 'Merch') {
                     return '/category/merch.jpg';
                 }
                 else if (this.product.type === 'GroupBy Product') {
                     return '/category/kecap.jpg';
                 }
                 else if (this.product.type === 'Search Product') {
                     return '/category/kitPhim.jpg';
                 }
             } else {
                 return ''; // Return a default value or an empty string
             }
        }
    },

    methods: {
        async fetchKitPhim() {
            this.loading = true;
            const response = await axios.get(`/kitPhim/api/get-kit-phim?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataKitPhim;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchKeCap() {
            this.loading = true;
            const response = await axios.get(`/keCap/api/get-ke-cap?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataKeCap;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchSwitch() {
            this.loading = true;
            const response = await axios.get(`/switch/api/get-switch?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataSwitch;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchDeskpads(){
            this.loading = true;
            const response = await axios.get(`/deskpads/api/get-deskpads?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataDeskpads;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchSupplies(){
            this.loading = true;
            const response = await axios.get(`/supplies/api/get-supplies?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataSupplies;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchMerch(){
            this.loading = true;
            const response = await axios.get(`/merch/api/get-merch?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataMerch;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchGroupByProduct() {
            this.loading = true;
            const response = await axios.get(`/group-by-product/api/get-group-by-product?visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            this.products = data.dataGroupByProduct;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        async fetchSearch() {
            this.loading = true;
            const searchQueryString = String(this.searchQuery);
            const sanitizedQuery = searchQueryString.replace(/[^a-zA-Z0-9\s]/g, '').trim();
            
            if (!sanitizedQuery) {
                alert('Please enter a valid search query.');
                window.location.href = `/error?search=${this.searchQuery}`;
                return;
            }
            const response = await axios.get(`/search/api/get-search?search=${sanitizedQuery}&visibleCount=${this.visibleCount}`); // Get data from the server
            const data = response.data;
            if (parseInt(data.totalProducts) === 0){
                window.location.href = `/error?search=${this.searchQuery}`;
                return;
            }
            this.products = data.dataSearchProduct;
            this.product.quantity = data.totalProducts;
            this.loading = false;
        },
        addToCart(product) {
            $.ajax({
                url: '/shopping-cart/add', 
                method: 'POST',                      
                contentType: 'application/json',   
                data: JSON.stringify({             
                    ProductID: product.productid           
                }),
                success: function(response) {
                    // Xử lý khi gọi API thành công
                    console.log("Success:", response);
                    alert(response.message);
                },
                error: function(xhr, status, error) {
                    // Xử lý lỗi
                    console.error("Error:", error);
                    alert("Có lỗi xảy ra, vui lòng thử lại.");
                }
            });
        },
        loadMore() {
            this.visibleCount += 12;
            if (this.product.type === 'Keyboards') {
                this.fetchKitPhim();
            }
            else if (this.product.type === 'Kecap') {
                this.fetchKeCap();
            }
            else if (this.product.type === 'Switch') {
                this.fetchSwitch();
            }
            else if (this.product.type === 'Accessories') {
                this.fetchDeskpads();
            }
            else if (this.product.type === 'Supplies') {
                this.fetchSupplies();
            }
            else if (this.product.type === 'Merch') {
                this.fetchMerch();
            }
            else if (this.product.type === 'GroupBy Product') {
                this.fetchGroupByProduct();
            }
            else if (this.product.type === 'Search Product') {
                this.fetchSearch();
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
        if (this.product.type === 'Keyboards') {
            this.fetchKitPhim();
        }
        else if (this.product.type === 'Kecap') {
            this.fetchKeCap();
        }
        else if (this.product.type === 'Switch') {
            this.fetchSwitch();
        }
        else if (this.product.type === 'Deskpads') {
            this.fetchDeskpads();
        }
        else if (this.product.type === 'Supplies') {
            this.fetchSupplies();
        }
        else if (this.product.type === 'Merch') {
            this.fetchMerch();
        }
        else if (this.product.type === 'GroupBy Product') {
            this.fetchGroupByProduct();
        }
        else if (this.product.type === 'Search Product') {
            this.fetchSearch();
        }
    },
    template: `
    <div v-if="loading" class="loading-spinner d-flex justify-content-center align-items-center">
        <!-- You can use any loading spinner here -->
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-else>
        <!-- Your existing content goes here -->
        <div class="container col-10 mt-3">
            <div class="img-container mx-auto text-center">
                <img :src="imagePoster" class="img-fluid h-100" alt="Tiêu đề">
            </div>

            <div class="responsive-font fw-bold mt-4 mb-4">
                <div class="row">
                    <div class="col-9">
                        <span class="text-danger me-2">{{ product.type }}</span>
                        <span class="text-success ms-2">Amount: {{ product.quantity }}</span>
                    </div>
                    <filter-product @filter-change="filterProducts" />
                </div>
            </div>

            <div class="row">
                <product-card v-for="product in visibleProducts" :key="product.productid" :product="product" :type="productType" @add-to-cart="addToCart"></product-card>
            </div>
            <div class="text-center my-4">
                <button class="btn btn-secondary" @click="loadMore">Load More</button>
            </div>
        </div>
    </div>
    `
};