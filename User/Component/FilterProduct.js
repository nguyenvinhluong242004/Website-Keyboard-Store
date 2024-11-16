import { createApp } from 'vue';

// Define the filter
export default {
    template: `
        <div class="dropdown col-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Lọc sản phẩm
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li class="dropdown-item" @click="filterProducts('all')">Tất cả</li>
                <li class="dropdown-item" @click="filterProducts('price')">Giá thấp đến cao</li>
                <li class="dropdown-item" @click="filterProducts('priceDesc')">Giá cao đến thấp</li>
            </ul>
        </div>
    `,
    methods: {
        filterProducts(criteria) {
            this.$emit('filter-change', criteria);
        }
    }
};