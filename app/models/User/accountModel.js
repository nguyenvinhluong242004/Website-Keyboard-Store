const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class accountModel {
    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async findAccountByEmail(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM AccountType 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @param {string} googleId - googleId
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async findAccountByEmailAndGoogleID(email, googleId) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM AccountType 
                 WHERE email = $1 AND passwordorgoogleid = $2 AND type='Google'`,
                [email, googleId]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Lấy thông tin tài khoản dựa trên email
     * @param {string} email - Email 
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async getInforAccountByEmail(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Users 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Thêm thông tin User
     * @param {string} email - Email 
     * @param {string} username - Username
     * @param {string} passwordorgoogleid - mật khẩu đã băm hoặc ggID
     * @returns {Status} - Trả về lỗi nếu lỗi kết nối 
     */
    static async addUserIntoDataBase(username, email, passwordorgoogleid, type) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Bắt đầu transaction

            // Thêm dữ liệu vào bảng AccountType
            const result = await client.query(
                `INSERT INTO AccountType(email, passwordorgoogleid, type) 
                 VALUES($1, $2, $3)`,
                [email, passwordorgoogleid, type]
            );

            // Thêm dữ liệu vào bảng Users
            await client.query(
                `INSERT INTO Users(username, email, phone) 
                 VALUES($1, $2, $3)`,
                [username, email, "null"]
            );

            await client.query('COMMIT'); // Xác nhận transaction
            console.log('Thêm tài khoản và cấp độ ban đầu thành công!');
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại nếu có lỗi
            console.error('Lỗi khi thêm tài khoản và cấp độ!', err);
            throw new Error('Lỗi thêm dữ liệu vào cơ sở dữ liệu');
        } finally {
            client.release(); // Giải phóng kết nối
        }
    }

    /**
     * Thay đổi mật khẩu 
     * @param {string} email - Email 
     * @param {string} hashedNewPassword - Mật khẩu mới
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async changePasswordByEmail(email, hashedNewPassword) {
        try {
            const result = await pool.query(
                `UPDATE AccountType 
                 SET passwordorgoogleid = $2
                 WHERE email = $1`,
                [email, hashedNewPassword]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Thay đổi thông tin người dùng 
     * @param {string} email - Email 
     * @param {string} username - Tên
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async changeInfoByEmail(email, username, sdt) {
        try {
            const result = await pool.query(
                `UPDATE Users 
                 SET username = $1, phone = $2 
                 WHERE email = $3`,
                [username, sdt, email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    

}

module.exports = accountModel;
