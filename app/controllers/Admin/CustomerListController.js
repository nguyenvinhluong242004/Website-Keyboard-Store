const customerModel = require('../../models/Admin/customerModel');

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
            admin: req.session.admin,
            page: Number(page), // Trang hiện tại
            total_pages: totalPages, // Tổng số trang
            per_page: perPage, // Số khách hàng mỗi trang
            customHead: `
            <link rel="stylesheet" href="/Admin/Login/style.css">
        `
        });
    }

    // [GET] /load-customers
    async loadCustomers(req, res) {
        const { page = 1 } = req.query;
        const perPage = 5; // Số lượng khách hàng mỗi trang
        const offset = (page - 1) * perPage; // Tính toán offset

        try {
            // Lấy danh sách khách hàng và tổng số khách hàng từ mô hình
            const { users, totalCustomer } = await customerModel.getListCustomer(offset, perPage);
            const totalPages = Math.ceil(totalCustomer / perPage); // Tính tổng số trang

            // Tạo HTML cho danh sách khách hàng
            const customersHtml = users.map(customer => { // Đổi từ 'customers' thành 'users'
                return `
                <tr>
                    <td>${customer.userid}</td>
                    <td>${customer.username}</td>
                    <td>${customer.phone}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-details" data-id="${customer.userid}">View Details</button>
                    </td>
                </tr>
            `;
            }).join('');

            // Tạo HTML cho phân trang
            const paginationHtml = `
            <li class="page-item ${page == 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0);" data-page="${Number(page) - 1}">«</a>
            </li>
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => {
                return `
                    <li class="page-item ${pg == page ? 'active' : ''}">
                        <a class="page-link" href="javascript:void(0);" data-page="${pg}">${pg}</a>
                    </li>
                `;
            }).join('')}
            <li class="page-item ${page == totalPages ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0);" data-page="${Number(page) + 1}">»</a>
            </li>
        `;

            // Trả về HTML cho khách hàng và phân trang
            res.json({ customersHtml, paginationHtml });
        } catch (err) {
            console.error('Lỗi khi lấy danh sách khách hàng:', err);
            res.status(500).send('Không thể tải danh sách khách hàng.');
        }
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