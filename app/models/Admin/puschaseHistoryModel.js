const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class PuschaseHistoryModel {
    /**
     * Lấy danh sách user
     */
    static async getListOrders(offset, perPage = 5) {
        try {
            // Lấy danh sách các đơn hàng có trạng thái 'Completed'
            const result = await pool.query(
                `SELECT o.OrderID, TO_CHAR(o.OrderDate, 'YYYY-MM-DD') AS OrderDate, o.TotalAmount, o.PaymentMethod
                 FROM Orders o
                 WHERE o.OrderStatus = 'Completed'
                 LIMIT $1 OFFSET $2`,
                [perPage, offset]
            );

            // Tính tổng số đơn hàng hoàn thành
            const countResult = await pool.query(
                `SELECT COUNT(*) AS total FROM Orders WHERE OrderStatus = 'Completed'`
            );
            const totalOrders = countResult.rows[0].total;

            return {
                orders: result.rows, // Danh sách đơn hàng
                totalOrders: totalOrders // Tổng số đơn hàng hoàn thành
            };
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
                `SELECT o.OrderID, TO_CHAR(o.OrderDate, 'YYYY-MM-DD') AS OrderDate, o.TotalAmount, o.OrderStatus, o.PaymentMethod,
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
    

}

module.exports = PuschaseHistoryModel;
