
new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data:{
        totalUsers: 0,
        totalRevenue: 0,
        topSellingProducts: [],
        chartData: 
            {
            labels: [],
            datasets: [{
                label: 'Total Revenue',
                backgroundColor: '#f87979',
                data: []
            }],
        },
        chartOptions: {
            responsive: true,
            maintainAspectRatio: false
        }
    },
    mounted() {
        // Fetch the total users and total revenue from the server
        this.fetchTotals();
        // Fetch the top selling products from the server
        this.fetchTopSellingProducts();
    },
    
    methods: {
        async fetchTotals() {
            try {
                const userResponse = await axios.get('/admin/monthly-sales/api/total-users');
                const revenueResponse = await axios.get('/admin/monthly-sales/api/total-revenue');
                
                this.totalUsers = userResponse.data.totalUsers;
                this.totalRevenue = revenueResponse.data.totalRevenue;
            } catch (error) {
                console.error('Error fetching totals:', error);
            }
        },
        async fetchTopSellingProducts() {
            try {
                const response = await axios.get('/admin/monthly-sales/api/top-selling-products');
                this.topSellingProducts = response.data.dataMonthlySales;

            } catch (error) {
                console.error('Error fetching top selling products:', error);
            }
        }
    },
});