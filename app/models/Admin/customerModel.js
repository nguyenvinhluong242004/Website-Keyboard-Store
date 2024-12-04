const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class customerModel {
    /**
     * Lấy danh sách user
     */
    static async getListCustomer(offset, perPage = 5) {
        try {
            // Truy vấn dữ liệu khách hàng với phân trang
            const result = await pool.query(
                `SELECT * FROM Users
                 LIMIT $1 OFFSET $2`,
                [perPage, offset] // Sử dụng các tham số perPage và offset
            );

            // Truy vấn tổng số khách hàng để tính toán tổng số trang
            const countResult = await pool.query(
                `SELECT COUNT(*) AS total FROM Users`
            );
            const totalCustomer = countResult.rows[0].total;

            return {
                users: result.rows, // Dữ liệu khách hàng cho trang hiện tại
                totalCustomer: totalCustomer // Tổng số khách hàng
            };

        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Lấy thông tin user và địa chỉ của user
     */
    static async getCustomerById(id) {
        try {
            // Truy vấn lấy thông tin người dùng và địa chỉ của họ
            const result = await pool.query(
                `SELECT u.UserID, u.Username, u.Email, u.Phone, 
                        a.Province, a.District, a.Ward, a.Street
                 FROM Users u
                 INNER JOIN Address a ON u.UserID = a.UserID
                 WHERE u.UserID = $1`,  // Lọc theo UserID
                [id]
            );

            if (result.rows.length === 0) {
                throw new Error('User not found');
            }

            // Lấy thông tin người dùng và địa chỉ
            const user = {
                userID: result.rows[0].userid,
                username: result.rows[0].username,
                email: result.rows[0].email,
                phone: result.rows[0].phone,
                address: {
                    province: result.rows[0].province,
                    district: result.rows[0].district,
                    ward: result.rows[0].ward,
                    street: result.rows[0].street
                }
            };

            return user;

        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }






}

module.exports = customerModel;
