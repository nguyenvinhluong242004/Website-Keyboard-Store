const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class DashboardModel {
    // Lấy doanh thu hàng tháng từ các đơn hàng đã hoàn thành
    async getRevenueGrowth(year) {
        try {
            // Tạo bảng các tháng trong năm
            const query = `
                SELECT months.month, COALESCE(SUM(o.totalamount), 0) AS revenue
                FROM (
                    -- Tạo bảng tháng từ 1 đến 12
                    SELECT generate_series(1, 12) AS month
                ) months
                LEFT JOIN Orders o ON EXTRACT(MONTH FROM o.OrderDate) = months.month
                WHERE EXTRACT(YEAR FROM o.OrderDate) = $1
                GROUP BY months.month
                ORDER BY months.month;
            `;
            // Truyền year vào câu truy vấn
            const result = await pool.query(query, [year]);

            // Tạo mảng doanh thu và tháng từ kết quả truy vấn
            const revenueData = new Array(12).fill(0); // Mảng doanh thu, mặc định là 0 cho tất cả các tháng
            const revenueLabels = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];

            // Cập nhật doanh thu cho các tháng có dữ liệu
            result.rows.forEach(row => {
                revenueData[row.month - 1] = row.revenue; // Tháng bắt đầu từ 1, nên trừ 1 khi truy cập mảng
            });

            //console.log(revenueLabels)

            return { revenueLabels, revenueData };

        } catch (error) {
            console.error('Error in getRevenueGrowth:', error.message);
            throw new Error('Failed to fetch revenue growth.');
        }
    }

    // Lấy số lượng sản phẩm đã bán theo danh mục
    async getProductsSold() {
        try {
            const query = `
                 


                -- Lấy số lượng sản phẩm đã bán theo danh mục
                WITH Sold AS (
                    -- Lấy số lượng sản phẩm đã bán theo danh mục
                    SELECT 
                        c.CategoryName, 
                        SUM(CASE 
                                WHEN od.ProductID IS NOT NULL THEN od.Quantity
                                ELSE 0 -- Nếu không có thông tin, trả về 0
                            END) AS quantity_sold
                    FROM OrderDetail od
                    LEFT JOIN Product p ON od.ProductID = p.ProductID
                    JOIN Category c ON p.CategoryID = c.CategoryID -- Liên kết với Category qua Product
                    JOIN Orders o ON od.OrderID = o.OrderID 
                    GROUP BY c.CategoryName
                )
                -- Lấy tất cả danh mục và tính số lượng bán (nếu không có sản phẩm bán thì trả về 0)
                SELECT 
                    c.CategoryName,
                    COALESCE(Sold.quantity_sold, 0) AS quantity_sold -- Nếu không có sản phẩm bán thì trả về 0
                FROM Category c
                LEFT JOIN Sold ON c.CategoryName = Sold.CategoryName;
                            `;

            const result = await pool.query(query);
            console.log(result.rows)
            return result.rows;
        } catch (error) {
            console.error('Error in getProductsSold:', error.message);
            throw new Error('Failed to fetch products sold.');
        }
    }


    // Lấy tổng số lượt người dùng, doanh thu, và sản phẩm đã bán
    async getDashboardStats() {
        try {
            const query = `
                SELECT
                    (SELECT COUNT(*) FROM Users) AS total_users,
                    (SELECT SUM(totalamount)
                     FROM Orders) AS total_revenue,
                    (SELECT SUM(od.Quantity)
                     FROM OrderDetail od
                     JOIN Orders o ON od.OrderID = o.OrderID) AS total_products_sold;
            `;
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Error in getDashboardStats:', error.message);
            throw new Error('Failed to fetch dashboard stats.');
        }
    }
}

module.exports = new DashboardModel;
