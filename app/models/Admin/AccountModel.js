const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu

class accountModel {
    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async findAccountAdmin(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Admin 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }


}

module.exports = accountModel;
