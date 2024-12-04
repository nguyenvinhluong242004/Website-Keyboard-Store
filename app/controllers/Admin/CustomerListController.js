const customerModel = require('../../models/Admin/customerModel');
const authPass = require('../../config/AuthPass');

class CustomerListController {

    // [GET] /
    async index(req, res) {
        const { page = 1 } = req.query;
        const perPage = 5; // Số khách hàng mỗi trang
        const offset = (page - 1) * perPage; // Tính toán vị trí bắt đầu của trang hiện tại

        // Lấy dữ liệu khách hàng và tổng số khách hàng
        const result = await customerModel.getListCustomer(offset, perPage);
        const { users, totalCustomer } = result;

        const totalPages = Math.ceil(totalCustomer / perPage);

        res.render('Admin/customer-list', {
            layout: 'layoutAdmin',
            title: 'Customer List',
            data: users, // Dữ liệu khách hàng
            page: Number(page), // Trang hiện tại
            total_pages: totalPages, // Tổng số trang
            per_page: perPage, // Số khách hàng mỗi trang
            customHead: `
            <link rel="stylesheet" href="Login/style.css">
        `
        });
    }

    // [POST] /detail
    async customerDetails(req, res) {
        const { id } = req.body;  // Lấy Customer ID từ body yêu cầu
        try {
            const customerDetails = await customerModel.getCustomerById(id);  // Gọi hàm lấy thông tin chi tiết
            console.log(customerDetails)
            res.json(customerDetails);  // Trả lại thông tin chi tiết người dùng
        } catch (err) {
            console.error('Lỗi khi lấy thông tin khách hàng:', err);
            res.status(500).json({ error: 'Không thể lấy thông tin khách hàng.' });
        }
    }


}

module.exports = new CustomerListController;