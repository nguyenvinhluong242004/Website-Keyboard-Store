const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class PuschaseHistoryModel {
    /**
     * Lấy danh sách user
     */
    static async getListOrders(status = '', offset, perPage = 5) {
        try {

            if (status === '') {
                // Lấy danh sách các đơn hàng có trạng thái 'Completed'
                const result = await pool.query(
                    `SELECT o.OrderID, TO_CHAR(o.OrderDate, 'YYYY-MM-DD') AS OrderDate, o.TotalAmount, o.PaymentMethod,  o.OrderStatus
                    FROM Orders o
                    ORDER BY o.orderdate DESC
                    LIMIT $1 OFFSET $2`,
                    [perPage, offset]
                );

                // Tính tổng số đơn hàng hoàn thành
                const countResult = await pool.query(
                    `SELECT COUNT(*) AS total FROM Orders`
                );
                const totalOrders = countResult.rows[0].total;

                return {
                    orders: result.rows, // Danh sách đơn hàng
                    totalOrders: totalOrders // Tổng số đơn hàng hoàn thành
                };
            }
            else {
                // Lấy danh sách các đơn hàng có trạng thái 'Completed'
                const result = await pool.query(
                    `SELECT o.OrderID, TO_CHAR(o.OrderDate, 'YYYY-MM-DD') AS OrderDate, o.TotalAmount, o.PaymentMethod,  o.OrderStatus
                    FROM Orders o
                    WHERE o.OrderStatus = $3
                    ORDER BY o.orderdate DESC
                    LIMIT $1 OFFSET $2`,
                    [perPage, offset, status]
                );

                // Tính tổng số đơn hàng hoàn thành
                const countResult = await pool.query(
                    `SELECT COUNT(*) AS total FROM Orders WHERE OrderStatus = $1`, [status]
                );
                const totalOrders = countResult.rows[0].total;

                return {
                    orders: result.rows, // Danh sách đơn hàng
                    totalOrders: totalOrders // Tổng số đơn hàng hoàn thành
                };
            }


        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Lấy thông tin user và địa chỉ của user
     */
    static async getOrderDetails(orderId) {
        try {
            // Lấy thông tin đơn hàng và khách hàng
            const orderResult = await pool.query(
                `SELECT o.OrderID, TO_CHAR(o.OrderDate, 'YYYY-MM-DD') AS OrderDate, o.TotalAmount, o.OrderStatus, o.PaymentMethod, o.OrderStatus,
                        u.Username AS CustomerName
                 FROM Orders o
                 INNER JOIN Users u ON o.UserID = u.UserID
                 WHERE o.OrderID = $1`,
                [orderId]
            );

            if (orderResult.rows.length === 0) {
                throw new Error('Order not found');
            }

            const order = orderResult.rows[0];

            // Lấy chi tiết sản phẩm trong đơn hàng
            const detailsResult = await pool.query(
                `SELECT p.ProductName, od.Quantity, od.UnitPrice
                 FROM OrderDetail od
                 INNER JOIN Product p ON od.ProductID = p.ProductID
                 WHERE od.OrderID = $1`,
                [orderId]
            );

            return {
                order: {
                    id: order.orderid,
                    date: order.orderdate,
                    totalAmount: order.totalamount,
                    status: order.orderstatus,
                    paymentMethod: order.paymentmethod,
                    customerName: order.customername,
                },
                details: detailsResult.rows // Danh sách sản phẩm
            };
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async changeStatus(orderId, status) {
        const client = await pool.connect(); // Kết nối cơ sở dữ liệu
        try {
            await client.query('BEGIN'); // Bắt đầu giao dịch

            // Cập nhật trạng thái đơn hàng
            const updateResult = await client.query(
                `UPDATE Orders
                 SET OrderStatus = $1
                 WHERE OrderID = $2
                 RETURNING OrderID, OrderStatus`,
                [status, orderId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Order not found or unable to update');
            }

            // Nếu trạng thái là "Cancelled", cập nhật lại số lượng sản phẩm
            if (status === 'Refuse') {
                // Lấy danh sách sản phẩm trong OrderDetail
                const orderDetails = await client.query(
                    `SELECT ProductID, Quantity
                     FROM OrderDetail
                     WHERE OrderID = $1`,
                    [orderId]
                );

                // Cập nhật lại số lượng sản phẩm trong bảng Product
                for (const detail of orderDetails.rows) {
                    await client.query(
                        `UPDATE Product
                         SET Quantity = Quantity + $1
                         WHERE ProductID = $2`,
                        [detail.quantity, detail.productid]
                    );
                }
            }

            await client.query('COMMIT'); // Kết thúc giao dịch thành công
            return updateResult.rows[0]; // Trả về thông tin đơn hàng đã cập nhật
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại giao dịch nếu có lỗi
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        } finally {
            client.release(); // Đóng kết nối
        }
    }




}

module.exports = PuschaseHistoryModel;
