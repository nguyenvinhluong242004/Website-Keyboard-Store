const { getGroupByProduct } = require('../../models/User/get_product_gb.js');
const controller = {};

// Render Kit Phim
controller.showDetailGroupby = async (req, res) => {
    const id = req.params.id || 1;
    const visibleCount = req.query.visibleCount || 1; // Lấy visibleCount từ query

    try {
        // Lấy dữ liệu từ model và truyền visibleCount
        const data = await getGroupByProduct(id, visibleCount);

        console.log("data controller:", data);

        // Render view với dữ liệu
        res.render('User/detail-groupby', {
            layout: 'layoutUser',
            title: 'DetailGroupby',
            customHead: `
                <link rel="stylesheet" href="/User/DetailGroupBy/detail-groupby.css">
                <script defer src="/User/DetailGroupBy/groupby.js"></script>
            `,
            idGroupby:id,
            data: JSON.stringify(data) // Chuyển dữ liệu sang JSON để Vue.js sử dụng
        });
    } catch (error) {
        console.error('Error fetching data from model:', error.message);
        res.status(500).send('Error fetching data: ' + error.message);
    }
};

module.exports = controller;
