

// Define the filter
export default {
    template: `
        <div class="dropdown col-3">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Filter Product
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li class="dropdown-item" @click="filterProducts('price')">Low Price to High Price</li>
                <li class="dropdown-item" @click="filterProducts('priceDesc')">High Price to Low Price</li>
            </ul>
        </div>
    `,
    methods: {
        filterProducts(criteria) {
            this.$emit('filter-change', criteria);
        }
    }
};