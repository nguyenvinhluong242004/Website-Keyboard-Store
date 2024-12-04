Vue.component('chart-component', {
    extends: VueChartJs.Bar,
    props: ['data', 'options'],
    watch: {
        data: {
            handler() {
                this.renderChart(this.data, this.options);
            },
            deep: true
        }
    },
    mounted() {
        this.renderChart(this.data, this.options);
    }
});