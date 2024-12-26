const dashboardModel = require('../../models/Admin/dashboardModel');

class DashboardController {
    async index(req, res) {
        try {
            const stats = await dashboardModel.getDashboardStats();
            const { revenueLabels, revenueData } = await dashboardModel.getRevenueGrowth(2024);
            const productsSold = await dashboardModel.getProductsSold();

            const productLabels = productsSold && productsSold.length > 0
                ? productsSold.map(item => item.categoryname)
                : [];
            const productData = productsSold && productsSold.length > 0
                ? productsSold.map(item => item.quantity_sold)
                : [];

            // Render view
            res.render('Admin/dashboard', {
                layout: 'layoutAdmin',
                title: 'Dashboard',
                stats,
                revenueLabels: JSON.stringify(revenueLabels), // Chuyển thành chuỗi JSON
                revenueData: JSON.stringify(revenueData),
                productLabels: JSON.stringify(productLabels),
                productData: JSON.stringify(productData),
                admin: req.session.admin,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    }

}

module.exports = new DashboardController;
