const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu
const fs = require('fs');
const path = require('path');

class shoppingCartModel {

    // Lấy product trong giỏ hàng
    static async getProductToShoppingCart(UserID, ProductID) {
        try {
            // Bắt đầu transaction
            await pool.query('BEGIN');

            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            const checkQuery = `
            SELECT * FROM ShoppingCart 
            WHERE UserID = $1 AND ProductID = $2;
        `;
            const checkResult = await pool.query(checkQuery, [UserID, ProductID]);

            if (checkResult.rows.length > 0) {
                return checkResult.rows[0]; // Trả về danh sách các sản phẩm trong giỏ hàng
            } else {
                return []; // Nếu không có sản phẩm nào trong giỏ hàng
            }
        } catch (err) {
            // Rollback nếu có lỗi
            await pool.query('ROLLBACK');
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
            throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
        }
    }


    // Thêm product vào giỏ hàng
    static async addProductToShoppingCart(UserID, ProductID, Quantity) {
        try {
            // Bắt đầu transaction
            await pool.query('BEGIN');

            // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
            const checkQuery = `
                SELECT * FROM ShoppingCart 
                WHERE UserID = $1 AND ProductID = $2;
            `;
            const checkResult = await pool.query(checkQuery, [UserID, ProductID]);

            if (checkResult.rows.length > 0) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng thêm 1
                const updateQuery = `
                    UPDATE ShoppingCart 
                    SET Quantity = Quantity + $3
                    WHERE UserID = $1 AND ProductID = $2;
                `;
                await pool.query(updateQuery, [UserID, ProductID, Quantity]);
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng với Quantity = 1
                const insertQuery = `
                    INSERT INTO ShoppingCart (UserID, ProductID, Quantity) 
                    VALUES ($1, $2, $3);
                `;
                await pool.query(insertQuery, [UserID, ProductID, Quantity]);
            }

            // Commit transaction
            await pool.query('COMMIT');
            return { success: true, message: 'Product added to shopping cart successfully' };
        } catch (err) {
            // Rollback nếu có lỗi
            await pool.query('ROLLBACK');
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
            throw new Error('Lỗi khi thêm sản phẩm vào giỏ hàng');
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    static async updateProductQuantity(UserID, ProductID, Quantity) {
        try {
            if (Quantity === 0) {
                // Xóa sản phẩm khỏi giỏ hàng nếu số lượng là 0
                const deleteQuery = `
                    DELETE FROM ShoppingCart 
                    WHERE UserID = $1 AND ProductID = $2;
                `;
                await pool.query(deleteQuery, [UserID, ProductID]);
                return { success: true, message: 'Product removed from shopping cart' };
            } else {
                // Cập nhật số lượng sản phẩm
                const updateQuery = `
                    UPDATE ShoppingCart 
                    SET Quantity = $1
                    WHERE UserID = $2 AND ProductID = $3;
                `;
                await pool.query(updateQuery, [Quantity, UserID, ProductID]);
                return { success: true, message: 'Product quantity updated successfully' };
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng sản phẩm:', err);
            throw new Error('Lỗi khi cập nhật số lượng sản phẩm');
        }
    }

    static async getAllProductsInCart(UserID) {
        try {
            // Cập nhật số lượng trong giỏ hàng nếu lớn hơn số lượng hiện có
            const updateQuery = `
                UPDATE ShoppingCart
                SET quantity = p.quantity
                FROM Product p
                WHERE ShoppingCart.productid = p.productid AND ShoppingCart.userid = $1 AND ShoppingCart.quantity > p.quantity;
            `;
            await pool.query(updateQuery, [UserID]);

            // Lấy thông tin sản phẩm sau khi cập nhật
            const query = `
                SELECT p.productid, p.productname, p.oldprice, p.currentprice, p.imagepath, p.categoryid, p.quantity as total, s.quantity, p.type
                FROM ShoppingCart s
                JOIN Product p ON s.productid = p.productid
                WHERE s.userid = $1
                ORDER BY p.productid;
            `;

            const result = await pool.query(query, [UserID]);

            if (result.rows.length > 0) {
                // Duyệt qua danh sách sản phẩm để thêm đường dẫn ảnh đầu tiên
                const productsWithImages = await Promise.all(result.rows.map(async (product) => {
                    const folderPath = path.join(__dirname, '../../../public', product.imagepath);
                    try {
                        const files = fs.readdirSync(folderPath);
                        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
                        product.firstImage = imageFiles.length > 0 ? `${product.imagepath}/${imageFiles[0]}` : '/path/to/default-image.jpg';
                    } catch (err) {
                        console.error(`Không thể đọc thư mục ảnh: ${folderPath}`, err);
                        product.firstImage = '/path/to/default-image.jpg'; // Ảnh mặc định nếu xảy ra lỗi
                    }
                    return product;
                }));
                return productsWithImages;
            } else {
                return []; // Nếu không có sản phẩm nào trong giỏ hàng
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông tin sản phẩm từ giỏ hàng:', err);
            throw new Error('Lỗi khi lấy thông tin sản phẩm');
        }
    }


    // Lấy thông tin product
    static async getInfomation(productid) {
        try {
            const query = `
                SELECT *
                FROM Product
                WHERE ProductID = $1;
            `;

            const result = await pool.query(query, [productid]);

            if (result.rows.length > 0) {
                return result.rows[0]; // Trả về danh sách các sản phẩm trong giỏ hàng
            } else {
                return []; // Nếu không có sản phẩm nào trong giỏ hàng
            }
        } catch (err) {
            console.error('Lỗi khi lấy thông tin sản phẩm từ giỏ hàng:', err);
            throw new Error('Lỗi khi lấy thông tin sản phẩm');
        }
    }



}

module.exports = shoppingCartModel;
