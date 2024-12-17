import ProductPage from '../ProductPage.js';

new Vue({
    el: '#app',
    render: h => h(ProductPage, {
        props: {
            productType: 'Search Product',
            searchQuery: $('#search').data('search-query')
        }
    })
});