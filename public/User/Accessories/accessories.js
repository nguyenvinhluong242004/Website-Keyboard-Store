import ProductPage from '../ProductPage.js';

new Vue({
    el: '#app',
    render: h => h(ProductPage, {
        props: {
            productType: 'Accessories'
        }
    })
});