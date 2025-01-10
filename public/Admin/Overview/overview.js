

new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data:{
        totalUsers: 0,
        totalRevenue: 0,
        years: [2020, 2021, 2022, 2023],
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
    async mounted() {
        // Fetch the total users and total revenue from the server
        this.fetchTotals();
        // Fetch the chart data from the server
        await this.fecthDataChart();
    },
    
    methods: {
        async fetchTotals() {
            try {
                const userResponse = await axios.get('/admin/overview/api/total-users');
                const revenueResponse = await axios.get('/admin/overview/api/total-revenue');
                
                this.totalUsers = userResponse.data.totalUsers;
                this.totalRevenue = revenueResponse.data.totalRevenue;
            } catch (error) {
                console.error('Error fetching totals:', error);
            }
        },
        async fecthDataChart(){
            try {
                let currentDate = new Date();
                let currentYear = currentDate.getFullYear();
                let currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        
                let labels = [];
                let data = [];

                for (let month = 1; month <= currentMonth; month++) {
                    const response = await axios.get(`/admin/overview/api/chart-revenue?month=${month}&year=${currentYear}`);
                    labels.push(new Date(currentYear, month - 1).toLocaleString('default', { month: 'long' })); // Add month name to labels
                    data.push(response.data.totalRevenue);
                }

                this.chartData.labels = labels;
                this.chartData.datasets[0].data = data;

            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        },
    },
});