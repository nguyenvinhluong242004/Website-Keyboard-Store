const puschaseHistoryModel = require('../../models/Admin/puschaseHistoryModel');

class PurchaseHistoryController {

    // [GET] /
    async index(req, res) {
        const { page = 1 } = req.query;
        const perPage = 5;
        const offset = (page - 1) * perPage;

        try {
            const { orders, totalOrders } = await puschaseHistoryModel.getListOrders(offset, perPage);
            const totalPages = Math.ceil(totalOrders / perPage);

            res.render('Admin/purchase-history', {
                layout: 'layoutAdmin',
                title: 'Order List',
                orders, // Dữ liệu các đơn hàng
                admin: req.session.admin,
                page: Number(page),
                total_pages: totalPages,
            });
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', err);
            res.status(500).send('Không thể tải danh sách đơn hàng.');
        }
    }

    // [GET] /load-orders
    async loadOrders(req, res) {
        const { page = 1 } = req.query;
        const perPage = 5;
        const offset = (page - 1) * perPage;

        try {
            const { orders, totalOrders } = await puschaseHistoryModel.getListOrders(offset, perPage);
            const totalPages = Math.ceil(totalOrders / perPage);

            const ordersHtml = orders.map(order => {
                return `
                <tr>
                    <td>${order.orderid}</td>
                    <td>${order.orderdate}</td>
                    <td>${order.totalamount}</td>
                    <td>${order.paymentmethod}</td>
                    <td>
                        <button class="btn btn-sm btn-primary view-details" data-id="${order.orderid}">View Details</button>
                    </td>
                </tr>
            `;
            }).join('');

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

            res.json({ ordersHtml, paginationHtml });
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', err);
            res.status(500).send('Không thể tải danh sách đơn hàng.');
        }
    }


    // [POST] /detail
    async orderDetails(req, res) {
        const { id } = req.body; // Lấy OrderID từ yêu cầu
        try {
            const data = await puschaseHistoryModel.getOrderDetails(id);
            res.json(data); // Trả dữ liệu về dưới dạng JSON
        } catch (err) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
            res.status(500).json({ error: 'Không thể tải chi tiết đơn hàng.' });
        }
    }


}

module.exports = new PurchaseHistoryController;