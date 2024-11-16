const bcrypt = require('bcrypt'); // Băm mật khẩu ( 1 chiều )

// Xác thực mật khẩu với mật khẩu đã băm
async function verifyPassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Lỗi khi xác thực mật khẩu:', error);
    }
}

// Băm 1 chiều
async function hashPassword(password) {
    try {
        const saltRounds = 10; // số vòng băm, càng cao càng bảo mật
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Lỗi khi băm mật khẩu:', error);
    }
}

module.exports = {
    verifyPassword,
    hashPassword
}